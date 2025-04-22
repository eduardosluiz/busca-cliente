import { Contact } from '@/types/contacts'

export async function getContacts(): Promise<Contact[]> {
  // TODO: Implementar integração com backend
  return []
}

export async function updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar contato')
  }

  return response.json()
} 