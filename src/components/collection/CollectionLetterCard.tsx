import { motion } from 'framer-motion'
import { EnvelopeThumb } from '@/components/letters/EnvelopeThumb'
import type { CollectionLetter } from '@/services/types'
import { EASE } from '@/utils/anim'

interface CollectionLetterCardProps {
  letter: CollectionLetter
  index: number
  onOpen: () => void
  shadow?: boolean
  /** Visitor mode: hover is a little more playful. */
  visitor?: boolean
}

/**
 * The letter itself is the card: an envelope cover with "Open When" and the
 * letter's name printed over the front, no outer box. Tilt it to open.
 */
export function CollectionLetterCard({
  letter,
  index,
  onOpen,
  shadow,
  visitor,
}: CollectionLetterCardProps) {
  const label = letter.title || undefined

  return (
    <motion.div
      initial={
        visitor ? { opacity: 0, y: 32, filter: 'blur(10px)' } : { opacity: 0, y: 24 }
      }
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: visitor ? 1 : 0.5,
        delay: Math.min(index * (visitor ? 0.18 : 0.06), visitor ? 1 : 0.5),
        ease: EASE,
      }}
      className="h-full"
    >
      <motion.button
        type="button"
        whileHover={
          visitor
            ? { y: -8, rotate: -2.5, scale: 1.04 }
            : { y: -6, rotate: -1.5, scale: 1.02 }
        }
        whileTap={{ scale: 0.97 }}
        onClick={onOpen}
        aria-label={label ? `Open when ${label}. Open the letter.` : 'Open the letter'}
        className="block h-full w-full cursor-pointer p-2 text-left"
      >
        <EnvelopeThumb cover={letter.coverImage} locked label={label} shadow={shadow} />
      </motion.button>
    </motion.div>
  )
}
