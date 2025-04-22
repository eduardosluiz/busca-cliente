import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type UserProfile = {
  id: string
  name: string
  email: string
  company: string
  phone: string
  cpf: string
  email_notifications: boolean
  system_notifications: boolean
  created_at?: string
  updated_at?: string
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createClientComponentClient()
  
  try {
    console.log('Iniciando busca do perfil...')
    
    // Busca o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Erro ao buscar usuário:', userError)
      return null
    }

    console.log('Usuário autenticado:', user.id)

    // Retorna os dados do auth como perfil inicial
    const authProfile: UserProfile = {
      id: user.id,
      name: user.user_metadata?.name || '',
      email: user.email || '',
      company: user.user_metadata?.company || '',
      phone: user.user_metadata?.phone || '',
      cpf: user.user_metadata?.cpf || '',
      email_notifications: user.user_metadata?.email_notifications ?? true,
      system_notifications: user.user_metadata?.system_notifications ?? true
    }

    // Tenta buscar o perfil do usuário
    const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar perfil:', error)
      // Se o perfil não existe, cria um novo
      if (error.code === 'PGRST116') {
        console.log('Perfil não encontrado, criando novo...')
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || '',
            company: user.user_metadata?.company || '',
            phone: user.user_metadata?.phone || '',
            cpf: user.user_metadata?.cpf || '',
            email_notifications: true,
            system_notifications: true
          }])
          .select()
          .single()

        if (insertError) {
          console.error('Erro ao criar perfil:', insertError)
          return authProfile
        }
      }
      return authProfile
    }

    // Se encontrou o perfil, mescla com os dados do auth
    if (profile) {
      console.log('Perfil encontrado:', profile)
      return {
        ...authProfile,
        name: profile.name || authProfile.name,
        company: profile.company || authProfile.company,
        phone: profile.phone || authProfile.phone,
        cpf: profile.cpf || authProfile.cpf,
        email_notifications: profile.email_notifications ?? authProfile.email_notifications,
        system_notifications: profile.system_notifications ?? authProfile.system_notifications
      }
    }

    // Se não encontrou, retorna apenas os dados do auth
    return authProfile

  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }
}

export async function updateUserProfile(profile: UserProfile): Promise<boolean> {
  const supabase = createClientComponentClient()

  try {
    // Atualiza os metadados do usuário primeiro
    const { error: userError } = await supabase.auth.updateUser({
      data: {
        name: profile.name,
        company: profile.company,
        phone: profile.phone,
        cpf: profile.cpf,
        email_notifications: profile.email_notifications,
        system_notifications: profile.system_notifications
      }
    })

    if (userError) {
      console.error('Erro ao atualizar metadados:', userError)
      return false
    }

    // Prepara os dados do perfil
    const profileData = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      company: profile.company,
      phone: profile.phone,
      cpf: profile.cpf,
      email_notifications: profile.email_notifications,
      system_notifications: profile.system_notifications
    }

    // Tenta atualizar o perfil existente
    const { error: updateError } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', profile.id)
      .select()

    // Se o perfil não existe (erro 404), tenta criar um novo
    if (updateError?.code === 'PGRST116') {
      console.log('Perfil não encontrado, tentando criar...')
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()

      if (insertError) {
        console.error('Erro ao criar perfil:', insertError)
        return false
      }
    } else if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    return false
  }
}

export async function updatePassword(password: string): Promise<boolean> {
  try {
    if (!password) {
      throw new Error('A senha não pode estar vazia')
    }

    if (password.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres')
    }

    // Validações de segurança
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new Error(
        'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
      )
    }

    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      console.error('Erro ao atualizar senha:', error.message)
      throw new Error('Erro ao atualizar senha. Por favor, tente novamente.')
    }

    return true
  } catch (error) {
    console.error('Erro em updatePassword:', error)
    throw error
  }
} 