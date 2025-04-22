import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // TODO: Implementar a lógica real de verificação de status com a API do WhatsApp
    // Por enquanto, vamos simular o processo

    // Buscar o status atual no banco
    const { data, error } = await supabase
      .from('chat_settings')
      .select('connection_status')
      .single()

    if (error) {
      throw error
    }

    // Se não houver status, retornar desconectado
    if (!data?.connection_status) {
      return NextResponse.json({
        status: 'disconnected'
      })
    }

    return NextResponse.json(data.connection_status)
  } catch (error) {
    console.error('Erro ao verificar status do WhatsApp:', error)
    return NextResponse.json(
      { error: 'Falha ao verificar status do WhatsApp' },
      { status: 500 }
    )
  }
} 