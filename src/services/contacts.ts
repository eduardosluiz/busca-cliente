import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Contact, ContactFilters, PaginationParams, ContactsResponse } from '@/types/contacts'

const supabase = createClientComponentClient()

export async function getContacts(
  { page = 1, pageSize = 10 }: Partial<PaginationParams> = {},
  filters?: ContactFilters
): Promise<ContactsResponse> {
  try {
    // Iniciar a query base
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
    
    // Aplicar filtros se existirem
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.search) {
      query = query.or(`company_name.ilike.%${filters.search}%,fantasy_name.ilike.%${filters.search}%`)
    }
    
    // Aplicar ordenação e paginação
    const { data: contacts, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) {
      console.error('Erro ao buscar contatos:', error)
      throw error
    }

    const totalPages = Math.ceil((count || 0) / pageSize)

    return {
      data: contacts as Contact[],
      count: count || 0,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    throw error
  }
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar contato:', error)
    throw error
  }
}

export async function updateContact(id: string, contact: Partial<Contact>): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .update(contact)
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar contato:', error)
    throw error
  }
}

export async function getContactById(id: string): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar contato:', error)
    throw error
  }

  return data as Contact
} 