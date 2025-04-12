import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

// Função para registrar um novo usuário
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Função para fazer login
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Função para fazer logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Função para recuperar senha
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
}

// Função para atualizar senha
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}

// Função para obter usuário atual
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user
}

// Função para atualizar dados do usuário
export const updateUserProfile = async (data: { 
  full_name?: string
  company?: string
  phone?: string
}) => {
  const { error } = await supabase.auth.updateUser({
    data,
  })

  if (error) throw error
}

// Configurar listener para mudanças na autenticação
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// Middleware para verificar autenticação
export const requireAuth = async () => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Não autorizado')
  }
  return user
}

// Função para verificar se o usuário tem acesso a um recurso específico
export const checkPermission = async (resourceId: string) => {
  const user = await getCurrentUser()
  if (!user) return false

  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('resource_id', resourceId)
      .single()

    if (error) throw error
    return !!data
  } catch (error) {
    console.error('Erro ao verificar permissão:', error)
    return false
  }
} 