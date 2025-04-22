import useSWR from 'swr'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Contact as ContactType } from '@/types/contacts'

export type Contact = ContactType

export function useContacts() {
  const supabase = createClientComponentClient()

  const { data, error, mutate } = useSWR('contacts', async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Contact[]
  })

  return {
    contacts: data,
    isLoading: !error && !data,
    error,
    mutate
  }
} 