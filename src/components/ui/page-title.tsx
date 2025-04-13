'use client'

import { cn } from '@/lib/utils'

interface PageTitleProps {
  className?: string
  children: React.ReactNode
}

export function PageTitle({ className, children }: PageTitleProps) {
  return (
    <h1 
      className={cn(
        'text-3xl font-bold tracking-tight',
        'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500',
        className
      )}
    >
      {children}
    </h1>
  )
} 