import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // TODO: Implementar a lógica real de desconexão com a API do WhatsApp
    // Por enquanto, vamos simular o processo

    // Atualizar o status da conexão no banco
    const { error: updateError } = await supabase
      .from('chat_settings')
      .update({
        connection_status: {
          status: 'disconnected',
          lastConnection: new Date().toISOString()
        }
      })

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      status: 'disconnected',
      lastConnection: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao desconectar WhatsApp:', error)
    return NextResponse.json(
      { error: 'Falha ao desconectar do WhatsApp' },
      { status: 500 }
    )
  }
} 