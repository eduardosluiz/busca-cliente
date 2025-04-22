'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { signUpWithPassword, signInWithGoogle } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { FcGoogle } from 'react-icons/fc'
import { formatPhoneNumber, formatCPF } from '@/lib/format'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true)
      const { error } = await signInWithGoogle()
      if (error) throw error
      
      toast({
        title: 'Sucesso!',
        description: 'Login com Google realizado com sucesso.',
      })
      onClose()
    } catch (error) {
      console.error('Erro no login com Google:', error)
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Ocorreu um erro ao fazer login com Google.',
      })
    } finally {
      setLoading(false)
    }
  }, [onClose, toast])

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'A senha deve ter no mínimo 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'A senha deve conter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(password)) return 'A senha deve conter pelo menos uma letra minúscula';
    if (!/[0-9]/.test(password)) return 'A senha deve conter pelo menos um número';
    if (!/[!@#$%^&*]/.test(password)) return 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)';
    return null;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar senha
      const passwordError = validatePassword(password)
      if (passwordError) {
        toast({
          variant: 'destructive',
          title: 'Erro!',
          description: passwordError
        })
        return
      }

      // Verificar se senhas coincidem
      if (password !== confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Erro!',
          description: 'As senhas não coincidem'
        })
        return
      }

      // Registrar usuário
      const { error } = await signUpWithPassword(email, password, fullName, phone)
      
      if (error) {
        if (error.message.includes('email')) {
          toast({
            variant: 'destructive',
            title: 'Erro!',
            description: 'Este email já está em uso'
          })
        } else {
          toast({
            variant: 'destructive',
            title: 'Erro!',
            description: 'Erro ao criar conta. Por favor, tente novamente.'
          })
        }
        return
      }

      toast({
        title: 'Sucesso!',
        description: 'Conta criada com sucesso!'
      })
      router.push('/dashboard')
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Erro no registro:', error)
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }, [email, password, confirmPassword, fullName, phone, router, onClose, toast])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value)
    setPhone(formattedPhone)
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value)
    setCpf(formattedCPF)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Criar conta
            </h2>
          </DialogTitle>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Fazer login
            </button>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>

          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              name="cpf"
              type="text"
              required
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 