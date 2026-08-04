import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '@/utils/anim'

interface MemoryLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

/**
 * Fullscreen viewer for a memory photo.
 * Soft fade + gentle scale on open and close, dimmed backdrop, ESC to dismiss,
 * and a lightweight focus trap (Tab cycles inside, focus returns on close).
 */
export function MemoryLightbox({ src, alt, onClose }: MemoryLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey, true)
      restoreRef.current?.focus()
    }
  }, [onClose])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return
    const focusables: HTMLElement[] = []
    if (closeRef.current) focusables.push(closeRef.current)
    if (imageRef.current) focusables.push(imageRef.current)
    if (focusables.length === 0) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Memory photo"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-5 top-5 z-10 grid h-12 w-12 place-items-center rounded-full border border-cream/25 bg-ink/40 text-cream transition-colors duration-200 hover:border-cream/60 hover:text-cream"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <motion.img
        ref={imageRef}
        src={src}
        alt={alt}
        tabIndex={-1}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative z-[5] max-h-[85svh] max-w-full rounded-[2rem] border border-cream/20 object-contain shadow-[rgba(0,0,0,0.35)_0px_2px_8px_0px]"
      />
    </motion.div>
  )
}
