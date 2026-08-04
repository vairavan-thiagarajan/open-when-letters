import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  /** Optional element rendered inside the field, on the right (e.g. an eye toggle). */
  rightSlot?: ReactNode
}

const fieldClass = (hasError: boolean, hasRightSlot: boolean) =>
  cn(
    'w-full rounded-2xl border bg-paper px-4 py-3 text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] outline-none transition-colors duration-200 placeholder:text-mist',
    hasRightSlot && 'pr-12',
    hasError
      ? 'border-forest-ink/70 ring-2 ring-highlighter-yellow/50'
      : 'border-line focus:border-highlighter-yellow',
  )

export function AuthInput({
  label,
  error,
  hint,
  id,
  type = 'text',
  rightSlot,
  className,
  ...props
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium tracking-tight text-ink">
          {label}
        </label>
        {hint && <span className="text-xs text-mist">{hint}</span>}
      </div>

      <div className="relative">
        <input
          id={id}
          type={type}
          aria-invalid={Boolean(error)}
          className={cn(fieldClass(Boolean(error), Boolean(rightSlot)), className)}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-1 flex items-center">{rightSlot}</div>
        )}
      </div>

      {error && <p className="text-xs font-medium text-terracotta">{error}</p>}
    </div>
  )
}
