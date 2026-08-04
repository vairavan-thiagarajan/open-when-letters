import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { EASE } from '@/utils/anim'
import { MemoryLightbox } from '@/components/memory/MemoryLightbox'

interface MemoryCardProps {
  /** Memory photo URL. When empty the component renders nothing. */
  src: string
  /** Description for the photo, used as alt text and in the lightbox. */
  alt?: string
}

/**
 * "The Memory" — one treasured photo shown after the letter body.
 * A quiet divider leads in, the image eases up gently, and a subtle caption
 * keeps the letter the emotional centrepiece. Clicking the photo opens a
 * fullscreen lightbox. Renders nothing when there is no photo.
 */
export function MemoryCard({ src, alt }: MemoryCardProps) {
  const [open, setOpen] = useState(false)
  if (!src) return null

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mx-auto mt-12 max-w-xl sm:mt-14"
    >
      <div className="mx-auto my-6 flex items-center gap-4 sm:my-9" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="text-forest-ink">♥</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <figcaption className="text-center">
        <span className="font-display text-xl font-semibold tracking-tight text-ink">
          The Memory
        </span>
      </figcaption>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open photo"
        className="group mt-6 block w-full cursor-pointer rounded-[2rem] border border-line bg-paper shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-ink"
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
          <img
            src={src}
            alt={alt ?? 'A treasured memory'}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </button>

      <p className="mt-4 text-center text-xs font-medium leading-relaxed text-mist">
        This moment always reminded me of you.
      </p>

      {open &&
        createPortal(
          <MemoryLightbox
            src={src}
            alt={alt ?? 'A treasured memory'}
            onClose={() => setOpen(false)}
          />,
          document.body,
        )}
    </motion.figure>
  )
}
