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
import { formatDate } from '@/utils/formatDate'
import { EASE } from '@/utils/anim'
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
          ) : (
            <motion.div
              key={collections?.length ?? 'empty'}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              {collections && collections.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {collections.map((collection, index) => (
                <motion.article
                  key={collection.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.06, 0.4),
                    ease: EASE,
                  }}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-highlighter-yellow/60 hover:shadow-lift"
                >
                  <Link
                    to={`/edit/${collection.editToken}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blush">
                      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-forest-ink" aria-hidden>
                        <rect x="3" y="6" width="18" height="13" rx="3" fill="currentColor" />
                        <path
                          d="M4.5 9l7.5 5 7.5-5"
                          stroke="#fcfaf5"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="rounded-full bg-blush/70 px-3 py-1 font-mono text-[11px] font-semibold tracking-widest text-ink-soft uppercase">
                      {collection.visibility}
                    </span>
                  </Link>

                  <Link to={`/edit/${collection.editToken}`} className="mt-4 block">
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-forest-ink">
                      {collection.title}
                    </h3>
                  </Link>
                  {collection.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                      {collection.description}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <span className="min-w-0 truncate text-xs text-mist">
                      Created {formatDate(collection.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/open/${collection.slug}`}
                        className="rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-forest-ink"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit/${collection.editToken}`}
                        className="rounded-full bg-forest-ink px-3.5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(collection)}
                        aria-label={`Delete ${collection.title}`}
                        title="Delete collection"
                        className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-terracotta/50 hover:bg-terracotta/10 hover:text-terracotta"
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
                    </div>
                  </div>
                </motion.article>
              ))}
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(collections.length * 0.06, 0.4),
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
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="mt-10 rounded-[2rem] border border-line bg-cream/60"
            >
              <EmptyState
                title={error ? 'Could not load your collections' : 'No collections yet'}
                text={
                  error ??
                  'Your saved collections will appear here soon. Start one now and it will be waiting for you.'
                }
              >
                {error ? (
                  <Button size="lg" onClick={load}>
                    Try again
                  </Button>
                ) : (
                  <Link to="/create">
                    <Button size="lg">Add Collection</Button>
                  </Link>
                )}
              </EmptyState>
            </motion.div>
          )}
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
                  it. Anyone with the link will see it disappear — this can’t be
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
