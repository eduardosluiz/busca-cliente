import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChatConversation, ChatMessage, ChatSettings } from '@/types/chat'

const supabase = createClientComponentClient()

// Funções para gerenciar configurações do WhatsApp
export async function getChatSettings() {
  const { data, error } = await supabase
    .from('chat_settings')
    .select('*')
    .single()

  if (error) throw error
  return data as ChatSettings
}

export async function updateChatSettings(settings: Partial<ChatSettings>) {
  const { data, error } = await supabase
    .from('chat_settings')
    .upsert({
      ...settings,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data as ChatSettings
}

// Funções para gerenciar a conexão do WhatsApp
export async function connectWhatsApp(token: string, phoneNumber: string) {
  // TODO: Implementar a conexão real com a API do WhatsApp
  // Por enquanto, simularemos o processo
  const response = await fetch('/api/whatsapp/connect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, phoneNumber }),
  })

  if (!response.ok) {
    throw new Error('Falha ao conectar com o WhatsApp')
  }

  return response.json()
}

export async function disconnectWhatsApp() {
  // TODO: Implementar a desconexão real com a API do WhatsApp
  const response = await fetch('/api/whatsapp/disconnect', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Falha ao desconectar do WhatsApp')
  }

  return response.json()
}

export async function getWhatsAppStatus() {
  // TODO: Implementar a verificação real do status com a API do WhatsApp
  const response = await fetch('/api/whatsapp/status')

  if (!response.ok) {
    throw new Error('Falha ao obter status do WhatsApp')
  }

  return response.json()
}

// Funções para gerenciar conversas
export async function getConversations() {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select(`
      *,
      contact:contacts (
        id,
        company_name,
        fantasy_name,
        phone
      )
    `)
    .order('last_message_at', { ascending: false })

  if (error) throw error
  return data as (ChatConversation & {
    contact: {
      id: string
      company_name: string
      fantasy_name?: string
      phone?: string
    }
  })[]
}

export async function getConversation(id: string) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select(`
      *,
      contact:contacts (
        id,
        company_name,
        fantasy_name,
        phone
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ChatConversation & {
    contact: {
      id: string
      company_name: string
      fantasy_name?: string
      phone?: string
    }
  }
}

export async function createConversation(contactId: string, whatsappNumber: string) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      contact_id: contactId,
      whatsapp_number: whatsappNumber,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error
  return data as ChatConversation
}

// Funções para gerenciar mensagens
export async function getMessages(conversationId: string, page = 1, pageSize = 50) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return data as ChatMessage[]
}

export async function sendMessage(conversationId: string, content: string, type: ChatMessage['message_type'] = 'text', metadata?: ChatMessage['metadata']) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      direction: 'outgoing',
      content,
      message_type: type,
      metadata,
      status: 'sent'
    })
    .select()
    .single()

  if (error) throw error
  return data as ChatMessage
}

export async function markMessagesAsRead(conversationId: string) {
  const { error } = await supabase
    .from('chat_messages')
    .update({ status: 'read' })
    .eq('conversation_id', conversationId)
    .eq('direction', 'incoming')
    .eq('status', 'delivered')

  if (error) throw error

  // Atualiza o contador de mensagens não lidas
  const { error: updateError } = await supabase
    .from('chat_conversations')
    .update({ unread_count: 0 })
    .eq('id', conversationId)

  if (updateError) throw updateError
}

// Função para receber webhook do WhatsApp
export async function handleWhatsAppWebhook(payload: any) {
  // Implementar lógica de webhook do WhatsApp
  // Esta função será chamada quando recebermos uma nova mensagem
  // Você precisará implementar de acordo com a API do WhatsApp que escolher
} 