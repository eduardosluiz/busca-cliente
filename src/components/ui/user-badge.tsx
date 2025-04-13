import { LogOut, User } from 'lucide-react'
import { signOut } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface UserBadgeProps {
  userName: string
  className?: string
}

export function UserBadge({ userName, className }: UserBadgeProps) {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 p-2 text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700',
      className
    )}>
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <span className="font-medium">{userName}</span>
      </div>
      
      <button
        onClick={handleSignOut}
        className="ml-2 rounded p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-white"
        title="Sair"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
} 