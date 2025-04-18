'use client'

import { useState } from 'react'
import { SearchResult } from '@/services/searchService'
import { saveContacts } from '@/services/contactService'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { PageTitle } from '@/components/ui/page-title'
import { Pagination } from '@/components/ui/pagination'
import Image from 'next/image'

export default function BuscarClientes() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [error, setError] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const setupDatabase = async () => {
    setIsConfiguring(true)
    const toastId = toast.loading('Configurando banco de dados...')

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao configurar banco de dados')
      }

      toast.success('Banco de dados configurado com sucesso!', { id: toastId })
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao configurar banco de dados:', error)
      toast.error(error.message || 'Erro ao configurar banco de dados', { id: toastId })
    } finally {
      setIsConfiguring(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      params.append('query', query)
      if (location) params.append('location', location)

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar a busca')
      }

      if (data.message) {
        setError(data.message)
      }

      setResults(data.results || [])
      setTotalResults(data.total || 0)
      setCurrentPage(1) // Reset para primeira página ao fazer nova busca
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar a busca')
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(results.map(result => result.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSaveSelectedContacts = async () => {
    if (selectedItems.length === 0) {
      toast.error('Selecione pelo menos um contato para salvar')
      return
    }

    setIsSaving(true)
    const toastId = toast.loading('Salvando contatos...')

    try {
      const selectedContacts = results.filter(result => selectedItems.includes(result.id))
      await saveContacts(selectedContacts)
      
      toast.success(`${selectedItems.length} contato${selectedItems.length !== 1 ? 's' : ''} salvo${selectedItems.length !== 1 ? 's' : ''} com sucesso!`, {
        id: toastId
      })
      setSelectedItems([]) // Limpa a seleção após salvar
      
      // Redireciona para a página de contatos após salvar
      router.push('/meus-contatos')
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao salvar contatos:', error)
      toast.error(error.message || 'Erro ao salvar contatos. Por favor, tente novamente.', {
        id: toastId
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveContact = async (contact: SearchResult) => {
    setIsSaving(true)
    const toastId = toast.loading('Salvando contato...')

    try {
      await saveContacts([contact])
      
      toast.success('Contato salvo com sucesso!', {
        id: toastId
      })
      
      // Redireciona para a página de contatos após salvar
      router.push('/meus-contatos')
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao salvar contato:', error)
      toast.error(error.message || 'Erro ao salvar contato. Por favor, tente novamente.', {
        id: toastId
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calcular índices para paginação
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(results.length / itemsPerPage)

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
              <a href="/buscar-clientes" className="flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Buscar Clientes</span>
              </a>
            </li>
            <li>
              <a href="/meus-contatos" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50">
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
          <PageTitle>Buscar Clientes</PageTitle>
          <p className="text-sm text-gray-600">
            Encontre e salve novos contatos para sua lista
          </p>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Barra de Pesquisa */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Campo de Pesquisa */}
                <div className="md:col-span-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por tipo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ex: Pizzaria, Restaurante, Mercado..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Campo de Cidade */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Porto Alegre"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Botão de Busca */}
                <div className="md:col-span-12 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading || !query}
                    className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 ${
                      (isLoading || !query) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Buscando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Buscar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de Resultados */}
            {results.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                  </h2>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={handleSaveSelectedContacts}
                      disabled={isSaving}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSaving ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Salvar {selectedItems.length} Contato{selectedItems.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                              checked={selectedItems.length === results.length && results.length > 0}
                              onChange={handleSelectAll}
                            />
                            <span className="ml-3">Empresa</span>
                          </div>
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                checked={selectedItems.includes(result.id)}
                                onChange={() => handleSelectItem(result.id)}
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {result.name}
                                </div>
                                {result.fantasyName && (
                                  <div className="text-sm text-gray-500">
                                    {result.fantasyName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{result.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{result.location}</div>
                            <div className="text-sm text-gray-500">
                              {result.address.street}, {result.address.number}
                              {result.address.complement && ` - ${result.address.complement}`}
                              <br />
                              {result.address.neighborhood} - {result.address.city}/{result.address.state}
                              <br />
                              CEP: {result.address.zipCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.phone && (
                              <div className="text-sm text-gray-900">
                                {result.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.email && (
                              <div className="text-sm text-gray-500">
                                <a href={`mailto:${result.email}`} className="text-blue-600 hover:text-blue-800">
                                  {result.email}
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.website && (
                              <div className="text-sm text-blue-600 hover:text-blue-800">
                                <a href={result.website} target="_blank" rel="noopener noreferrer">
                                  Website
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              result.status.toLowerCase() === 'ativa'
                                ? 'bg-green-100 text-green-800'
                                : result.status.toLowerCase() === 'inativa'
                                ? 'bg-red-100 text-red-800'
                                : result.status.toLowerCase() === 'pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleSaveContact(result)}
                              disabled={isSaving}
                              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isSaving ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                              title="Adicionar aos meus contatos"
                            >
                              {isSaving ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Salvando...
                                </>
                              ) : (
                                <>
                                  <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Salvar Contato
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 