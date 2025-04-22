export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          user_id: string
          company_name: string
          category: string
          address: string
          phone: string
          email: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          category: string
          address: string
          phone: string
          email: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          category?: string
          address?: string
          phone?: string
          email?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_settings: {
        Row: {
          id: string
          user_id: string
          smtp_host: string
          smtp_port: number
          smtp_user: string
          smtp_password: string
          from_email: string
          from_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          smtp_host: string
          smtp_port: number
          smtp_user: string
          smtp_password: string
          from_email: string
          from_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          smtp_host?: string
          smtp_port?: number
          smtp_user?: string
          smtp_password?: string
          from_email?: string
          from_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_settings: {
        Row: {
          id: string
          user_id: string
          whatsapp_token: string
          whatsapp_number: string
          auto_reply_enabled: boolean
          auto_reply_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          whatsapp_token: string
          whatsapp_number: string
          auto_reply_enabled?: boolean
          auto_reply_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          whatsapp_token?: string
          whatsapp_number?: string
          auto_reply_enabled?: boolean
          auto_reply_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          status: string
          searches_limit: number
          contacts_limit: number
          emails_limit: number
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: string
          status: string
          searches_limit: number
          contacts_limit: number
          emails_limit: number
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          status?: string
          searches_limit?: number
          contacts_limit?: number
          emails_limit?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      searches: {
        Row: {
          id: string
          user_id: string
          query: string
          location: string
          results_count: number
          saved_contacts_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          location: string
          results_count: number
          saved_contacts_count: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          location?: string
          results_count?: number
          saved_contacts_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 