'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { plan?: string }
}) {
  const router = useRouter()
  const plan = searchParams.plan
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatCPF = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara do CPF (XXX.XXX.XXX-XX)
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const formattedValue = formatCPF(value)
    setCpf(formattedValue.slice(0, 14)) // Limita a 14 caracteres (XXX.XXX.XXX-XX)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData(event.currentTarget)
      const data = {
        name: formData.get('name'),
        cpf: formData.get('cpf'),
        email: formData.get('email'),
        password: formData.get('password'),
        plan: formData.get('plan')
      }

      // Aqui você implementará a chamada à API de registro
      // Por enquanto, vamos simular um registro bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simula chamada à API
      
      // Se o plano for pago, redireciona para checkout
      if (plan === 'pro' || plan === 'enterprise') {
        router.push('/checkout')
      } else {
        // Se for plano gratuito, redireciona para dashboard
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Ocorreu um erro ao criar sua conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Criar sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {plan ? 'Você selecionou o ' : 'Começar com o '}
            <span className="font-semibold">
              {plan === 'pro' 
                ? 'Plano Pro' 
                : plan === 'enterprise' 
                  ? 'Plano Escala' 
                  : 'Plano Free'}
            </span>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="plan" value={plan || 'free'} />
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label htmlFor="cpf" className="sr-only">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                value={cpf}
                onChange={handleCPFChange}
                className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="CPF (ex: 123.456.789-00)"
                maxLength={14}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="Senha"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </span>
              ) : (
                'Criar conta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 