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
          fantasy_name: string | null
          category: string
          address: {
            street: string
            number: string
            complement?: string
            neighborhood: string
            city: string
            state: string
            zipCode: string
          }
          phone: string | null
          email: string | null
          website: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          fantasy_name?: string | null
          category: string
          address: {
            street: string
            number: string
            complement?: string
            neighborhood: string
            city: string
            state: string
            zipCode: string
          }
          phone?: string | null
          email?: string | null
          website?: string | null
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          fantasy_name?: string | null
          category?: string
          address?: {
            street: string
            number: string
            complement?: string
            neighborhood: string
            city: string
            state: string
            zipCode: string
          }
          phone?: string | null
          email?: string | null
          website?: string | null
          status?: string
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