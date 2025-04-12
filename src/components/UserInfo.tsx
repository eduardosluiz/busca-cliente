'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'

export default function UserInfo() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email)
        setUserName(user.user_metadata?.name || null)
      }
    }
    getUserInfo()
  }, [supabase.auth])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userEmail) return null

  return (
    <div className="fixed bottom-0 left-0 p-4 bg-white border-t border-r border-gray-200 rounded-tr-lg shadow-lg">
      <div className="flex flex-col space-y-2">
        <div className="text-sm">
          <span className="text-gray-500">Logado como:</span>
          <div className="font-medium text-gray-900">
            {userName || userEmail}
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
        >
          {loading ? (
            <span>Saindo...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
} 