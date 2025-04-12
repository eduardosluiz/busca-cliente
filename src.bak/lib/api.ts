export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
}

export async function getContacts(params: any): Promise<Contact[]> {
  // TODO: Implementar integração com backend
  return []
} 