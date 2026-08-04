import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/toastContext'
import { cn } from '@/utils/cn'

interface ShareButtonProps {
  url: string
  label?: string
  variant?: 'primary' | 'ghost' | 'outline' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

async function copyLink(url: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
    return
  }
  const input = document.createElement('input')
  input.value = url
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}

export function ShareButton({
  url,
  label = 'Share',
  variant = 'primary',
  size = 'md',
  className,
}: ShareButtonProps) {
  const toast = useToast()

  const handleShare = async () => {
    const share = (navigator as Navigator & { share?: (data: ShareData) => Promise<void> })
      .share

    if (share) {
      try {
        await share({ title: 'Open When Letters', url })
        return
      } catch {
        // user dismissed the native sheet — fall through to copy
      }
    }

    try {
      await copyLink(url)
      toast('Link copied!')
    } catch {
      toast('Could not copy the link')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
        <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8.6 10.8l6.8-4M8.6 13.2l6.8 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {label}
    </Button>
  )
}
