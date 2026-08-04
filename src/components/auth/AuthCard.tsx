import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/** Centered card that frames every authentication form. */
export function AuthCard({ title, subtitle, children, footer, className }: AuthCardProps) {
  return (
    <div className={cn('rounded-[2rem] border border-line bg-cream/60 p-6 sm:p-8', className)}>
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{subtitle}</p>
        )}
      </div>

      <div className="mt-7">{children}</div>

      {footer && (
        <div className="mt-7 border-t border-line pt-6 text-center">{footer}</div>
      )}
    </div>
  )
}
