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
        'text-xl font-medium tracking-tight font-poppins',
        'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500',
        'animate-gradient',
        className
      )}
      style={{
        backgroundSize: '200% auto',
      }}
    >
      {children}
    </h1>
  )
} 