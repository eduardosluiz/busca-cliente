'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { getChatSettings, updateChatSettings, connectWhatsApp, disconnectWhatsApp, getWhatsAppStatus } from '@/services/chat'
import { ChatSettings, WhatsAppConnectionStatus } from '@/types/chat'
import { Badge } from '@/components/ui/badge'
import { Loader2, Power, PowerOff, QrCode } from 'lucide-react'

export default function WhatsAppSettings() {
  const [settings, setSettings] = useState<Partial<ChatSettings>>({
    whatsapp_token: '',
    whatsapp_number: '',
    auto_reply_enabled: false,
    auto_reply_message: ''
  })
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>({
    status: 'disconnected'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    loadSettings()
    loadConnectionStatus()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getChatSettings()
      if (data) {
        setSettings(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações do WhatsApp')
      setLoading(false)
    }
  }

  const loadConnectionStatus = async () => {
    try {
      const status = await getWhatsAppStatus()
      setConnectionStatus(status)
    } catch (error) {
      console.error('Erro ao carregar status da conexão:', error)
      setConnectionStatus({ status: 'error', error: 'Falha ao carregar status' })
    }
  }

  const handleConnect = async () => {
    if (!settings.whatsapp_token || !settings.whatsapp_number) {
      toast.error('Preencha o token e o número do WhatsApp')
      return
    }

    setConnecting(true)
    try {
      await connectWhatsApp(settings.whatsapp_token, settings.whatsapp_number)
      await loadConnectionStatus()
      toast.success('WhatsApp conectado com sucesso!')
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error)
      toast.error('Falha ao conectar com o WhatsApp')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setConnecting(true)
    try {
      await disconnectWhatsApp()
      await loadConnectionStatus()
      toast.success('WhatsApp desconectado com sucesso!')
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error)
      toast.error('Falha ao desconectar do WhatsApp')
    } finally {
      setConnecting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateChatSettings(settings)
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Configurações do WhatsApp</h1>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Status da Conexão
              <Badge
                variant={
                  connectionStatus.status === 'connected' ? 'success' :
                  connectionStatus.status === 'connecting' ? 'warning' :
                  connectionStatus.status === 'error' ? 'destructive' :
                  'secondary'
                }
                className="ml-2"
              >
                {connectionStatus.status === 'connected' && 'Conectado'}
                {connectionStatus.status === 'connecting' && 'Conectando...'}
                {connectionStatus.status === 'disconnected' && 'Desconectado'}
                {connectionStatus.status === 'error' && 'Erro'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Gerencie a conexão com o WhatsApp Business API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectionStatus.status === 'connected' && (
              <div className="text-sm text-gray-500">
                Última conexão: {connectionStatus.lastConnection ? new Date(connectionStatus.lastConnection).toLocaleString('pt-BR') : 'N/A'}
              </div>
            )}

            {connectionStatus.error && (
              <div className="text-sm text-red-500">
                Erro: {connectionStatus.error}
              </div>
            )}

            {connectionStatus.qrCode && (
              <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
                <QrCode className="w-8 h-8 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Escaneie o QR Code no seu WhatsApp
                </p>
                <img
                  src={connectionStatus.qrCode}
                  alt="QR Code do WhatsApp"
                  className="w-48 h-48"
                />
              </div>
            )}

            <div className="flex justify-end">
              {connectionStatus.status === 'connected' ? (
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={connecting}
                >
                  {connecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PowerOff className="w-4 h-4 mr-2" />
                  )}
                  Desconectar
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleConnect}
                  disabled={connecting || !settings.whatsapp_token || !settings.whatsapp_number}
                >
                  {connecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Power className="w-4 h-4 mr-2" />
                  )}
                  Conectar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Configurações da API</CardTitle>
              <CardDescription>
                Configure suas credenciais do WhatsApp Business API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_token">Token de Acesso</Label>
                <Input
                  id="whatsapp_token"
                  type="password"
                  value={settings.whatsapp_token}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, whatsapp_token: e.target.value }))}
                  placeholder="Insira seu token de acesso"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">Número do WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="Ex: 5511999999999"
                />
                <p className="text-sm text-gray-500">
                  Insira o número no formato internacional, sem espaços ou caracteres especiais
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Respostas Automáticas</CardTitle>
              <CardDescription>
                Configure mensagens automáticas para seus contatos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ativar respostas automáticas</Label>
                  <p className="text-sm text-gray-500">
                    Envie uma mensagem automática quando receber uma nova mensagem
                  </p>
                </div>
                <Switch
                  checked={settings.auto_reply_enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, auto_reply_enabled: checked }))
                  }
                />
              </div>

              {settings.auto_reply_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="auto_reply_message">Mensagem automática</Label>
                  <Textarea
                    id="auto_reply_message"
                    value={settings.auto_reply_message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setSettings(prev => ({ ...prev, auto_reply_message: e.target.value }))
                    }
                    placeholder="Digite a mensagem que será enviada automaticamente"
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button type="submit" variant="default" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 