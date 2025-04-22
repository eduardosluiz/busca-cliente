import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'

interface ChatSettings {
  id: string
  welcome_message: string
  chat_delay: number
  max_messages: number
  auto_response_template: string
  created_at?: string
  updated_at?: string
}

export default function ChatSettings() {
  const supabase = useSupabaseClient()
  const [settings, setSettings] = useState<Partial<ChatSettings>>({
    welcome_message: '',
    chat_delay: 0,
    max_messages: 50,
    auto_response_template: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_settings')
        .select('*')
        .single()

      if (error) throw error

      if (data) {
        setSettings(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações do chat')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('chat_settings')
        .upsert({
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: name === 'chat_delay' || name === 'max_messages' ? parseInt(value) : value
    }))
  }

  if (loading) {
    return <div>Carregando configurações...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Configurações do Chat</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="welcome_message" className="block text-sm font-medium mb-2">
            Mensagem de Boas-vindas
          </label>
          <textarea
            id="welcome_message"
            name="welcome_message"
            value={settings.welcome_message}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="chat_delay" className="block text-sm font-medium mb-2">
            Delay entre mensagens (segundos)
          </label>
          <input
            type="number"
            id="chat_delay"
            name="chat_delay"
            value={settings.chat_delay}
            onChange={handleChange}
            min={0}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="max_messages" className="block text-sm font-medium mb-2">
            Máximo de mensagens por conversa
          </label>
          <input
            type="number"
            id="max_messages"
            name="max_messages"
            value={settings.max_messages}
            onChange={handleChange}
            min={1}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="auto_response_template" className="block text-sm font-medium mb-2">
            Template de resposta automática
          </label>
          <textarea
            id="auto_response_template"
            name="auto_response_template"
            value={settings.auto_response_template}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
    </div>
  )
} 