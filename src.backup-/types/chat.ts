export interface ChatConversation {
  id: string
  user_id: string
  contact_id: string
  whatsapp_number: string
  last_message?: string
  last_message_at?: string
  unread_count: number
  status: 'active' | 'archived' | 'deleted'
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  direction: 'incoming' | 'outgoing'
  content: string
  message_type: 'text' | 'image' | 'file' | 'location'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  metadata?: {
    filename?: string
    mime_type?: string
    size?: number
    url?: string
    latitude?: number
    longitude?: number
  }
  created_at: string
  updated_at: string
}

export interface ChatSettings {
  id: string
  user_id: string
  whatsapp_token: string
  whatsapp_number: string
  auto_reply_enabled: boolean
  auto_reply_message?: string
  connection_status?: WhatsAppConnectionStatus
  created_at: string
  updated_at: string
}

export type WhatsAppConnectionStatus = {
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  lastConnection?: string
  error?: string
  qrCode?: string
} 