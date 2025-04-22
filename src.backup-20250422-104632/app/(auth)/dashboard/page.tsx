export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Estatísticas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Total de Contatos</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">0</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">Buscas Realizadas</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 