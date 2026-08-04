import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FieldProps {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
  error?: string
}

export function Field({ label, hint, htmlFor, children, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium tracking-tight text-ink"
        >
          {label}
        </label>
        {hint && <span className="text-xs text-mist">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className={cn('text-xs font-medium text-terracotta')}>{error}</p>
      )}
    </div>
  )
}
