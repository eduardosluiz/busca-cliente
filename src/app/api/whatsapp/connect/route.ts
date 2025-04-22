import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { token, phoneNumber } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // TODO: Implementar a lógica real de conexão com a API do WhatsApp
    // Por enquanto, vamos simular o processo

    // 1. Validar o token e número
    if (!token || !phoneNumber) {
      return NextResponse.json(
        { error: 'Token e número de telefone são obrigatórios' },
        { status: 400 }
      )
    }

    // 2. Atualizar o status da conexão no banco
    const { error: updateError } = await supabase
      .from('chat_settings')
      .update({
        connection_status: {
          status: 'connected',
          lastConnection: new Date().toISOString()
        }
      })
      .eq('whatsapp_token', token)
      .eq('whatsapp_number', phoneNumber)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      status: 'connected',
      lastConnection: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao conectar WhatsApp:', error)
    return NextResponse.json(
      { error: 'Falha ao conectar com o WhatsApp' },
      { status: 500 }
    )
  }
} 