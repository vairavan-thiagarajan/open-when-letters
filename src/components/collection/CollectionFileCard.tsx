import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LETTER_FONT_FAMILY } from '@/data/letterStudio'
import type { Collection } from '@/services/types'
import { EASE } from '@/utils/anim'

interface CollectionFileCardProps {
  collection: Collection
  index: number
  /** The primary destination: view for the example, edit for your own. */
  href: string
  /** Marks the built-in example collection, whose folder tab reads "Sample". */
  sample?: boolean
  /** When provided the card gets Edit / View / Delete controls. */
  onDelete?: () => void
}

/**
 * A collection as a manila file: the collection's title is written over the
 * folder in the same hand as the letter covers — a mono "Collection" eyebrow
 * with the name in Cormorant italic.
 */
export function CollectionFileCard({
  collection,
  index,
  href,
  sample = false,
  onDelete,
}: CollectionFileCardProps) {
  const titleSplit = /^Open When\s+(.+)$/i.exec(collection.title.trim())
  const displayTitle = titleSplit ? titleSplit[1] : collection.title
  const tabLabel = sample ? 'Sample' : collection.visibility

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.4),
        ease: EASE,
      }}
      className="group relative flex h-full flex-col"
    >
      {/* the file folder */}
      <div
        className="relative z-10 flex flex-1 flex-col rounded-[1.25rem] border border-[#d9bf8a]/60 pt-8 shadow-[0_18px_40px_-22px_rgba(74,52,20,0.45)] transition-transform duration-300 group-hover:-translate-y-0.5"
        style={{
          background:
            'linear-gradient(160deg, #f4e5b8 0%, #ecd9a5 55%, #e0c88e 100%)',
        }}
      >
        {/* folder tab, labelled with the visibility */}
        <span
          className="absolute -top-[9px] right-[10%] flex h-[18px] w-24 items-center justify-center rounded-t-md border border-b-0 border-[#d9bf8a]/60 px-1"
          style={{
            background:
              'linear-gradient(160deg, #f4e5b8 0%, #ecd9a5 100%)',
          }}
        >
          <span className="truncate font-mono text-[9px] font-semibold tracking-widest text-[#4a3414]/60 uppercase">
            {tabLabel}
          </span>
        </span>

        {/* collection texts, letter-cover style */}
        <div className="flex flex-1 flex-col px-6 pb-6 text-center">
          <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#4a3414]/70 uppercase">
            Collection
          </span>
          <Link to={href} className="mt-1.5 block">
            <h3
              className="line-clamp-2 text-2xl leading-tight text-[#4a3414] transition-colors group-hover:text-forest-ink"
              style={{ fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic', fontWeight: 700 }}
            >
              {displayTitle}
            </h3>
          </Link>
          {collection.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4a3414]/70">
              {collection.description}
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-5">
            <Link
              to={onDelete ? `/open/${collection.slug}` : href}
              className="rounded-full border border-[#4a3414]/25 px-3.5 py-1.5 text-sm font-medium text-[#4a3414]/80 transition-colors hover:bg-[#4a3414]/5 hover:text-forest-ink"
            >
              View
            </Link>
            {onDelete && (
              <>
                <Link
                  to={href}
                  className="rounded-full bg-forest-ink px-3.5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={onDelete}
                  aria-label={`Delete ${collection.title}`}
                  title="Delete collection"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#4a3414]/25 text-[#4a3414]/70 transition-colors hover:border-terracotta/50 hover:bg-terracotta/10 hover:text-terracotta"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M5 7h14M9 4h6l1 3H8l1-3zM6 7l1 13h10l1-13M10 11v6M14 11v6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
