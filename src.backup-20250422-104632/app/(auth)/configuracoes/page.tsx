"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Palette, MessageCircle, Mail, Bot, Webhook } from "lucide-react"
import Link from "next/link"
import { EmailSettingsModal } from "@/components/ui/EmailSettingsModal"
import { getUserProfile } from "@/services/user"
import { toast, Toaster } from "react-hot-toast"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    mobile: false,
  })

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    company: '',
    email_notifications: true,
    system_notifications: true
  })

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNotificationChange = (type: 'email' | 'push', checked: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: checked }))
    toast.success(
      `Notificações por ${type === 'email' ? 'email' : 'sistema'} ${checked ? 'ativadas' : 'desativadas'}`,
      {
        duration: 4000,
        position: 'top-right',
        icon: checked ? '🔔' : '🔕',
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
        }
      }
    )
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        const profile = await getUserProfile()
        if (profile) {
          setUserData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            cpf: profile.cpf || '',
            company: profile.company || '',
            email_notifications: profile.email_notifications,
            system_notifications: profile.system_notifications
          })
          
          setNotifications({
            email: profile.email_notifications,
            push: profile.system_notifications,
            mobile: false
          })
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        toast.error('Erro ao carregar dados do usuário')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true)
      const supabase = createClientComponentClient()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        toast.error('Usuário não encontrado', {
          style: {
            background: '#EF4444',
            color: 'white',
            padding: '16px',
          },
        })
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          phone: userData.phone,
          email_notifications: notifications.email,
          system_notifications: notifications.push
        }
      })
      if (updateError) {
        toast.error('Erro ao atualizar dados do usuário', {
          style: {
            background: '#EF4444',
            color: 'white',
            padding: '16px',
          },
        })
        return
      }

      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            cpf: userData.cpf,
            company: userData.company,
            email_notifications: notifications.email,
            system_notifications: notifications.push,
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.warn('Aviso: Erro ao sincronizar perfil completo, mas dados principais foram salvos:', profileError)
        }
      } catch (profileError) {
        console.warn('Aviso: Erro ao sincronizar perfil completo, mas dados principais foram salvos:', profileError)
      }

      setUserData(prev => ({
        ...prev,
        name: userData.name,
        phone: userData.phone,
        email_notifications: notifications.email,
        system_notifications: notifications.push
      }))

      toast.success('Perfil atualizado com sucesso!', {
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          fontWeight: '500',
        },
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Ocorreu um erro, mas algumas alterações podem ter sido salvas. Por favor, recarregue a página.', {
        style: {
          background: '#EF4444',
          color: 'white',
          padding: '16px',
        },
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full settings-content overflow-y-auto px-4 py-3">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#10B981',
              color: 'white',
              padding: '16px',
            },
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          <Card className="p-6 shadow-sm border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-800">Perfil</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Nome</Label>
                <Input 
                  id="name" 
                  placeholder="Seu nome" 
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  placeholder="Seu email" 
                  type="email"
                  value={userData.email}
                  className="w-full p-2.5 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                  disabled={true}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-gray-700">CPF *</Label>
                <Input 
                  id="cpf" 
                  placeholder="Seu CPF" 
                  value={userData.cpf}
                  onChange={(e) => setUserData(prev => ({ ...prev, cpf: e.target.value }))}
                  className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700">Empresa</Label>
                <Input 
                  id="company" 
                  placeholder="Nome da sua empresa (opcional)" 
                  value={userData.company}
                  onChange={(e) => setUserData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                <Input 
                  id="phone" 
                  placeholder="Seu telefone" 
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <Button 
                className="w-full bg-gradient text-white hover:opacity-90"
                onClick={handleUpdateProfile}
                disabled={isLoading}
              >
                {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-800">Preferências</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-gray-700 font-medium">Email</Label>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Receba notificações por email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-gray-700 font-medium">Sistema</Label>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Receba notificações do sistema
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-gray-700 font-medium">Modo Escuro</Label>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Ative o tema escuro para melhor visualização noturna
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={false}
                    onCheckedChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-800">Segurança</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-700">Senha Atual</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-700">Nova Senha</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">Confirmar Nova Senha</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button className="w-full bg-gradient text-white hover:opacity-90">
                Atualizar Senha
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-800">Integrações</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-gray-700 font-medium">WhatsApp Business</Label>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Configure sua integração com WhatsApp Business API
                    </p>
                  </div>
                  <Button asChild variant="outline" className="bg-gradient text-white hover:opacity-90">
                    <Link href="/configuracoes/whatsapp" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Configurar
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-gray-700 font-medium">Email Marketing</Label>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Configure suas credenciais SMTP para envio de emails
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="bg-gradient text-white hover:opacity-90"
                    onClick={() => setIsEmailModalOpen(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Configurar
                    </div>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-gray-700 font-medium">OpenAI</Label>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Configure sua chave de API para recursos de IA
                    </p>
                  </div>
                  <Button asChild variant="outline" className="bg-gradient text-white hover:opacity-90">
                    <Link href="/configuracoes/openai" className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Configurar
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-gray-700 font-medium">CRM Webhook</Label>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Integre com seu CRM através de webhooks personalizados
                    </p>
                  </div>
                  <Button asChild variant="outline" className="bg-gradient text-white hover:opacity-90">
                    <Link href="/configuracoes/webhook" className="flex items-center gap-2">
                      <Webhook className="h-4 w-4" />
                      Configurar
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <EmailSettingsModal 
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
      </div>
    </div>
  )
} 