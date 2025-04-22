'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export default function EmailPage() {
  const [emailStats] = useState({
    enviados: 0,
    entregues: 0,
    abertos: 0,
    clicados: 0
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">E-mail Marketing</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">E-mails Enviados</h3>
          <p className="text-3xl font-bold text-blue-600">{emailStats.enviados}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Entregues</h3>
          <p className="text-3xl font-bold text-green-600">{emailStats.entregues}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Taxa de Abertura</h3>
          <p className="text-3xl font-bold text-yellow-600">{emailStats.abertos}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Taxa de Cliques</h3>
          <p className="text-3xl font-bold text-purple-600">{emailStats.clicados}%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Nova Campanha</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assunto</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Digite o assunto do e-mail"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo</label>
            <textarea
              className="w-full p-2 border rounded-lg h-32"
              placeholder="Digite o conteúdo do e-mail"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Criar Campanha
          </button>
        </form>
      </div>
    </div>
  )
} 