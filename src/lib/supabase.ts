import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Contact, ContactFilters, validateContact, hasErrors } from '@/types/contact'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para uso em componentes
export const createBrowserClient = () => {
  return createClientComponentClient()
}

// Cliente para uso em funções de API
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export type { Contact } from '@/types/contact'

// Função para criar a tabela de contatos
export const createContactsTable = async () => {
  const { error } = await supabase.rpc('create_contacts_table')
  if (error) throw error
}

// Função para criar um novo contato com validação
export const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> => {
  // Validar dados antes de inserir
  const errors = validateContact(contact)
  if (hasErrors(errors)) {
    throw new Error('Dados inválidos: ' + Object.values(errors).join(', '))
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single()

  if (error) throw error
  return data
}

// Função para atualizar um contato com validação
export const updateContact = async (id: string, contact: Partial<Contact>): Promise<Contact> => {
  // Validar campos preenchidos
  const errors = validateContact(contact)
  if (hasErrors(errors)) {
    throw new Error('Dados inválidos: ' + Object.values(errors).join(', '))
  }

  const { data, error } = await supabase
    .from('contacts')
    .update(contact)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Função para excluir um contato
export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Função para buscar contatos com filtros e ordenação
export const getContacts = async (filters: ContactFilters): Promise<Contact[]> => {
  let query = supabase
    .from('contacts')
    .select('*')

  // Aplicar filtros de busca
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.city) {
    query = query.eq('city', filters.city)
  }

  if (filters.state) {
    query = query.eq('state', filters.state)
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags)
  }

  // Aplicar ordenação
  if (filters.sortBy) {
    const order = filters.sortOrder || 'asc'
    query = query.order(filters.sortBy, { ascending: order === 'asc' })
  } else {
    // Ordenação padrão por nome
    query = query.order('name', { ascending: true })
  }

  // Aplicar paginação
  if (filters.page !== undefined && filters.limit !== undefined) {
    const start = filters.page * filters.limit
    query = query.range(start, start + filters.limit - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

// Função para configurar o banco de dados
export const setupDatabase = async () => {
  // Criar a tabela de contatos se não existir
  const { error: tableError } = await supabase.from('contacts').select('*').limit(1)
  
  if (tableError?.code === '42P01') { // Código de erro para tabela não existente
    const { error: createError } = await supabase
      .rpc('exec_sql', {
        sql: `
          -- Criar a tabela de contatos
          create table if not exists contacts (
            id uuid default uuid_generate_v4() primary key,
            name text not null,
            email text not null,
            phone text not null,
            address text,
            city text,
            state text,
            notes text,
            status text default 'active',
            tags text[],
            user_id text not null,
            created_at timestamp with time zone default timezone('utc'::text, now()) not null,
            updated_at timestamp with time zone default timezone('utc'::text, now()) not null
          );

          -- Habilitar RLS
          alter table contacts enable row level security;

          -- Criar política para permitir acesso apenas aos contatos do usuário autenticado
          create policy "Users can only access their own contacts"
            on contacts for all
            using (auth.uid()::text = user_id);

          -- Criar índices para melhorar performance
          create index if not exists contacts_user_id_idx on contacts(user_id);
          create index if not exists contacts_name_idx on contacts(name);
          create index if not exists contacts_email_idx on contacts(email);
          create index if not exists contacts_status_idx on contacts(status);
          create index if not exists contacts_city_idx on contacts(city);
          create index if not exists contacts_state_idx on contacts(state);
        `
      })

    if (createError) {
      console.error('Erro ao criar tabela:', createError)
      throw createError
    }

    console.log('Banco de dados configurado com sucesso!')
  }
} 