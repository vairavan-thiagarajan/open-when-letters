import { motion } from 'framer-motion'
import type { Collection } from '@/services/types'
import { EnvelopeThumb } from '@/components/letters/EnvelopeThumb'
import { LETTER_FONT_FAMILY } from '@/data/letterStudio'
import { EASE } from '@/utils/anim'

interface CollectionHeroProps {
  collection: Collection
  shadow?: boolean
  /** Visitor mode: the sealed envelope gently floats, as if waiting. */
  visitor?: boolean
  /** Fired once the visitor reveal (blur-to-focus) has finished. */
  onRevealed?: () => void
}

/**
 * Clean, personal header for a shared collection: the collection's cover
 * (a sealed envelope), its title and a short description. No boxes, no
 * repeated labels — the letters are the hero.
 */
export function CollectionHero({
  collection,
  shadow,
  visitor,
  onRevealed,
}: CollectionHeroProps) {

  return (
    <section className="relative px-5 pt-28 pb-8 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={
            visitor
              ? { opacity: 0, y: 24, scale: 0.95, filter: 'blur(10px)' }
              : { opacity: 0, y: 20, scale: 0.96 }
          }
          animate={
            visitor
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: visitor ? 1.2 : 0.6, ease: EASE }}
          className="relative mx-auto w-24 sm:w-28"
        >
          {visitor ? (
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <EnvelopeThumb cover={collection.coverImage} locked shadow={shadow} />
            </motion.div>
          ) : (
            <EnvelopeThumb cover={collection.coverImage} locked shadow={shadow} />
          )}
        </motion.div>

        <motion.h1
          initial={
            visitor ? { opacity: 0, y: 22, filter: 'blur(6px)' } : { opacity: 0, y: 18 }
          }
          animate={visitor ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 1, y: 0 }}
          transition={{ duration: visitor ? 1.2 : 0.8, delay: visitor ? 0.35 : 0.1, ease: EASE }}
          onAnimationComplete={visitor && !collection.description ? onRevealed : undefined}
          className="mt-6 text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-6xl"
          style={{ fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic' }}
        >
          {collection.title}
        </motion.h1>

        {collection.description && (
          <motion.p
            initial={
              visitor ? { opacity: 0, y: 18, filter: 'blur(4px)' } : { opacity: 0, y: 16 }
            }
            animate={visitor ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 1, y: 0 }}
            transition={{ duration: visitor ? 1.2 : 0.8, delay: visitor ? 0.6 : 0.2, ease: EASE }}
            onAnimationComplete={visitor ? onRevealed : undefined}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {collection.description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
