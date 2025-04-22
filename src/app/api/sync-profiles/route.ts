import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Tenta buscar um perfil qualquer
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Erro ao acessar o banco:', error)
      return NextResponse.json(
        { error: 'Erro ao acessar o banco' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Conexão com o banco estabelecida com sucesso',
      data
    })

  } catch (error) {
    console.error('Erro ao acessar o banco:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 