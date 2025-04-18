'use client'

import { useEffect, useState } from 'react'
import { getContacts, deleteContact, updateContact } from '@/services/contacts'
import { useRouter } from 'next/navigation'
import { Contact, ContactFilters, PaginationParams } from '@/types/contacts'
import { convertToCSV, downloadCSV } from '@/utils/exportUtils'
import { Spinner } from '@/components/ui/spinner'
import { PageTitle } from '@/components/ui/page-title'
import Image from 'next/image'

export default function MeusContatosPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10
  })
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<ContactFilters>({
    status: '',
    category: '',
    search: ''
  })

  useEffect(() => {
    loadContacts()
  }, [pagination.page, filters, loadContacts])

  async function loadContacts() {
    try {
      const response = await getContacts(pagination, filters)
      setContacts(response.data)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await deleteContact(id)
        await loadContacts()
      } catch (error) {
        console.error('Erro ao excluir contato:', error)
        alert('Erro ao excluir contato. Tente novamente.')
      }
    }
  }

  function handleEdit(contact: Contact) {
    console.log('Editando contato:', contact)
    setEditingContact({ ...contact })
    setIsModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingContact) return

    try {
      await updateContact(editingContact.id, editingContact)
      await loadContacts()
      setIsModalOpen(false)
      setEditingContact(null)
      alert('Contato atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      alert('Erro ao atualizar contato')
    }
  }

  function handleSearch(value: string) {
    setSearchTerm(value)
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, page: 1 })) // Volta para a primeira página ao pesquisar
  }

  function handleFilterByStatus(status: string) {
    setFilters(prev => ({ ...prev, status }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  function handleFilterByCategory(category: string) {
    setFilters(prev => ({ ...prev, category }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  function handlePageChange(newPage: number) {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(contacts.map(contact => contact.id))
    }
  }

  const toggleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  async function handleExport() {
    try {
      setLoading(true)
      if (selectedContacts.length === 0) {
        alert('Por favor, selecione pelo menos um contato para exportar.')
        return
      }

      const response = await getContacts({ page: 1, pageSize: 1000 }, filters)
      const selectedContactsData = response.data.filter(contact => 
        selectedContacts.includes(contact.id)
      )
      
      const csvContent = convertToCSV(selectedContactsData)
      const date = new Date().toISOString().split('T')[0]
      downloadCSV(csvContent, `contatos_${date}.csv`)
    } catch (error) {
      console.error('Erro ao exportar contatos:', error)
      alert('Erro ao exportar contatos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Menu Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Image
            src="/images/logo.png"
            alt="Busca Cliente Logo"
            width={180}
            height={50}
            className="object-contain"
            priority
          />
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/buscar-clientes" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Buscar Clientes</span>
              </a>
            </li>
            <li>
              <a href="/meus-contatos" className="flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Meus Contatos</span>
              </a>
            </li>
            <li>
              <a href="/assinatura" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span>Assinatura</span>
              </a>
            </li>
            <li>
              <a href="/configuracoes" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex flex-col justify-center px-8">
          <PageTitle>Meus Contatos</PageTitle>
          <p className="text-sm text-gray-600">
            Gerencie sua lista de contatos salvos
          </p>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <div className="mt-4 flex gap-4">
                  <input
                    type="text"
                    placeholder="Buscar contatos..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                  />
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterByStatus(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                  >
                    <option value="">Status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="pendente">Pendente</option>
                  </select>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterByCategory(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                  >
                    <option value="">Categoria</option>
                    <option value="cliente">Cliente</option>
                    <option value="fornecedor">Fornecedor</option>
                    <option value="parceiro">Parceiro</option>
                  </select>
                  <button 
                    onClick={handleExport}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 mr-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    Exportar
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            checked={selectedContacts.length === contacts.length && contacts.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empresa
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Localização
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefone
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Website
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                            Nenhum contato encontrado
                          </td>
                        </tr>
                      ) : (
                        contacts.map((contact: Contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                checked={selectedContacts.includes(contact.id)}
                                onChange={() => toggleSelectContact(contact.id)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{contact.company_name}</div>
                                {contact.fantasy_name && (
                                  <div className="text-sm text-gray-500">{contact.fantasy_name}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{contact.category}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {contact.address.street && <div>{contact.address.street}</div>}
                                <div>{contact.address.city} - {contact.address.state}</div>
                                {contact.address.zip && <div>CEP: {contact.address.zip}</div>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center gap-2">
                                {contact.phone && (
                                  <>
                                    <span>{contact.phone}</span>
                                    <a
                                      href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-600 hover:text-green-800"
                                      title="Abrir WhatsApp"
                                    >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                      </svg>
                                    </a>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {contact.email && (
                                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                                    {contact.email}
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {contact.website && (
                                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    Website
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar contato"
                                  onClick={() => handleEdit(contact)}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  title="Excluir contato"
                                  onClick={() => handleDelete(contact.id)}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Paginação fixa na parte inferior */}
          <div className="border-t border-gray-200 bg-white py-4">
            <div className="max-w-7xl mx-auto px-4 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    pagination.page === page
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && editingContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-4 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Editar Contato</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                  <input
                    type="text"
                    defaultValue={editingContact.company_name}
                    onChange={(e) => setEditingContact({ ...editingContact, company_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                <input
                  type="text"
                    defaultValue={editingContact.fantasy_name || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, fantasy_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                />
              </div>
            </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <input
                    type="text"
                    defaultValue={editingContact.category}
                    onChange={(e) => setEditingContact({ ...editingContact, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">CEP</label>
                  <input
                    type="text"
                    defaultValue={editingContact.address.zip || ''}
                    onChange={(e) => setEditingContact({
                      ...editingContact,
                      address: { ...editingContact.address, zip: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                  />
                </div>
                  </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cidade</label>
                  <input
                    type="text"
                    defaultValue={editingContact.address.city}
                    onChange={(e) => setEditingContact({
                      ...editingContact,
                      address: { ...editingContact.address, city: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <input
                    type="text"
                    defaultValue={editingContact.address.state}
                    onChange={(e) => setEditingContact({
                      ...editingContact,
                      address: { ...editingContact.address, state: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={editingContact.phone || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                    />
                    {editingContact.phone && (
                      <a
                        href={`https://wa.me/${editingContact.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 p-2 text-green-600 hover:text-green-800"
                        title="Abrir WhatsApp"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    defaultValue={editingContact.email || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      defaultValue={editingContact.website || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, website: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                    />
                    {editingContact.website && (
                      <a
                        href={editingContact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 p-2 text-blue-600 hover:text-blue-800"
                        title="Abrir Website"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    defaultValue={editingContact.status}
                    onChange={(e) => setEditingContact({ ...editingContact, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                    required
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Salvar
                </button>
            </div>
            </form>
          </div>
      </div>
      )}
    </div>
  )
} 