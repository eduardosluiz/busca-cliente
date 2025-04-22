import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User, AuthError, AuthResponse, Session } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Tipos
export type AuthResult<T> = {
  data: T | null
  error: AuthError | null
}

// Cliente Supabase tipado
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas')
  }

  return createClientComponentClient<Database>()
}

// Função para fazer login com email/senha
export const signInWithPassword = async (
  email: string,
  password: string
): Promise<AuthResult<Session>> => {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data: data.session, error: null }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return { data: null, error: error as AuthError }
  }
}

// Função para login com Google
export const signInWithGoogle = async (): Promise<AuthResult<void>> => {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error

    return { data: null, error: null }
  } catch (error) {
    console.error('Erro no login com Google:', error)
    return { data: null, error: error as AuthError }
  }
}

// Função para registrar novo usuário
export const signUp = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResult<Session>> => {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (error) throw error

    return { data: data.session, error: null }
  } catch (error) {
    console.error('Erro ao registrar:', error)
    return { data: null, error: error as AuthError }
  }
}

// Função para fazer logout
export const signOut = async (): Promise<AuthResult<void>> => {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return { data: null, error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    return { data: null, error: error as AuthError }
  }
}

// Função para obter sessão atual
export const getSession = async (): Promise<AuthResult<Session>> => {
  try {
    const supabase = createSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    return { data: session, error: null }
  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return { data: null, error: error as AuthError }
  }
}

// Função para obter usuário atual
export const getCurrentUser = async (): Promise<AuthResult<User>> => {
  try {
    const supabase = createSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw error

    return { data: user, error: null }
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return { data: null, error: error as AuthError }
  }
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: session } = await getSession()
  return !!session
}

// Função para atualizar o usuário
export const updateUser = async (
  attributes: { email?: string; password?: string; data?: { name?: string } }
): Promise<AuthResult<User>> => {
  try {
    const supabase = createSupabaseClient()
    const { data: { user }, error } = await supabase.auth.updateUser(attributes)

    if (error) throw error

    return { data: user, error: null }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return { data: null, error: error as AuthError }
  }
}

// Função para recuperação de senha
export const resetPassword = async (email: string): Promise<AuthResult<void>> => {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (error) throw error

    return { data: null, error: null }
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error)
    return { data: null, error: error as AuthError }
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

    const supabase = createSupabaseClient()
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

// Função para atualizar dados do usuário
export const updateUserProfile = async (data: { 
  name?: string
  company?: string
  phone?: string
}) => {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.updateUser({
      data,
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return { error }
  }
}

// Configurar listener para mudanças na autenticação
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const supabase = createSupabaseClient()
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
  const { data: user } = await getCurrentUser()
  if (!user) return false

  try {
    const supabase = createSupabaseClient()
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

export async function signUpWithPassword(
  email: string,
  password: string,
  fullName: string,
  phone: string
) {
  try {
    const supabase = createSupabaseClient()
    
    // Validações básicas
    if (!email || !password || !fullName || !phone) {
      throw new Error('Todos os campos são obrigatórios')
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido')
    }

    // Validação de telefone
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/
    if (!phoneRegex.test(phone)) {
      throw new Error('Telefone inválido')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    })

    if (error) throw error

    return { data: data.session, error: null }
  } catch (error) {
    console.error('Erro ao registrar:', error)
    return { data: null, error: error as AuthError }
  }
} 