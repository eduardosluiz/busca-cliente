'use client'

export default function EmailConfirmation({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight font-poppins bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Verifique seu email
          </h2>
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Confirmação pendente
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Enviamos um email para <span className="font-medium">{email}</span> com um link de confirmação.
                  </p>
                  <p className="mt-2">
                    Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-blue-700">
              <p className="font-medium">O que fazer agora?</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Verifique sua caixa de entrada</li>
                <li>Se não encontrar, verifique a pasta de spam</li>
                <li>Clique no link de confirmação no email</li>
                <li>Após confirmar, você poderá fazer login</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 