import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4'
}

export function Spinner({ className, size = 'sm' }: SpinnerProps) {
  return (
    <div className={cn('relative', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full',
          sizeClasses[size],
          'border-blue-600/50 border-t-blue-600 border-r-cyan-500 border-b-cyan-500/50',
          'bg-transparent'
        )}
      />
    </div>
  )
}

interface SpinnerInlineProps {
  className?: string
}

export function SpinnerInline({ className }: SpinnerInlineProps) {
  return (
    <div
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
    />
  )
} 