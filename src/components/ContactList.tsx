import { Contact } from '@/lib/supabase'

interface ContactListProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
}

export default function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {contacts.map((contact) => (
          <li key={contact.id}>
            <div className="flex items-center px-4 py-4 sm:px-6">
              <div className="flex min-w-0 flex-1 items-center">
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="truncate text-sm font-medium text-indigo-600">{contact.name}</p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="truncate">{contact.email}</span>
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div>
                      <p className="text-sm text-gray-900">
                        {contact.phone}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500">
                        <span>{contact.city}, {contact.state}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => onEdit(contact)}
                  className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(contact.id)}
                  className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  Excluir
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 