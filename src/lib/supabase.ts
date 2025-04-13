import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Contact, ContactFilters, validateContact, hasErrors } from '@/types/contact'

// Verificação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase')
}

console.log('Supabase URL:', supabaseUrl)

// Cliente para uso em componentes
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltam variáveis de ambiente do Supabase')
  }

  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
}

// Função para verificar autenticação
export const checkAuth = async () => {
  try {
    const supabase = createBrowserClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { user: session?.user || null, error: null }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    return { user: null, error }
  }
}

// Função para fazer login
export const signIn = async (email: string, password: string) => {
  try {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return { data: null, error }
  }
}

// Função para fazer logout
export const signOut = async () => {
  try {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    return { error }
  }
}

export type { Contact } from '@/types/contact'

// Função para criar a tabela de contatos
export const setupContactsTable = async () => {
  const sql = `
    -- Drop existing table if it exists
    drop table if exists public.contacts;

    -- Create contacts table
    create table public.contacts (
        id uuid default gen_random_uuid() primary key,
        user_id uuid references auth.users(id) on delete cascade not null,
        company_name text not null,
        fantasy_name text,
        category text not null,
        address jsonb not null,
        phone text,
        email text,
        website text,
        status text not null,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
        unique(company_name, user_id)
    );

    -- Enable RLS
    alter table public.contacts enable row level security;

    -- Create policies
    create policy "Users can view their own contacts"
        on public.contacts for select
        using (auth.uid() = user_id);

    create policy "Users can insert their own contacts"
        on public.contacts for insert
        with check (auth.uid() = user_id);

    create policy "Users can update their own contacts"
        on public.contacts for update
        using (auth.uid() = user_id)
        with check (auth.uid() = user_id);

    create policy "Users can delete their own contacts"
        on public.contacts for delete
        using (auth.uid() = user_id);

    -- Create updated_at trigger
    create or replace function public.handle_updated_at()
    returns trigger as $$
    begin
        new.updated_at = timezone('utc'::text, now());
        return new;
    end;
    $$ language plpgsql security definer;

    -- Create trigger
    drop trigger if exists handle_contacts_updated_at on public.contacts;
    create trigger handle_contacts_updated_at
        before update on public.contacts
        for each row
        execute function public.handle_updated_at();
  `

  try {
    const { error } = await supabase.rpc('exec_sql', { sql })
    if (error) throw error
    console.log('Tabela de contatos criada com sucesso!')
    return { error: null }
  } catch (error) {
    console.error('Erro ao criar tabela de contatos:', error)
    return { error }
  }
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