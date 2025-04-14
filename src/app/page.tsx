'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LoginModal from '@/components/LoginModal'

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={150}
                  height={50}
                  priority
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg shadow-sm transition-all duration-200"
              >
                Login
              </button>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8">
            Encontre seus{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              clientes ideais
            </span>
            <br />
            de forma inteligente
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Busca Cliente.ia é a plataforma que ajuda você a encontrar contatos de empresas
            e profissionais filtrados por nicho, utilizando dados públicos das principais
            redes sociais.
          </p>
          <div className="flex justify-center mb-16">
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg font-semibold"
            >
              Começar Gratuitamente
            </Link>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Busca Inteligente',
                description: 'Encontre leads qualificados usando filtros avançados por nicho, localização e comportamento.',
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                title: 'Dados Enriquecidos',
                description: 'Acesse informações detalhadas de contato, incluindo email, telefone e redes sociais.',
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: 'Exportação Fácil',
                description: 'Exporte seus leads encontrados em diversos formatos compatíveis com suas ferramentas.',
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="py-16 mb-16 border-t border-b border-gray-200">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <span className="text-gray-900">O que nossos </span>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                clientes dizem
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Marcos Silva</h3>
                    <p className="text-sm text-gray-600">CEO da TechSolutions</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Incrível como a ferramenta facilitou nossa prospecção. Conseguimos encontrar leads qualificados de forma muito mais eficiente. O ROI foi excepcional!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Ana Costa</h3>
                    <p className="text-sm text-gray-600">Marketing Manager</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Os filtros avançados são fantásticos! Conseguimos segmentar perfeitamente nosso público-alvo e aumentamos nossa taxa de conversão em 150%."
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    R
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Rafael Santos</h3>
                    <p className="text-sm text-gray-600">Diretor Comercial</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "A melhor ferramenta de prospecção que já usei. A qualidade dos contatos é impressionante e o suporte é excelente. Recomendo fortemente!"
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <h2 className="text-4xl font-bold mb-12 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase">
              NOSSOS PLANOS
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Plano Free',
                price: 'Grátis',
                features: [
                  '10 buscas por mês',
                  '50 contatos por mês',
                  'Dados básicos de contato',
                  'Suporte por email',
                ],
                cta: 'Começar Grátis',
                ctaLink: '/register',
                popular: false,
              },
              {
                title: 'Plano Pro',
                price: 'R$ 49,90/mês',
                features: [
                  '50 buscas por mês',
                  '1.000 contatos por mês',
                  'Dados completos de contato',
                  'Suporte prioritário',
                  'Exportação em CSV',
                ],
                cta: 'Assinar Agora',
                ctaLink: '/register?plan=pro',
                popular: true,
              },
              {
                title: 'Plano Escala',
                price: 'R$ 99,90/mês',
                features: [
                  'Até 100 buscas por mês',
                  'Até 3.000 contatos por mês',
                  'Filtros avançados',
                  'Exportação ilimitada',
                ],
                cta: 'Assinar Plano Escala',
                ctaLink: '/register?plan=enterprise',
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.title}
                className={`rounded-2xl p-8 font-poppins ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-900 shadow-xl scale-105'
                    : 'bg-white shadow-lg'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-4 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.title}
                </h3>
                <p className={`text-4xl font-bold mb-6 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-center ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaLink}
                  className={`block w-full text-center py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-50'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                  } transition-all`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Extra Contacts Section */}
          <div className="text-center py-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Precisa de mais contatos?
            </h3>
            <p className="text-lg text-gray-600">
              Adicione 1.000 contatos extras por apenas{' '}
              <span className="font-semibold text-blue-600">
                R$ 20,00/mês
              </span>
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Produto</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Como funciona</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Preços</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Cases</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Recursos</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Blog</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Guias</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Webinars</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Sobre</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Contato</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Carreiras</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Privacidade</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Termos</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Busca Cliente.ia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}