import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface EmailSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailSettingsModal({ isOpen, onClose }: EmailSettingsModalProps) {
  const [formData, setFormData] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    fromEmail: '',
    fromName: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar a lógica de salvar as configurações
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Configurações de Email
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="host" className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">
              Servidor SMTP
            </Label>
            <Input
              id="host"
              placeholder="Ex: smtp.gmail.com"
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port" className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">
              Porta
            </Label>
            <Input
              id="port"
              placeholder="Ex: 587"
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">
              Usuário
            </Label>
            <Input
              id="username"
              placeholder="Seu usuário SMTP"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha SMTP"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromEmail" className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">
              Email de Envio
            </Label>
            <Input
              id="fromEmail"
              type="email"
              placeholder="Ex: contato@suaempresa.com"
              value={formData.fromEmail}
              onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
              className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromName" className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">
              Nome de Exibição
            </Label>
            <Input
              id="fromName"
              placeholder="Ex: Sua Empresa"
              value={formData.fromName}
              onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
              className="w-full p-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient text-white hover:opacity-90"
            >
              Salvar Configurações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 