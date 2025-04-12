import Image from 'next/image'

export default function ConfiguracoesPage() {
  return (
    <div className="flex h-screen bg-white">
      {/* Menu Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Busca Cliente</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-600 hover:text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/buscar-clientes" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-600 hover:text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Buscar Clientes</span>
              </a>
            </li>
            <li>
              <a href="/meus-contatos" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-600 hover:text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Meus Contatos</span>
              </a>
            </li>
            <li>
              <a href="/assinatura" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-600 hover:text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span>Assinatura</span>
              </a>
            </li>
            <li>
              <a href="/configuracoes" className="flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-2 text-gray-600">
            Gerencie suas informações pessoais e preferências
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seção de Perfil */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Perfil</h2>
              <p className="text-sm text-gray-600 mb-6">Atualize suas informações pessoais</p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    defaultValue="João Silva"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    defaultValue="joao@exemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    defaultValue="Minha Empresa Ltda"
                  />
                </div>

                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity">
                  Salvar Alterações
                </button>
              </div>
            </div>

            {/* Seção de Preferências e Segurança */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferências</h2>
                <p className="text-sm text-gray-600 mb-6">Personalize sua experiência</p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Tema Escuro</h3>
                      <p className="text-sm text-gray-600">Ativar tema escuro na interface</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-gray-200"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                        <span className="opacity-0 duration-100 ease-out absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="opacity-100 duration-200 ease-in absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Notificações por Email</h3>
                      <p className="text-sm text-gray-600">Receber atualizações e novidades por email</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-gradient-to-r from-blue-600 to-cyan-500"
                      role="switch"
                      aria-checked="true"
                    >
                      <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                        <span className="opacity-0 duration-100 ease-out absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="opacity-100 duration-200 ease-in absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Notificações no Aplicativo</h3>
                      <p className="text-sm text-gray-600">Receber notificações dentro do aplicativo</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-gray-200"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                        <span className="opacity-0 duration-100 ease-out absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="opacity-100 duration-200 ease-in absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Seção de Segurança */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h2>
                <p className="text-sm text-gray-600 mb-6">Gerencie suas configurações de segurança</p>

                <button className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 