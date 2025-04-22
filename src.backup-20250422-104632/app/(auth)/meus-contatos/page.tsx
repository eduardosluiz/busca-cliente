'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useContacts } from '@/hooks/useContacts'
import { NewContactModal } from '@/components/NewContactModal'
import { DataTable } from '@/components/ui/data-table'
import { Contact } from '@/types/contacts'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Phone, Mail, Globe, MessageSquare, Pencil, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { deleteContact } from '@/lib/contacts'
import { EditContactModal } from '@/components/EditContactModal'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MeusContatos() {
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false)
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { contacts, isLoading, error, mutate } = useContacts()

  const paginatedData = contacts ? contacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : []

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(contact => 
    selectedContacts.includes(contact.id)
  )

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedContacts(prev => 
        prev.filter(id => !paginatedData.find(contact => contact.id === id))
      )
    } else {
      setSelectedContacts(prev => [
        ...prev,
        ...paginatedData.map(contact => contact.id).filter(id => !prev.includes(id))
      ])
    }
  }

  const columns = [
    {
      header: () => (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={toggleSelectAll}
          aria-label="Selecionar todos"
        />
      ),
      cell: (row: Contact) => (
        <Checkbox
          checked={selectedContacts.includes(row.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedContacts(prev => [...prev, row.id])
            } else {
              setSelectedContacts(prev => prev.filter(id => id !== row.id))
            }
          }}
          aria-label="Selecionar linha"
        />
      ),
    },
    {
      header: "Empresa",
      accessorKey: "company_name",
      cell: (row: Contact) => (
        <div className="flex flex-col min-w-[200px]">
          <span className="font-medium text-gray-900">{row.company_name || 'Sem nome'}</span>
          {row.fantasy_name && (
            <span className="text-sm text-gray-600">{row.fantasy_name}</span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: Contact) => (
        <div className="min-w-[100px]">
          <Badge 
            variant={row.status === "Ativo" ? "success" : "secondary"}
            className="capitalize text-xs font-medium"
          >
            {row.status}
          </Badge>
        </div>
      ),
    },
    {
      header: "Categoria",
      accessorKey: "category",
      cell: (row: Contact) => (
        <div className="min-w-[120px]">
          <span className="capitalize text-gray-700">{row.category}</span>
        </div>
      ),
    },
    {
      header: "Telefone",
      accessorKey: "phone",
      cell: (row: Contact) => (
        <div className="min-w-[150px]">
          {row.phone ? (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <a href={`tel:${row.phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                {row.phone}
              </a>
            </div>
          ) : (
            <span className="text-gray-500 italic">Não informado</span>
          )}
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (row: Contact) => (
        <div className="min-w-[200px]">
          {row.email ? (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <a href={`mailto:${row.email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                {row.email}
              </a>
            </div>
          ) : (
            <span className="text-gray-500 italic">Não informado</span>
          )}
        </div>
      ),
    },
    {
      header: "Ações",
      accessorKey: "actions",
      cell: (row: Contact) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleEdit(row)} className="text-gray-700">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setIsEditContactModalOpen(true)
  }

  const handleDelete = async (contactId: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) {
      return
    }

    try {
      await deleteContact(contactId)
      await mutate()
      toast.success('Contato excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir contato:', error)
      toast.error('Erro ao excluir contato')
    }
  }

  const handleDeleteSelected = async () => {
    if (!selectedContacts.length) return
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedContacts.length} contato(s)?`)) {
      return
    }

    try {
      await Promise.all(selectedContacts.map(id => deleteContact(id)))
      await mutate()
      setSelectedContacts([])
      toast.success('Contatos excluídos com sucesso')
    } catch (error) {
      console.error('Erro ao excluir contatos:', error)
      toast.error('Erro ao excluir contatos')
    }
  }

  const totalPages = contacts ? Math.ceil(contacts.length / itemsPerPage) : 0

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 mb-4">Erro ao carregar contatos</p>
        <Button onClick={() => mutate()}>Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Meus Contatos</h1>
          {selectedContacts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              className="ml-4 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Selecionados ({selectedContacts.length})
            </Button>
          )}
        </div>
        <Button onClick={() => setIsNewContactModalOpen(true)}>
          Novo Contato
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <DataTable 
          data={paginatedData}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Nenhum contato encontrado"
        />
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, contacts?.length || 0)} de {contacts?.length || 0} resultados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      <NewContactModal
        open={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        onSuccess={() => {
          setIsNewContactModalOpen(false)
          mutate()
        }}
      />

      {selectedContact && (
        <EditContactModal
          isOpen={isEditContactModalOpen}
          onClose={() => {
            setIsEditContactModalOpen(false)
            setSelectedContact(null)
          }}
          onSuccess={() => {
            setIsEditContactModalOpen(false)
            setSelectedContact(null)
            mutate()
          }}
          contact={selectedContact}
        />
      )}
    </div>
  )
} 