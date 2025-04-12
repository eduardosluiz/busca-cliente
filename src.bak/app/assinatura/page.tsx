export default function AssinaturaPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Menu Lateral */}
      <aside className="w-64 bg-[#1E2A4A] text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Busca Cliente</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-600/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/buscar-clientes" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-600/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Buscar Clientes</span>
              </a>
            </li>
            <li>
              <a href="/meus-contatos" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-600/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Meus Contatos</span>
              </a>
            </li>
            <li>
              <a href="/assinatura" className="flex items-center space-x-3 p-2 rounded-lg bg-blue-600/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span>Assinatura</span>
              </a>
            </li>
            <li>
              <a href="/configuracoes" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-600/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Assinatura
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-600 mb-8">
              Visualize e altere seu plano atual de acordo com suas necessidades
            </p>

            {/* Plano Atual */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Sua assinatura atual
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Plano Início</h3>
                      <p className="text-sm text-gray-600">Assinatura ativa</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Fazer Upgrade
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Buscas utilizadas</span>
                        <span>12 / 50</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Contatos exportados</span>
                        <span>230 / 1000</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Adicionar 1.000 contatos (R$ 20,00)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alterar plano */}
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Alterar plano</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plano Free */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
                <div className="text-2xl font-bold text-gray-900 mb-1">Grátis</div>
                <p className="text-sm text-gray-600 mb-6">Ideal para testar a plataforma</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Até 10 buscas por mês
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Até 50 contatos por mês
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Filtros básicos
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sem exportação de dados
                  </li>
                </ul>

                <button className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Fazer Downgrade
                </button>
              </div>

              {/* Plano Início */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-600 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
                  Recomendado
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Início</h3>
                <div className="text-2xl font-bold text-gray-900 mb-1">R$ 49,90 <span className="text-sm font-normal text-gray-600">/mês</span></div>
                <p className="text-sm text-gray-600 mb-6">Para pequenas empresas</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Até 50 buscas por mês
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Até 1.000 contatos por mês
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Todos os filtros disponíveis
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Exportação de dados
                  </li>
                </ul>

                <button className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                  Plano Atual
                </button>
              </div>

              {/* Plano Premium */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium</h3>
                <div className="text-2xl font-bold text-gray-900 mb-1">R$ 69,90 <span className="text-sm font-normal text-gray-600">/mês</span></div>
                <p className="text-sm text-gray-600 mb-6">Para empresas em crescimento</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Até 100 buscas por mês
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Até 3.000 contatos por mês
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Filtros avançados
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Exportação ilimitada
                  </li>
                </ul>

                <button className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 