import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    // Busca todos os usuários do Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      throw authError
    }

    // Busca informações adicionais dos perfis
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('users')
      .select('*')

    if (profilesError) {
      throw profilesError
    }

    // Combina os dados dos usuários com seus perfis
    const users = authUsers.users.map(authUser => {
      const profile = profiles.find(p => p.id === authUser.id)
      return {
        id: authUser.id,
        email: authUser.email,
        emailConfirmed: authUser.email_confirmed_at,
        lastSignIn: authUser.last_sign_in_at,
        createdAt: authUser.created_at,
        ...profile
      }
    })

    return NextResponse.json({
      users,
      total: users.length
    })

  } catch (error: any) {
    console.error('Erro ao listar usuários:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar usuários' },
      { status: 500 }
    )
  }
} 