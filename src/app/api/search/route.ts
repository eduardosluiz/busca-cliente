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
    }
  },
  {
    id: '2',
    name: 'Pizzaria Bella Napoli',
    category: 'Restaurante - Pizzaria',
    location: 'Porto Alegre, RS',
    phone: '(51) 98888-8888',
    email: 'contato@bellanapoli.com.br',
    website: 'www.bellanapoli.com.br',
    description: 'Pizzas artesanais no estilo napolitano',
    status: 'Ativa',
    openDate: '2019-05-15',
    address: {
      street: 'Avenida Independência',
      number: '456',
      neighborhood: 'Independência',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90035-072',
      fullAddress: 'Avenida Independência, 456, Independência, Porto Alegre - RS, 90035-072'
    }
  },
  {
    id: '3',
    name: 'Pizzaria Margherita',
    category: 'Restaurante - Pizzaria',
    location: 'Porto Alegre, RS',
    phone: '(51) 97777-7777',
    email: 'contato@margherita.com.br',
    website: 'www.margherita.com.br',
    description: 'Pizzas tradicionais italianas desde 1998',
    status: 'Ativa',
    openDate: '1998-10-20',
    address: {
      street: 'Rua Padre Chagas',
      number: '789',
      neighborhood: 'Moinhos de Vento',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90570-080',
      fullAddress: 'Rua Padre Chagas, 789, Moinhos de Vento, Porto Alegre - RS, 90570-080'
    }
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const filters = {
    query: searchParams.get('query')?.toLowerCase().trim() || '',
    location: searchParams.get('location')?.toLowerCase().trim(),
    category: searchParams.get('category')?.toLowerCase().trim(),
    status: searchParams.get('status')?.toLowerCase().trim(),
    size: searchParams.get('size')?.toLowerCase().trim(),
    state: searchParams.get('state')?.toLowerCase().trim(),
    city: searchParams.get('city')?.toLowerCase().trim()
  };

  if (!filters.query) {
    return NextResponse.json(
      { error: 'Parâmetro de busca é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const searchResponse = await searchBusinesses(filters);
    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a busca' },
      { status: 500 }
    );
  }
} 