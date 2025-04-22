'use client'

import { useState } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal'
import { RegisterModal } from './RegisterModal'
import { Toaster } from './ui/toaster'

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold">BuscaCliente.IA</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={openLoginModal}
                className="px-4 py-2 text-gray-800 hover:text-gray-600"
              >
                Entrar
              </button>
              <button
                onClick={openRegisterModal}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </div>

        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={openRegisterModal}
        />

        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={openLoginModal}
        />
      </nav>
      <Toaster />
    </>
  )
} 