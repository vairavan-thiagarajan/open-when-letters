import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { CollectionHero } from '@/components/collection/CollectionHero'
import { CollectionLetterCard } from '@/components/collection/CollectionLetterCard'
import { LockedLetterCard } from '@/components/collection/LockedLetterCard'
import { LetterModal } from '@/components/collection/LetterModal'
import { PasswordGate } from '@/components/collection/PasswordGate'
import { EmptyState } from '@/components/ui/EmptyState'
import { MusicPlayer } from '@/components/ui/MusicPlayer'
import { ThemedSurface } from '@/components/theme/ThemedSurface'
import { CollectionPageSkeleton } from '@/components/ui/PageSkeletons'
import { collectionService } from '@/services/collectionService'
import { letterService } from '@/services/letterService'
import { setPageMeta, absoluteUrl } from '@/utils/meta'
import { getCollectionOgImage } from '@/utils/ogImage'
import { getUnlockWindow } from '@/utils/schedule'
import { hasUnlockedCollection, markCollectionUnlocked } from '@/utils/password'
import { useUser } from '@/context/authContext'
import { LETTER_FONT_FAMILY } from '@/data/letterStudio'
import { EASE } from '@/utils/anim'
import type { Collection, CollectionLetter } from '@/services/types'

export function CollectionPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const user = useUser()

  const [collection, setCollection] = useState<Collection | null>(null)
  const [letters, setLetters] = useState<CollectionLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeLetter, setActiveLetter] = useState<CollectionLetter | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const closeLetter = useCallback(() => setActiveLetter(null), [])

  useEffect(() => {
    let cancelled = false
    setRevealed(false)

    const load = async () => {
      try {
        const col = await collectionService.getBySlug(slug)
        if (!col) {
          setNotFound(true)
          setLoading(false)
          return
        }
        if (cancelled) return
        setCollection(col)
        setUnlocked(!col.passwordHash || hasUnlockedCollection(col.id))
        const items = await letterService.listByCollection(col.id)
        if (!cancelled) {
          setLetters(items)
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (notFound) {
      setPageMeta({
        title: 'Collection not found · Open When Letters',
        description: 'This collection may have been removed, or the link is wrong.',
        path: `/open/${slug}`,
        noindex: true,
      })
      return
    }
    if (!collection) return

    let active = true
    const apply = async () => {
      const image = await getCollectionOgImage(collection)
      if (!active) return
      setPageMeta({
        title: `${collection.title} · Open When Letters`,
        description:
          collection.description ||
          `A collection of letters to open at just the right moment.`,
        path: `/open/${collection.slug}`,
        og: { image },
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description || undefined,
          url: absoluteUrl(`/open/${collection.slug}`),
          dateCreated: collection.createdAt,
        },
      })
    }
    void apply()
    return () => {
      active = false
    }
  }, [collection, notFound, slug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <CollectionPageSkeleton />
        </main>
      </div>
    )
  }

  if (notFound || !collection) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="mx-auto grid h-20 w-20 place-items-center rounded-[2rem] bg-blush">
              <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-forest-ink" aria-hidden>
                <rect x="3" y="6" width="18" height="13" rx="3" fill="currentColor" />
                <path
                  d="M4.5 9l7.5 5 7.5-5"
                  stroke="#fcfaf5"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink">
              This collection has flown away
            </h1>
            <p className="mt-3 text-ink-soft">
              The link may be wrong, or the collection was removed.
            </p>
            <Link to="/create" className="mt-6 inline-block">
              <Button>Create your own</Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!unlocked && collection.passwordHash) {
    return (
      <ThemedSurface collection={collection} className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <PasswordGate
            title={collection.title}
            passwordHash={collection.passwordHash}
            onUnlock={() => {
              markCollectionUnlocked(collection.id)
              setUnlocked(true)
            }}
          />
        </main>
        <Footer />
      </ThemedSurface>
    )
  }

  const { open, locked } = letters.reduce<{
    open: CollectionLetter[]
    locked: CollectionLetter[]
  }>(
    (acc, letter) => {
      if (getUnlockWindow(letter).unlocked) acc.open.push(letter)
      else acc.locked.push(letter)
      return acc
    },
    { open: [], locked: [] },
  )

  const isOwner = collection.userId !== null && collection.userId === user?.id
  const visitor = !isOwner

  const signature = (
    <>
      {collection.from ? (
        <>
          <p className="text-sm text-mist">From</p>
          <p
            className="mt-1 text-2xl leading-tight text-forest-ink"
            style={{ fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic' }}
          >
            {collection.from}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-mist">Made with love on</p>
          <Link
            to="/create"
            className="mt-1 inline-block font-display text-lg font-semibold text-forest-ink transition-opacity hover:opacity-80"
          >
            Open When Letters
          </Link>
        </>
      )}
    </>
  )

  return (
    <ThemedSurface collection={collection} className="flex flex-col">
      {visitor ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Navbar />
        </motion.div>
      ) : (
        <Navbar />
      )}
      <main className="flex-1">
        <CollectionHero
          collection={collection}
          shadow={false}
          visitor={visitor}
          onRevealed={() => setRevealed(true)}
        />

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
          {letters.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {open.map((letter, index) => (
                <CollectionLetterCard
                  key={letter.id}
                  letter={letter}
                  index={index}
                  onOpen={() => setActiveLetter(letter)}
                  shadow={false}
                  visitor={visitor}
                />
              ))}
              {locked.map((letter, index) => (
                <LockedLetterCard
                  key={letter.id}
                  letter={letter}
                  index={open.length + index}
                  shadow={false}
                  visitor={visitor}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-paper/50">
              {isOwner ? (
                <EmptyState
                  title="No letters yet"
                  text="Add your first letter, a little note for a moment that hasn't happened yet."
                >
                  <Link to={`/edit/${collection.editToken}`} className="inline-block">
                    <Button>Write your first letter</Button>
                  </Link>
                </EmptyState>
              ) : (
                <EmptyState
                  title="This collection is still empty"
                  text="Letters are still being written. Check back soon. The best things are worth the wait."
                >
                  <Link to="/create" className="inline-block">
                    <Button variant="outline">Start your own collection</Button>
                  </Link>
                </EmptyState>
              )}
            </div>
          )}

          <div className="mt-16 text-center">
            {visitor ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {signature}
              </motion.div>
            ) : (
              <div>{signature}</div>
            )}
          </div>
        </section>
      </main>

      {collection.musicUrl && <MusicPlayer src={collection.musicUrl} />}

      <AnimatePresence>
        {activeLetter && (
          <LetterModal
            key={activeLetter.id}
            letter={activeLetter}
            onClose={closeLetter}
          />
        )}
      </AnimatePresence>
    </ThemedSurface>
  )
}
