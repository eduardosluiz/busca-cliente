'use client'

import { useState } from 'react'
import { Search, Phone, Mail, Globe, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'

// Lista de nichos pré-definidos
const nichosList = [
  { value: 'restaurante', label: 'Restaurantes e Bares' },
  { value: 'comercio', label: 'Comércio Varejista' },
  { value: 'servicos', label: 'Prestadores de Serviços' },
  { value: 'saude', label: 'Saúde e Bem-estar' },
  { value: 'educacao', label: 'Educação e Treinamento' },
  { value: 'tecnologia', label: 'Tecnologia e Software' },
  { value: 'construcao', label: 'Construção Civil' },
  { value: 'automotivo', label: 'Setor Automotivo' },
  { value: 'beleza', label: 'Beleza e Estética' },
  { value: 'industria', label: 'Indústria' },
]

// Tipos
type Estado = {
  value: string
  label: string
}

type Cidade = {
  value: string
  label: string
}

type CidadesPorEstado = {
  [key: string]: Cidade[]
}

// Lista de estados brasileiros
const estados: Estado[] = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

// Mapa de cidades por estado
const cidadesPorEstado: CidadesPorEstado = {
  SP: [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'campinas', label: 'Campinas' },
    { value: 'santos', label: 'Santos' },
  ],
  RJ: [
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'niteroi', label: 'Niterói' },
    { value: 'petropolis', label: 'Petrópolis' },
  ],
  MG: [
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
    { value: 'uberlandia', label: 'Uberlândia' },
    { value: 'juiz-de-fora', label: 'Juiz de Fora' },
  ],
  // Inicialize com arrays vazios para os novos estados
  AC: [], AL: [], AP: [], AM: [], BA: [], CE: [], DF: [], ES: [], GO: [],
  MA: [], MT: [], MS: [], PA: [], PB: [], PR: [], PE: [], PI: [], RN: [],
  RS: [], RO: [], RR: [], SC: [], SE: [], TO: []
}

interface SearchResult {
  id: string
  name: string
  fantasyName?: string
  category: string
  status: string
  phone?: string
  email?: string
  website?: string
  location: string
  address: {
    street: string
    number?: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

export default function BuscarClientesPage() {
  const [nicho, setNicho] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [resultados, setResultados] = useState<SearchResult[]>([])
  const [carregando, setCarregando] = useState(false)
  const [salvandoContato, setSalvandoContato] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Estados para busca rápida
  const [selectedNicho, setSelectedNicho] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('')
  const [selectedCidade, setSelectedCidade] = useState('')

  const buscarClientes = async (tipo: string) => {
    setCarregando(true)
    try {
      let queryParams = '';
      
      if (tipo === 'detalhada') {
        queryParams = `query=${nicho}&location=${localizacao}`;
      } else if (tipo === 'rapida') {
        queryParams = `query=${selectedNicho}&location=${selectedCidade}`;
      }
      
      const response = await fetch(`/api/search?${queryParams}`)
      const data = await response.json()
      setResultados(data.results || [])
      
      if (data.results?.length === 0) {
        toast.error('Nenhum resultado encontrado')
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      toast.error('Erro ao buscar clientes')
    } finally {
      setCarregando(false)
    }
  }

  const salvarContato = async (cliente: SearchResult) => {
    setSalvandoContato(cliente.id)
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) {
        throw new Error('Usuário não autenticado')
      }

      const contato = {
        user_id: session.session.user.id,
        company_name: cliente.name,
        fantasy_name: cliente.fantasyName,
        category: cliente.category,
        address: cliente.address,
        phone: cliente.phone,
        email: cliente.email,
        website: cliente.website,
        status: 'novo'
      }

      const { error } = await supabase
        .from('contacts')
        .insert([contato])

      if (error) throw error

      toast.success('Contato salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar contato:', error)
      toast.error('Erro ao salvar contato')
    } finally {
      setSalvandoContato(null)
    }
  }

  // Função para obter as cidades do estado selecionado
  const getCidadesByEstado = (estado: string) => {
    return cidadesPorEstado[estado] || []
  }

  const columns = [
    {
      header: "Empresa",
      accessorKey: "name",
      cell: (row: SearchResult) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.fantasyName && (
            <p className="text-sm text-gray-500">{row.fantasyName}</p>
          )}
        </div>
      ),
    },
    {
      header: "Categoria",
      accessorKey: "category",
    },
    {
      header: "Localização",
      accessorKey: "location",
    },
    {
      header: "Contato",
      accessorKey: "contact",
      cell: (row: SearchResult) => (
        <div className="space-y-1">
          {row.phone && (
            <p className="text-sm flex items-center gap-1">
              <Phone className="w-4 h-4 text-gray-400" />
              {row.phone}
            </p>
          )}
          {row.email && (
            <p className="text-sm flex items-center gap-1">
              <Mail className="w-4 h-4 text-gray-400" />
              {row.email}
            </p>
          )}
          {row.website && (
            <p className="text-sm flex items-center gap-1">
              <Globe className="w-4 h-4 text-gray-400" />
              {row.website}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Ações",
      accessorKey: "actions",
      cell: (row: SearchResult) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => salvarContato(row)}
          className="w-full"
          disabled={salvandoContato === row.id}
        >
          {salvandoContato === row.id ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Contato'
          )}
        </Button>
      ),
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6">
        Encontre novos contatos
      </h1>

      <Tabs defaultValue="busca-rapida" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="busca-rapida">BUSCA RÁPIDA</TabsTrigger>
          <TabsTrigger value="busca-detalhada">BUSCA DETALHADA</TabsTrigger>
        </TabsList>

        <TabsContent value="busca-rapida">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nicho ou Categoria
                </label>
                <Select
                  value={selectedNicho}
                  onValueChange={setSelectedNicho}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-300 h-10 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione um nicho ou categoria" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                    {nichosList.map((nicho) => (
                      <SelectItem 
                        key={nicho.value} 
                        value={nicho.value}
                        className="hover:bg-gray-100 cursor-pointer py-2 px-3"
                      >
                        {nicho.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select 
                  value={selectedEstado} 
                  onValueChange={(value) => {
                    setSelectedEstado(value)
                    setSelectedCidade('')
                  }}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-300 h-10 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione um estado" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md max-h-[300px] overflow-y-auto custom-scrollbar">
                    <style jsx global>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 4px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(to bottom, #3b82f6, #06b6d4);
                        border-radius: 4px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(to bottom, #2563eb, #0891b2);
                      }
                    `}</style>
                    {estados.map((estado) => (
                      <SelectItem 
                        key={estado.value} 
                        value={estado.value}
                        className="hover:bg-gray-100 cursor-pointer py-2 px-3"
                      >
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedEstado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <Select 
                  value={selectedCidade}
                  onValueChange={setSelectedCidade}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-300 h-10 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione uma cidade" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md max-h-[300px] overflow-y-auto custom-scrollbar">
                    {getCidadesByEstado(selectedEstado).map((cidade) => (
                      <SelectItem 
                        key={cidade.value} 
                        value={cidade.value}
                        className="hover:bg-gray-100 cursor-pointer py-2 px-3"
                      >
                        {cidade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              onClick={() => buscarClientes('rapida')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 h-10"
              disabled={carregando}
            >
              <Search className="w-5 h-5" />
              {carregando ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="busca-detalhada">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Digite o nicho ou ramo de atuação"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Digite a cidade ou estado"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => buscarClientes('detalhada')} disabled={carregando}>
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                'Buscar'
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <DataTable 
        data={resultados}
        columns={columns}
        isLoading={carregando}
        emptyMessage="Digite um nicho e localização para buscar contatos"
      />
    </div>
  )
} 