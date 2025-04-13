import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Erro ao verificar tabela:', error)
      return NextResponse.json({ 
        exists: false,
        message: 'Tabela contacts não existe',
        error: error.message 
      })
    }

    return NextResponse.json({ 
      exists: true,
      message: 'Tabela contacts existe'
    })

  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json({ 
      exists: false,
      message: 'Erro ao verificar tabela',
      error: error.message 
    })
  }
} 