'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Search,
  Users,
  CreditCard,
  Settings,
  Menu,
  X,
  Mail,
  HeadphonesIcon,
  LogOut,
  User
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('Usuário')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Recuperar estado do sidebar do localStorage
    const savedSidebarState = localStorage.getItem('sidebarOpen')
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState))
    }
    
    setIsLoading(false)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Persistir estado do sidebar
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen))
  }, [isSidebarOpen])

  const handleLogout = async () => {
    // Implementar lógica de logout aqui
    router.push('/login')
  }

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      href: '/buscar-clientes',
      label: 'Buscar Clientes',
      icon: Search
    },
    {
      href: '/meus-contatos',
      label: 'Meus Contatos', 
      icon: Users
    },
    {
      href: '/email',
      label: 'Email',
      icon: Mail
    },
    {
      href: '/atendimento',
      label: 'Atendimento',
      icon: HeadphonesIcon
    },
    {
      href: '/assinatura',
      label: 'Assinatura',
      icon: CreditCard
    },
    {
      href: '/configuracoes',
      label: 'Configurações',
      icon: Settings
    }
  ]

  // Função para obter o título da página atual
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.href === pathname)
    return currentItem ? currentItem.label : ''
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
    </div>
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Overlay para mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-0 md:w-20",
          isMobile && !isSidebarOpen && "hidden"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <div className={cn(
            "flex items-center justify-center transition-opacity duration-300 w-full px-4",
            !isSidebarOpen && "md:opacity-0"
          )}>
            <Image
              src="/images/logo.png"
              alt="BuscaCliente.IA"
              width={180}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        <nav className="mt-2 flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 my-1 mx-2 rounded-lg transition-all duration-200",
                    "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    isActive && "bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium"
                  )}
                >
                  <Icon size={20} />
                  <span className={cn(
                    "ml-4 transition-opacity duration-300",
                    !isSidebarOpen && "md:hidden"
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Badge do usuário e logout */}
          <div className="p-4 border-t border-gray-200">
            <div className={cn(
              "flex items-center gap-3 mb-2 px-2 py-1",
              !isSidebarOpen && "md:justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div className={cn(
                "flex-1 transition-opacity duration-300",
                !isSidebarOpen && "md:hidden"
              )}>
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500">Plano Básico</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2",
                !isSidebarOpen && "md:justify-center"
              )}
            >
              <LogOut size={18} />
              <span className={cn(
                "transition-opacity duration-300",
                !isSidebarOpen && "md:hidden"
              )}>
                Sair
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Botão toggle para mobile */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={cn(
            "fixed z-20 m-4 p-2 bg-white rounded-lg shadow-lg transition-opacity duration-300",
            isSidebarOpen && "opacity-0 pointer-events-none"
          )}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Conteúdo principal */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "md:ml-0" : "md:ml-0"
      )}>
        {/* Header com título da página */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {getCurrentPageTitle()}
          </h1>
        </header>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  )
} 