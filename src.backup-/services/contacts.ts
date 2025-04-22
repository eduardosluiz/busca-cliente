import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Contact, ContactFilters, PaginationParams, ContactsResponse } from '@/types/contacts'

// Criar uma única instância do cliente Supabase
const supabase = createClientComponentClient()

// Cache para armazenar resultados recentes
const cache = new Map<string, { data: ContactsResponse; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 segundos

export async function getContacts(
  { page = 1, pageSize = 10 }: Partial<PaginationParams> = {},
  filters?: ContactFilters
): Promise<ContactsResponse> {
  try {
    // Verificar se o cliente está autenticado
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      throw new Error('Usuário não autenticado')
    }

    // Criar uma chave única para o cache baseada nos parâmetros
    const cacheKey = JSON.stringify({ page, pageSize, filters })
    const now = Date.now()
    
    // Verificar cache apenas se não houver filtros de busca
    if (!filters?.search) {
      const cachedResult = cache.get(cacheKey)
      if (cachedResult && (now - cachedResult.timestamp) < CACHE_DURATION) {
        return cachedResult.data
      }
    }

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
      const searchTerm = `%${filters.search}%`
      query = query.or(
        `company_name.ilike.${searchTerm},` +
        `fantasy_name.ilike.${searchTerm},` +
        `email.ilike.${searchTerm},` +
        `phone.ilike.${searchTerm},` +
        `category.ilike.${searchTerm}`
      )
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
    const result = {
      data: contacts as Contact[],
      count: count || 0,
      totalPages,
      currentPage: page
    }

    // Armazenar no cache apenas se não houver busca
    if (!filters?.search) {
      cache.set(cacheKey, { data: result, timestamp: now })
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    throw error
  }
}

// Função para limpar o cache
export function clearContactsCache() {
  cache.clear()
}

export async function deleteContact(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar contato:', error)
      throw error
    }

    // Limpar cache após deletar
    clearContactsCache()
  } catch (error) {
    console.error('Erro ao deletar contato:', error)
    throw error
  }
}

export async function updateContact(id: string, contact: Partial<Contact>): Promise<void> {
  try {
    const { error } = await supabase
      .from('contacts')
      .update(contact)
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar contato:', error)
      throw error
    }

    // Limpar cache após atualizar
    clearContactsCache()
  } catch (error) {
    console.error('Erro ao atualizar contato:', error)
    throw error
  }
}

export async function getContactById(id: string): Promise<Contact> {
  try {
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
  } catch (error) {
    console.error('Erro ao buscar contato:', error)
    throw error
  }
} 