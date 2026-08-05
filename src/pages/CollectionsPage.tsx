import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { CollectionsGridSkeleton } from '@/components/ui/PageSkeletons'
import { useUser } from '@/context/authContext'
import { useToast } from '@/components/ui/toastContext'
import { usePageMeta } from '@/utils/meta'
import { collectionService } from '@/services/collectionService'
import { clearCollectionOgImage } from '@/utils/ogImage'
import { EASE } from '@/utils/anim'
import { EXAMPLE_COLLECTION } from '@/data/exampleCollection'
import { CollectionFileCard } from '@/components/collection/CollectionFileCard'
import type { Collection } from '@/services/types'

export function CollectionsPage() {
  const user = useUser()
  const toast = useToast()
  const [collections, setCollections] = useState<Collection[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Collection | null>(null)
  const [deleting, setDeleting] = useState(false)

  usePageMeta({
    title: 'Your letter collections · Open When Letters',
    description: 'Every collection you create lives here, safe behind your account.',
    path: '/collections',
    noindex: true,
  })

  const load = useCallback(async () => {
    if (!user) return
    setError(null)
    try {
      const items = await collectionService.listByUser(user.id)
      setCollections(items)
    } catch (err) {
      setCollections([])
      setError(err instanceof Error ? err.message : 'Could not load your collections')
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async () => {
    if (!pendingDelete || deleting) return
    setDeleting(true)
    try {
      await collectionService.delete(pendingDelete.id)
      clearCollectionOgImage(pendingDelete.id)
      setCollections((items) =>
        (items ?? []).filter((item) => item.id !== pendingDelete.id),
      )
      setPendingDelete(null)
      toast(`Deleted "${pendingDelete.title}"`)
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : `Could not delete "${pendingDelete.title}"`,
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
      <main className="flex-1 pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
              Collections
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Your letter collections
            </h1>
            <p className="mt-3 text-ink-soft">
              Every collection you create will live here, safe behind your
              account.
            </p>
          </motion.div>

          {collections === null && !error ? (
            <CollectionsGridSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="mt-10 rounded-[2rem] border border-line bg-cream/60"
            >
              <EmptyState
                title="Could not load your collections"
                text={error}
              >
                <Button size="lg" onClick={load}>
                  Try again
                </Button>
              </EmptyState>
            </motion.div>
          ) : (
            <motion.div
              key={collections?.length ?? 'empty'}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {/* The built-in example collection, shown in the same format
                    as a collection you created yourself */}
                <CollectionFileCard
                  collection={EXAMPLE_COLLECTION}
                  index={0}
                  href="/open/example"
                  sample
                />

                {(collections ?? []).map((collection, index) => (
                  <CollectionFileCard
                    key={collection.id}
                    collection={collection}
                    index={index + 1}
                    href={`/edit/${collection.editToken}`}
                    onDelete={() => setPendingDelete(collection)}
                  />
                ))}
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(((collections ?? []).length + 1) * 0.06, 0.4),
                    ease: EASE,
                  }}
                  className="h-full"
                >
                  <Link
                    to="/create"
                    className="flex h-full min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-cream/50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-highlighter-yellow/70 hover:bg-blush/30"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-blush text-forest-ink">
                      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="font-display text-xl font-semibold tracking-tight text-ink">
                      Add Collection
                    </span>
                    <span className="max-w-52 text-sm leading-relaxed text-ink-soft">
                      Start another collection of letters for someone you love.
                    </span>
                  </Link>
                </motion.article>
              </div>
            </motion.div>
          )}
        </div>
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {pendingDelete && (
          <Modal
            title="Delete collection?"
            onClose={() => !deleting && setPendingDelete(null)}
          >
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-display text-xl font-semibold tracking-tight text-ink">
                  Delete “{pendingDelete.title}”?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  This permanently removes the collection and every letter inside
                  it. Anyone with the link will see it disappear. This can’t be
                  undone.
                </p>
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setPendingDelete(null)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-terracotta text-white hover:opacity-90"
                >
                  {deleting ? 'Deleting…' : 'Delete collection'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
