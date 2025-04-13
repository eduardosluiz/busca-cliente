import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-lg border bg-card p-6 text-card-foreground shadow-sm dark:bg-gray-800 dark:text-white',
        className
      )}
    >
      {children}
    </div>
  )
} 