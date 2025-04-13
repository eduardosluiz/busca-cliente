'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erro na aplicação:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
          </p>
          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Tentar novamente
            </button>
            <Link
              href="/"
              className="block w-full text-center text-gray-600 hover:text-blue-600"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 