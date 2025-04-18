export interface SearchResult {
  id: string
  name: string
  fantasyName?: string
  category: string
  status: string
  size?: string
  description?: string
  location: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    fullAddress?: string
  }
  cnae: {
    code: string
    description: string
  }
  legalNature: string
  phone?: string
  email?: string
  website?: string
  openDate?: string
}

export interface SearchFilters {
  query: string
  location?: string
  category?: string
  status?: string
  size?: string
  state?: string
  city?: string
}

export interface SearchError {
  code: string
  message: string
  details?: any
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  message?: string
  error?: SearchError
}

const BRASIL_API_BASE_URL = 'https://brasilapi.com.br/api'
const RECEITAWS_API_BASE_URL = 'https://www.receitaws.com.br/v1'

async function searchCNPJ(cnpj: string): Promise<SearchResult | SearchError> {
  try {
    console.log(`[SearchService] Iniciando busca por CNPJ: ${cnpj}`)
    
    // Busca na Brasil API
    const brasilApiResponse = await fetch(`${BRASIL_API_BASE_URL}/cnpj/v1/${cnpj}`)
    
    if (!brasilApiResponse.ok) {
      console.log(`[SearchService] Brasil API falhou (${brasilApiResponse.status}), tentando ReceitaWS`)
      
      // Se falhar na Brasil API, tenta na ReceitaWS
      const receitawsResponse = await fetch(`${RECEITAWS_API_BASE_URL}/cnpj/${cnpj}`)
      
      if (!receitawsResponse.ok) {
        throw {
          code: 'CNPJ_NOT_FOUND',
          message: 'CNPJ não encontrado em nenhuma API',
          details: {
            brasilApiStatus: brasilApiResponse.status,
            receitawsStatus: receitawsResponse.status
          }
        }
      }
      
      const data = await receitawsResponse.json()
      console.log(`[SearchService] Dados encontrados na ReceitaWS`)
      return formatReceitaWSData(data)
    }

    const data = await brasilApiResponse.json()
    console.log(`[SearchService] Dados encontrados na Brasil API`)
    return formatBrasilApiData(data)
  } catch (error: any) {
    console.error('[SearchService] Erro ao buscar CNPJ:', error)
    return {
      code: error.code || 'SEARCH_ERROR',
      message: error.message || 'Erro ao buscar dados do CNPJ',
      details: error
    }
  }
}

function formatBrasilApiData(data: any): SearchResult {
  return {
    id: data.cnpj,
    name: data.razao_social,
    fantasyName: data.nome_fantasia || undefined,
    category: data.cnae_fiscal_descricao,
    location: `${data.municipio}, ${data.uf}`,
    phone: data.ddd_telefone_1 || undefined,
    email: data.email || undefined,
    status: data.situacao_cadastral,
    openDate: data.data_inicio_atividade,
    address: {
      street: data.logradouro,
      number: data.numero || undefined,
      complement: data.complemento || undefined,
      neighborhood: data.bairro,
      city: data.municipio,
      state: data.uf,
      zipCode: data.cep,
      fullAddress: `${data.logradouro}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''}, ${data.bairro}, ${data.municipio} - ${data.uf}, ${data.cep}`
    },
    cnae: {
      code: data.cnae_fiscal,
      description: data.cnae_fiscal_descricao
    },
    size: data.porte,
    legalNature: data.natureza_juridica
  }
}

function formatReceitaWSData(data: any): SearchResult {
  return {
    id: data.cnpj,
    name: data.nome,
    fantasyName: data.fantasia || undefined,
    category: data.atividade_principal[0]?.text || 'Não informada',
    location: `${data.municipio}, ${data.uf}`,
    phone: data.telefone || undefined,
    email: data.email || undefined,
    status: data.situacao,
    openDate: data.abertura,
    address: {
      street: data.logradouro,
      number: data.numero || undefined,
      complement: data.complemento || undefined,
      neighborhood: data.bairro,
      city: data.municipio,
      state: data.uf,
      zipCode: data.cep,
      fullAddress: `${data.logradouro}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''}, ${data.bairro}, ${data.municipio} - ${data.uf}, ${data.cep}`
    },
    cnae: {
      code: data.atividade_principal[0]?.code || '',
      description: data.atividade_principal[0]?.text || ''
    },
    size: data.porte,
    legalNature: data.natureza_juridica
  }
}

export async function searchBusinesses(filters: SearchFilters): Promise<SearchResponse> {
  try {
    console.log(`[SearchService] Iniciando busca com filtros:`, filters)
    
    const { query, location, category, status, size, state, city } = filters

    // Se for um CNPJ, busca diretamente
    const cnpjNumbers = query.replace(/\D/g, '')
    if (cnpjNumbers.length === 14) {
      console.log(`[SearchService] Detectado CNPJ: ${cnpjNumbers}`)
      const result = await searchCNPJ(cnpjNumbers)
      
      if ('code' in result) {
        // Se retornou um erro
        return { 
          results: [], 
          total: 0, 
          error: result,
          message: result.message 
        }
      }

      // Aplica os filtros de localização se fornecidos
      if (location && !result.location.toLowerCase().includes(location.toLowerCase())) {
        return { 
          results: [], 
          total: 0, 
          message: 'Nenhuma empresa encontrada com os critérios informados.',
          error: {
            code: 'LOCATION_MISMATCH',
            message: 'A empresa encontrada não está na localização especificada'
          }
        }
      }
      
      return { results: [result], total: 1 }
    }

    // Para outros tipos de busca
    console.log(`[SearchService] Realizando busca textual`)
    let results = mockDatabase
      .filter(item => {
        const matchesQuery = 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.fantasyName && item.fantasyName.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase()))

        const matchesLocation = !location || 
          item.location.toLowerCase().includes(location.toLowerCase()) ||
          item.address.city.toLowerCase().includes(location.toLowerCase()) ||
          item.address.state.toLowerCase().includes(location.toLowerCase())

        const matchesCategory = !category || 
          item.category.toLowerCase().includes(category.toLowerCase())

        const matchesStatus = !status || 
          item.status.toLowerCase() === status.toLowerCase()

        const matchesSize = !size || 
          (item.size && item.size.toLowerCase() === size.toLowerCase())

        const matchesState = !state || 
          item.address.state.toLowerCase() === state.toLowerCase()

        const matchesCity = !city || 
          item.address.city.toLowerCase() === city.toLowerCase()

        return matchesQuery && matchesLocation && matchesCategory && 
               matchesStatus && matchesSize && matchesState && matchesCity
      })

    console.log(`[SearchService] Encontrados ${results.length} resultados`)
    
    return {
      results,
      total: results.length,
      message: results.length === 0 ? 'Nenhuma empresa encontrada com os critérios informados.' : undefined
    }
  } catch (error) {
    console.error('[SearchService] Erro na busca:', error)
    return {
      results: [],
      total: 0,
      error: {
        code: 'SEARCH_ERROR',
        message: 'Erro ao realizar a busca',
        details: error
      },
      message: 'Ocorreu um erro ao processar sua busca. Por favor, tente novamente.'
    }
  }
}

// Mock database para testes
const mockDatabase: SearchResult[] = [
  {
    id: '1',
    name: 'Pizzaria do João',
    category: 'Restaurante - Pizzaria',
    location: 'Porto Alegre, RS',
    phone: '(51) 99999-9999',
    email: 'contato@pizzariadojoao.com.br',
    website: 'www.pizzariadojoao.com.br',
    description: 'A melhor pizzaria da região',
    status: 'Ativa',
    openDate: '2020-01-01',
    address: {
      street: 'Rua das Pizzas',
      number: '123',
      neighborhood: 'Centro',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90000-000',
      fullAddress: 'Rua das Pizzas, 123, Centro, Porto Alegre - RS, 90000-000'
    },
    size: 'Pequena Empresa',
    legalNature: 'Empresário Individual',
    cnae: {
      code: '12345678',
      description: 'Atividades de serviços de alimentação'
    }
  },
  // ... outros dados mockados existentes ...
] 