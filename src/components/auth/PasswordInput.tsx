import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { AuthInput } from './AuthInput'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

/** Password field with a show/hide toggle. */
export function PasswordInput({ label, error, hint, id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <AuthInput
      label={label}
      id={id}
      hint={hint}
      error={error}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="grid h-9 w-9 place-items-center rounded-xl text-ink-soft transition-colors hover:text-forest-ink"
        >
          {visible ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.9 4.2A9.8 9.8 0 0 1 12 4c5.2 0 8.5 4 9 5.5-.2.6-1 2-2.7 3.4m-3.5 1.9c-1.7 1.3-4.6 1.8-6.5.2C5.6 12.7 4 10.5 3 9.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M3 9.5C4.3 10.7 5.7 11.7 6.5 12 5.7 12.3 4.3 13.3 3 14.5M21 9.5c-1.3 1.2-2.7 2.2-3.5 2.5.8.3 2.2 1.3 3.5 2.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      }
      {...props}
    />
  )
}
