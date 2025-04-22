'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'react-hot-toast'

interface NewContactModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewContactModal({ open, onClose, onSuccess }: NewContactModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const contact = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      category: formData.get('category') as string,
      location: formData.get('location') as string,
      website: formData.get('website') as string,
    }

    try {
      const { error } = await supabase.from('contacts').insert([contact])
      if (error) throw error

      toast.success('Contato adicionado com sucesso!')
      onSuccess()
    } catch (error) {
      console.error('Erro ao adicionar contato:', error)
      toast.error('Erro ao adicionar contato')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Contato</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" name="phone" />
          </div>

          <div>
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" name="company" />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input id="category" name="category" />
          </div>

          <div>
            <Label htmlFor="location">Localização</Label>
            <Input id="location" name="location" />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 