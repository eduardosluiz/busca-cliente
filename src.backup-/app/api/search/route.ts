import { NextResponse } from 'next/server';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CNAE {
  code: string;
  description: string;
}

export interface LegalNature {
  code: string;
  description: string;
}

export interface SearchResult {
  id: string;
  name: string;
  fantasyName?: string;
  category: string;
  status: string;
  phone: string;
  email?: string;
  website?: string;
  location: string;
  address: Address;
  openDate: string;
  cnae: CNAE;
  legalNature: LegalNature;
}

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
    },
    cnae: {
      code: data.cnae_fiscal_descricao,
      description: data.cnae_fiscal_descricao
    },
    legalNature: {
      code: data.situacao_cadastral,
      description: data.situacao_cadastral
    }
  };
}

// Dados mockados para teste
const mockData: SearchResult[] = [
  {
    id: '1',
    name: 'Empresa ABC Ltda',
    category: 'Comércio',
    status: 'Ativa',
    phone: '(11) 1234-5678',
    location: 'São Paulo - SP',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    openDate: '2020-01-01',
    cnae: {
      code: '4751-2/01',
      description: 'Comércio varejista especializado de equipamentos e suprimentos de informática'
    },
    legalNature: {
      code: '206-2',
      description: 'Sociedade Empresária Limitada'
    }
  }
];

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParam = searchParams.get('query');
  const locationParam = searchParams.get('location');
  
  const query = queryParam?.toString() || '';
  const location = locationParam?.toString() || '';

  if (!query && !location) {
    return new Response(JSON.stringify({ error: 'Informe pelo menos um parâmetro de busca' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const results = mockData.filter((item) => {
    const matchesQuery = !query || item.name.toLowerCase().includes(query.toLowerCase());
    const matchesLocation = !location || item.location.toLowerCase().includes(location.toLowerCase());
    return matchesQuery && matchesLocation;
  });

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
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
      openDate: item.open_date || '',
      cnae: {
        code: item.cnae_fiscal_descricao || '0000-0/00',
        description: item.cnae_fiscal_descricao || 'CNAE não informado'
      },
      legalNature: {
        code: item.situacao_cadastral || '000-0',
        description: item.situacao_cadastral || 'Natureza jurídica não informada'
      }
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