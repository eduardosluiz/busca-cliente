import 'dotenv/config'
import { setupDatabase } from '../lib/supabase'

async function main() {
  try {
    await setupDatabase()
    console.log('Banco de dados configurado com sucesso!')
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error)
    process.exit(1)
  }
}

main() 