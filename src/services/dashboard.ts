import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface DashboardStats {
  totalContacts: number
  activeContacts: number
  inactiveContacts: number
  contactsByCategory: { category: string; count: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClientComponentClient()

  try {
    // Buscar total de contatos
    const { count: totalContacts } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })

    // Buscar contatos ativos
    const { count: activeContacts } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Ativo')

    // Buscar contatos inativos
    const { count: inactiveContacts } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Inativo')

    // Buscar contatos por categoria
    const { data: categoryCounts } = await supabase
      .from('contacts')
      .select('category')
      .then(({ data }) => {
        const counts = data?.reduce((acc: Record<string, number>, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1
          return acc
        }, {})
        return {
          data: Object.entries(counts || {}).map(([category, count]) => ({
            category,
            count
          }))
        }
      })

    return {
      totalContacts: totalContacts || 0,
      activeContacts: activeContacts || 0,
      inactiveContacts: inactiveContacts || 0,
      contactsByCategory: categoryCounts || []
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      totalContacts: 0,
      activeContacts: 0,
      inactiveContacts: 0,
      contactsByCategory: []
    }
  }
} 