import { createClient } from '@supabase/supabase-js'
import { Contact } from '@/types/contacts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Contact[]
}

export async function createContact(contact: Omit<Contact, 'id'>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single()

  if (error) throw error
  return data as Contact
}

export async function updateContact(id: string, contact: Partial<Contact>) {
  const { data, error } = await supabase
    .from('contacts')
    .update(contact)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Contact
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function deleteContacts(ids: string[]) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .in('id', ids)

  if (error) throw error
} 