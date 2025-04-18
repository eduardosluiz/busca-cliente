import { NextResponse } from 'next/server';
import { SearchResult, searchBusinesses } from '@/services/searchService';

interface CNPJResult {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal_descricao: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  ddd_telefone_1: string;
  email: string;
  situacao_cadastral: string;
  data_inicio_atividade: string;
}

interface BusinessResult {
  id: string;
  name: string;
  category: string;
  location: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
}

async function searchCNPJ(cnpj: string): Promise<SearchResult> {
  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do CNPJ');
  }

  const data: CNPJResult = await response.json();

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
    }
  };
}

// Dados mockados para simular resultados de busca
const mockDatabase: SearchResult[] = [
  {
    id: '1',
    name: 'Empresa A',
    category: 'Serviços',
    location: 'Porto Alegre, RS',
    phone: '(51) 99999-9999',
    email: 'contato@empresaa.com.br',
    website: 'www.empresaa.com.br',
    status: 'Ativa',
    openDate: '2020-01-01',
    address: {
      street: 'Av. Assis Brasil',
      number: '1234',
      neighborhood: 'Sarandi',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '91110-000'
    }
  },
  {
    id: '2',
    name: 'Empresa B',
    category: 'Comércio',
    location: 'São Paulo, SP',
    phone: '(11) 98888-8888',
    email: 'contato@empresab.com.br',
    website: 'www.empresab.com.br',
    status: 'Ativa',
    openDate: '2019-05-15',
    address: {
      street: 'Av. Paulista',
      number: '567',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-000'
    }
  },
  {
    id: '3',
    name: 'Empresa C',
    category: 'Indústria',
    location: 'Curitiba, PR',
    phone: '(41) 97777-7777',
    email: 'contato@empresac.com.br',
    website: 'www.empresac.com.br',
    status: 'Ativa',
    openDate: '2018-10-20',
    address: {
      street: 'Rua XV de Novembro',
      number: '890',
      neighborhood: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80020-310'
    }
  }
];

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/search'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const location = searchParams.get('location')

    if (!query) {
      return NextResponse.json({
        message: 'O parâmetro de busca é obrigatório',
        results: [],
        total: 0
      })
    }

    try {
      console.log('Enviando requisição para N8N:', {
        url: N8N_WEBHOOK_URL,
        query,
        location
      })

      // Tenta enviar a requisição para o N8N
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          location,
          timestamp: new Date().toISOString()
        })
      })

      console.log('Resposta do N8N:', {
        status: n8nResponse.status,
        ok: n8nResponse.ok
      })

      if (n8nResponse.ok) {
        const data = await n8nResponse.json()
        console.log('Dados recebidos do N8N:', data)
        
        // Se os dados já estiverem no formato correto, use-os diretamente
        if (data.results && Array.isArray(data.results)) {
          return NextResponse.json(data)
        }

        // Se os dados estiverem no formato antigo (array direto), converta-os
        if (Array.isArray(data)) {
          const results: SearchResult[] = data.map((item: any, index) => ({
            id: String(index + 1),
            name: item.name || '',
            fantasyName: item.fantasy_name || '',
            category: item.category || '',
            status: item.status || 'Ativa',
            phone: item.phone || item.whatsapp || '',
            email: item.email || '',
            website: item.website || '',
            location: item.location || '',
            address: {
              street: item.street || '',
              number: item.number || '',
              complement: item.complement || '',
              neighborhood: item.neighborhood || '',
              city: item.city || '',
              state: item.state || '',
              zipCode: item.zip_code || ''
            },
            openDate: item.open_date || ''
          }))

          return NextResponse.json({
            results,
            total: results.length
          })
        }
      } else {
        console.error('Erro na resposta do N8N:', await n8nResponse.text())
      }
    } catch (n8nError) {
      console.error('Erro ao conectar com N8N:', n8nError)
    }

    console.log('Usando dados mockados como fallback')
    // Fallback para dados mockados quando N8N falha
    const filteredResults = mockDatabase.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (location && item.location.toLowerCase().includes(location.toLowerCase()))
    )

    return NextResponse.json({
      results: filteredResults,
      total: filteredResults.length,
      source: 'mock'
    })

  } catch (error) {
    console.error('Erro ao processar busca:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar a busca. Por favor, tente novamente.',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        results: [],
        total: 0
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validar se os dados recebidos do N8N estão no formato esperado
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Formato de dados inválido' },
        { status: 400 }
      )
    }

    // Mapear os dados recebidos do N8N para o formato da aplicação
    const results: SearchResult[] = data.map((item: any, index) => ({
      id: item.id || String(index + 1),
      name: item.name || '',
      fantasyName: item.fantasy_name || '',
      category: item.category || 'Engenharia',
      status: item.status || 'Ativa',
      phone: item.whatsapp !== 'unknown' ? item.whatsapp : '',
      email: item.email !== 'unknown' ? item.email : '',
      website: item.website || '',
      location: item.location || 'Brasil',
      address: {
        street: item.street || '',
        number: item.number || '',
        complement: item.complement || '',
        neighborhood: item.neighborhood || '',
        city: item.city || '',
        state: item.state || '',
        zipCode: item.zip_code || ''
      },
      openDate: item.open_date || ''
    }))

    return NextResponse.json({
      results,
      total: results.length
    })

  } catch (error) {
    console.error('Erro ao processar dados do N8N:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno ao processar dados',
        results: [],
        total: 0
      },
      { status: 500 }
    )
  }
} 