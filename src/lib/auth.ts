import { createBrowserClient } from '@/lib/supabase'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

// Função para registrar um novo usuário
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao registrar:', error)
    return { data: null, error }
  }
}

// Função para fazer login
export const signIn = async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
  try {
    const supabase = createBrowserClient()
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return { user: null, error }
  }
}

// Função para fazer logout
export const signOut = async (): Promise<{ error: any }> => {
  try {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    return { error }
  }
}

// Função para recuperar senha
export const resetPassword = async (email: string) => {
  try {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error)
    return { data: null, error }
  }
}

// Função para atualizar senha
export const updatePassword = async (password: string) => {
  try {
    // Validações de segurança
    if (!password) {
      throw new Error('A senha é obrigatória')
    }
    
    if (password.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres')
    }
    
    if (!/[A-Z]/.test(password)) {
      throw new Error('A senha deve conter pelo menos uma letra maiúscula')
    }
    
    if (!/[a-z]/.test(password)) {
      throw new Error('A senha deve conter pelo menos uma letra minúscula')
    }
    
    if (!/[0-9]/.test(password)) {
      throw new Error('A senha deve conter pelo menos um número')
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      throw new Error('A senha deve conter pelo menos um caractere especial (!@#$%^&*)')
    }

    const supabase = createBrowserClient()
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao atualizar senha:', error)
    return { data: null, error }
  }
}

// Função para obter usuário atual
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const supabase = createBrowserClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    return null
  }
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user
}

// Função para atualizar dados do usuário
export const updateUserProfile = async (data: { 
  name?: string
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
  const supabase = createBrowserClient()
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
  return subscription
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