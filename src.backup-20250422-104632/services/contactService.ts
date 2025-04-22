import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SearchResult } from './searchService'
import { Database } from '@/types/supabase'

export type Contact = Database['public']['Tables']['contacts']['Row']

export async function saveContacts(contacts: SearchResult[]) {
  try {
    console.log('Iniciando salvamento de contatos:', contacts)
    
    const supabase = createClientComponentClient<Database>()
    
    // Verificar sessão atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError)
      throw new Error('Erro ao verificar autenticação')
    }

    if (!session) {
      console.error('Sessão não encontrada')
      throw new Error('Usuário não autenticado. Por favor, faça login novamente.')
    }

    const user = session.user
    if (!user) {
      console.error('Usuário não encontrado na sessão')
      throw new Error('Usuário não autenticado. Por favor, faça login novamente.')
    }

    // Mapear os dados para o formato esperado pela tabela
    const contactsToInsert = contacts.map(contact => {
      // Garantir que temos todos os campos obrigatórios do endereço
      const address = {
        street: contact.address?.street || '',
        number: contact.address?.number || '',
        complement: contact.address?.complement || '',
        neighborhood: contact.address?.neighborhood || '',
        city: contact.address?.city || '',
        state: contact.address?.state || '',
        zipCode: contact.address?.zipCode || ''
      }

      return {
        user_id: user.id,
        company_name: contact.name,
        fantasy_name: contact.fantasyName || null,
        category: contact.category,
        address,
        phone: contact.phone || null,
        email: contact.email || null,
        website: contact.website || null,
        status: 'novo'
      }
    })

    console.log('Dados preparados para inserção:', contactsToInsert)

    // Primeiro, verificar se a tabela existe
    const { error: tableCheckError } = await supabase
      .from('contacts')
      .select('id')
      .limit(1)

    if (tableCheckError) {
      console.error('Erro ao verificar tabela:', tableCheckError)
      throw new Error('A tabela de contatos não está configurada. Por favor, acesse a página de configurações para criar a tabela.')
    }

    const { data, error: insertError } = await supabase
      .from('contacts')
      .insert(contactsToInsert)
      .select()

    if (insertError) {
      console.error('Erro do Supabase ao salvar contatos:', insertError)
      throw new Error(`Erro ao salvar contatos: ${insertError.message}`)
    }

    if (!data) {
      throw new Error('Nenhum dado retornado após salvar os contatos')
    }

    console.log('Contatos salvos com sucesso:', data)
    return data
  } catch (error: any) {
    console.error('Erro durante o salvamento de contatos:', error)
    throw new Error(error.message || 'Erro ao salvar contatos')
  }
} 