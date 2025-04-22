import { forwardRef, ReactNode } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

export interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
}

const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
InputWithIcon.displayName = 'InputWithIcon'

export { InputWithIcon } 