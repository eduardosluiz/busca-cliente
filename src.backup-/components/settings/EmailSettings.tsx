import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/types/database.types'
import { toast } from 'react-hot-toast'

type EmailSettings = Database['public']['Tables']['email_settings']['Row']

export default function EmailSettings() {
  const supabase = useSupabaseClient<Database>()
  const [settings, setSettings] = useState<Partial<EmailSettings>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('email_settings')
        .select('*')
        .single()

      if (error) throw error
      if (settings) setSettings(settings)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações de email')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('email_settings')
        .upsert({
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      toast.success('Configurações salvas com sucesso')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Configurações de Email</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700">
              Servidor SMTP
            </label>
            <input
              type="text"
              id="smtp_host"
              name="smtp_host"
              value={settings.smtp_host || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700">
              Porta SMTP
            </label>
            <input
              type="number"
              id="smtp_port"
              name="smtp_port"
              value={settings.smtp_port || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="smtp_user" className="block text-sm font-medium text-gray-700">
              Usuário SMTP
            </label>
            <input
              type="text"
              id="smtp_user"
              name="smtp_user"
              value={settings.smtp_user || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="smtp_password" className="block text-sm font-medium text-gray-700">
              Senha SMTP
            </label>
            <input
              type="password"
              id="smtp_password"
              name="smtp_password"
              value={settings.smtp_password || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="from_email" className="block text-sm font-medium text-gray-700">
              Email de Envio
            </label>
            <input
              type="email"
              id="from_email"
              name="from_email"
              value={settings.from_email || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="from_name" className="block text-sm font-medium text-gray-700">
              Nome de Exibição
            </label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              value={settings.from_name || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  )
} 