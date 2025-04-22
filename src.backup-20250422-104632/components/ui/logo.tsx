import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className, width = 150, height = 40 }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="Logo Evidence Assessoria"
      width={width}
      height={height}
      className={cn('object-contain', className)}
      priority
    />
  )
} 