import { motion } from 'framer-motion'
import type { Collection } from '@/services/types'
import { EnvelopeThumb } from '@/components/letters/EnvelopeThumb'
import { ShareButton } from '@/components/ui/ShareButton'
import { EASE } from '@/utils/anim'

interface CollectionHeroProps {
  collection: Collection
  letterCount: number
}

/**
 * Clean, personal header for a shared collection: the collection's cover
 * (a sealed envelope), its title and a short description. No boxes, no
 * repeated labels — the letters are the hero.
 */
export function CollectionHero({ collection, letterCount }: CollectionHeroProps) {
  const publicUrl = `${window.location.origin}/open/${collection.slug}`

  return (
    <section className="relative px-5 pt-28 pb-8 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mx-auto w-24 sm:w-28"
        >
          <EnvelopeThumb cover={collection.coverImage} locked />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-6xl"
        >
          {collection.title}
        </motion.h1>

        {collection.description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {collection.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
          className="mt-7 flex items-center justify-center gap-3"
        >
          <ShareButton url={publicUrl} label="Share" />
          <span className="text-sm text-mist" aria-label={`${letterCount} ${letterCount === 1 ? 'letter' : 'letters'}`}>
            {letterCount} {letterCount === 1 ? 'letter' : 'letters'}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
