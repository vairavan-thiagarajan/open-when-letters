import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/toastContext'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
}

export function CopyButton({ value, label = 'Copy', className }: CopyButtonProps) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast('Copied!')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast('Could not copy')
    }
  }

  return (
    <Button
      variant="outline"
      size="md"
      onClick={handleCopy}
      animate={copied ? { scale: [1, 1.06, 1] } : undefined}
      transition={{ duration: 0.35, ease: EASE }}
      className={cn('shrink-0', copied && 'border-highlighter-yellow bg-blush text-forest-ink', className)}
    >
      {copied ? (
        <>
          Copied
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      ) : (
        label
      )}
    </Button>
  )
}
