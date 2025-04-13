'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserProfile, getUserProfile } from '@/services/user'
import { UserBadge } from './ui/user-badge'
import { useAuth } from '@/app/providers'

export default function UserInfo() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function getUserInfo() {
      try {
        if (!isAuthenticated || !user) {
          if (isMounted) {
            setLoading(false)
          }
          return
        }

        const profile = await getUserProfile()
        if (!isMounted) return

        if (profile) {
          setUserInfo(profile)
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getUserInfo()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user])

  if (authLoading || loading || !isAuthenticated) {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <UserBadge 
        userName={userInfo?.name || user?.email || 'Usuário'}
      />
    </div>
  )
} 