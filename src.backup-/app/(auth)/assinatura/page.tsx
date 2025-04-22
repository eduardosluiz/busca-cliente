'use client'

import { CreditCard, Check } from 'lucide-react'

export default function AssinaturaPage() {
  const planos = [
    {
      nome: 'Básico',
      preco: 'R$ 49,90',
      recursos: [
        'Até 100 buscas por mês',
        'Até 500 contatos',
        'Suporte por email',
        'Acesso básico às ferramentas'
      ]
    },
    {
      nome: 'Profissional',
      preco: 'R$ 99,90',
      popular: true,
      recursos: [
        'Até 500 buscas por mês',
        'Até 2000 contatos',
        'Suporte prioritário',
        'Acesso a todas as ferramentas',
        'Integração com WhatsApp'
      ]
    },
    {
      nome: 'Enterprise',
      preco: 'R$ 199,90',
      recursos: [
        'Buscas ilimitadas',
        'Contatos ilimitados',
        'Suporte 24/7',
        'Acesso a todas as ferramentas',
        'Integrações avançadas',
        'API disponível'
      ]
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Planos e Assinatura</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-8">
        {planos.map((plano) => (
          <div
            key={plano.nome}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
              plano.popular ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            {plano.popular && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Mais Popular
              </span>
            )}
            <h3 className="text-xl font-bold mt-4">{plano.nome}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{plano.preco}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">/mês</p>
            
            <ul className="space-y-3">
              {plano.recursos.map((recurso) => (
                <li key={recurso} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>{recurso}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full mt-6 px-4 py-2 rounded-lg ${
                plano.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              }`}
            >
              Escolher Plano
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Status da Assinatura</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Plano Atual</p>
            <p className="font-semibold">Básico</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Próxima Cobrança</p>
            <p className="font-semibold">10/03/2024</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status do Pagamento</p>
            <p className="text-green-600 font-semibold">Ativo</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Método de Pagamento</p>
            <p className="font-semibold">•••• •••• •••• 4242</p>
          </div>
        </div>
      </div>
    </div>
  )
} 