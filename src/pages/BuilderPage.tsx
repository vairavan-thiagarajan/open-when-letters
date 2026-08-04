import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { ShareButton } from '@/components/ui/ShareButton'
import { QRCodeCard } from '@/components/ui/QRCode'
import { LetterEditor } from '@/components/builder/LetterEditor'
import { EmptyState } from '@/components/ui/EmptyState'
import { BuilderPageSkeleton } from '@/components/ui/PageSkeletons'
import { ThemedSurface } from '@/components/theme/ThemedSurface'
import { SettingsModal } from '@/components/builder/SettingsModal'
import { collectionService, type CollectionUpdate } from '@/services/collectionService'
import { letterService, type LetterUpdate } from '@/services/letterService'
import type { Collection, CollectionLetter } from '@/services/types'
import { useToast } from '@/components/ui/toastContext'
import { usePageMeta } from '@/utils/meta'
import { UNLOCK_META } from '@/utils/schedule'
import { cn } from '@/utils/cn'

type SaveState = 'idle' | 'saving' | 'saved'

export function BuilderPage() {
  const { token = '' } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [collection, setCollection] = useState<Collection | null>(null)
  const [letters, setLetters] = useState<CollectionLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const [publishOpen, setPublishOpen] = useState(false)
  const [publishSlug, setPublishSlug] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const collectionRef = useRef<Collection | null>(null)
  const letterTimer = useRef<number | undefined>(undefined)
  const metaTimer = useRef<number | undefined>(undefined)

  usePageMeta({
    title: collection ? `Edit ${collection.title} · Open When Letters` : 'Letter builder · Open When Letters',
    description: 'Compose your collection of open-when letters.',
    path: `/edit/${token}`,
    noindex: true,
  })

  useEffect(() => {
    collectionRef.current = collection
  }, [collection])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const col = await collectionService.getByEditToken(token)
        if (!col) {
          setNotFound(true)
          setLoading(false)
          return
        }
        if (cancelled) return
        setCollection(col)
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
      window.clearTimeout(letterTimer.current)
      window.clearTimeout(metaTimer.current)
    }
  }, [token])

  const updateMeta = (patch: CollectionUpdate) => {
    setCollection((current) => (current ? { ...current, ...patch } : current))
    setSaveState('saving')
    window.clearTimeout(metaTimer.current)
    metaTimer.current = window.setTimeout(async () => {
      if (!collectionRef.current) return
      try {
        await collectionService.update(collectionRef.current.id, patch)
        setSaveState('saved')
      } catch {
        toast('Could not save the collection')
      }
    }, 600)
  }

  const updateLetter = (id: string, patch: Partial<LetterUpdate>) => {
    setLetters((current) =>
      current.map((letter) => (letter.id === id ? { ...letter, ...patch } : letter)),
    )
    setSaveState('saving')
    window.clearTimeout(letterTimer.current)
    letterTimer.current = window.setTimeout(async () => {
      try {
        await letterService.update(id, patch)
        setSaveState('saved')
      } catch {
        toast('Could not save the letter')
      }
    }, 600)
  }

  const addLetter = async () => {
    if (!collection) return
    try {
      const letter = await letterService.create(collection.id, {
        title: '',
        trigger: '',
        body: '',
        coverImage: 0,
      })
      setLetters((current) => [...current, letter])
      setEditingId(letter.id)
    } catch {
      toast('Could not add a letter')
    }
  }

  const removeLetter = async (id: string) => {
    try {
      await letterService.delete(id)
      setLetters((current) => current.filter((letter) => letter.id !== id))
      if (editingId === id) setEditingId(null)
    } catch {
      toast('Could not delete the letter')
    }
  }

  const moveLetter = async (id: string, direction: -1 | 1) => {
    const index = letters.findIndex((letter) => letter.id === id)
    const target = index + direction
    if (target < 0 || target >= letters.length) return

    const current = letters[index]
    const other = letters[target]
    const next = [...letters]
    next.splice(index, 1, other)
    next.splice(target, 1, current)
    setLetters(next)

    await Promise.all([
      letterService.update(current.id, { position: target }),
      letterService.update(other.id, { position: index }),
    ]).catch(() => toast('Could not reorder the letters'))
  }

  const handlePublish = async () => {
    if (!collection) return
    setPublishing(true)
    try {
      const { slug } = await collectionService.publish(collection.id, collection.title)
      setPublishSlug(slug)
      setPublishOpen(true)
    } catch {
      toast('Could not publish the collection')
    } finally {
      setPublishing(false)
    }
  }

  const publicUrl = publishSlug ? `${window.location.origin}/open/${publishSlug}` : ''
  const editUrl = collection ? `${window.location.origin}/edit/${collection.editToken}` : ''

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <BuilderPageSkeleton />
        </main>
      </div>
    )
  }

  if (notFound || !collection) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
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
              This edit link isn't valid
            </h1>
            <p className="mt-3 text-ink-soft">
              It may have been mistyped, or the collection no longer exists.
            </p>
            <Link to="/create" className="mt-6 inline-block">
              <Button>Create a collection</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <ThemedSurface collection={collection} className="flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-24 sm:pt-28">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
                Letter builder
              </p>
              <input
                value={collection.title}
                onChange={(event) => updateMeta({ title: event.target.value })}
                placeholder="Collection title"
                maxLength={80}
                className="mt-2 w-full border-none bg-transparent font-display text-3xl font-semibold tracking-tight text-ink outline-none placeholder:text-mist sm:text-4xl"
                aria-label="Collection title"
              />
            </div>

            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:items-end">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  saveState === 'saving' ? 'bg-blush text-forest-ink' : 'text-mist',
                )}
              >
                {saveState === 'saving' ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-ink" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    All changes saved
                  </>
                )}
              </span>
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none"
                  onClick={() => setSettingsOpen(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="mr-1.5 h-4 w-4" aria-hidden>
                    <path
                      d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h10M18 17h2M14 5v4M8 10v4M16 15v4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Customize
                </Button>
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none"
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? 'Publishing…' : 'Publish collection'}
                </Button>
              </div>
            </div>
          </div>

          {/* Collection meta */}
          <div className="mt-6 rounded-xl border border-line bg-paper p-5 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] sm:p-6">
            <textarea
              value={collection.description}
              onChange={(event) => updateMeta({ description: event.target.value })}
              placeholder="A short description for anyone who opens the link…"
              rows={2}
              maxLength={240}
              className="w-full resize-none border-none bg-transparent px-2 py-1.5 text-ink placeholder:text-mist outline-none"
              aria-label="Collection description"
            />
            <div className="mt-4 border-t border-dashed border-line pt-5">
              <p className="text-xs leading-relaxed text-mist">
                Accent colours, password &amp; music live in{' '}
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="font-semibold text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink"
                >
                  Customize
                </button>
                .
              </p>
            </div>
          </div>

          {/* Letters */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Your letters
              </h2>
              <span className="text-sm text-mist">
                {letters.length} {letters.length === 1 ? 'letter' : 'letters'}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {letters.length === 0 && (
                <div className="rounded-xl border border-dashed border-line bg-paper/50">
                  <EmptyState
                    title="No letters yet"
                    text="Add your first letter — a little note for a moment that hasn't happened yet."
                  >
                    <Button onClick={addLetter}>Write your first letter</Button>
                  </EmptyState>
                </div>
              )}

              {letters.map((letter, index) =>
                editingId === letter.id ? (
                  <LetterEditor
                    key={letter.id}
                    letter={letter}
                    index={index}
                    total={letters.length}
                    onChange={(patch) => updateLetter(letter.id, patch)}
                    onDelete={() => removeLetter(letter.id)}
                    onMove={(direction) => moveLetter(letter.id, direction)}
                    onDone={() => setEditingId(null)}
                  />
                ) : (
                  <motion.button
                    key={letter.id}
                    type="button"
                    layout
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingId(letter.id)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-paper p-4 text-left shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-all duration-300 hover:-translate-y-0.5 hover:border-highlighter-yellow/60 hover:shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px]"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blush">
                      <span className="h-3 w-3 rounded-sm bg-forest-ink" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="block text-[11px] font-semibold tracking-widest font-mono text-forest-ink uppercase">
                          Open when
                        </span>
                        {letter.unlockType !== 'immediate' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2 py-0.5 text-[11px] font-semibold tracking-widest text-ink-soft uppercase">
                            {UNLOCK_META[letter.unlockType].label}
                          </span>
                        )}
                      </span>
                      <span className="block truncate font-display text-xl font-semibold tracking-tight text-ink">
                        {letter.title || 'Untitled letter'}
                      </span>
                      {letter.trigger && (
                        <span className="mt-0.5 block truncate text-xs text-ink-soft">
                          {letter.trigger}
                        </span>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors group-hover:text-forest-ink">
                      Edit
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </motion.button>
                ),
              )}

              {letters.length > 0 && (
                <button
                  type="button"
                  onClick={addLetter}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-highlighter-yellow/60 bg-paper/40 px-5 py-6 text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-ink/60 hover:bg-blush/40 hover:text-forest-ink"
                >
                  <motion.span
                    whileHover={{ rotate: 90 }}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-blush text-xl text-forest-ink"
                  >
                    +
                  </motion.span>
                  Add a letter
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Publish modal */}
      <AnimatePresence>
        {publishOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPublishOpen(false)}
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-paper p-7 shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] sm:rounded-[2rem] sm:p-9"
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
              <h2 className="mt-5 text-center font-display text-4xl font-semibold text-ink">
                Collection published
              </h2>
              <p className="mt-2 text-center text-sm text-ink-soft">
                Your letters are live. Share the link with someone special.
              </p>

              <div className="mt-7 space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
                    Public link
                  </p>
                  <div className="flex items-center gap-2 rounded-2xl border border-line bg-cream px-4 py-3">
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink-soft">
                      {publicUrl}
                    </span>
                    <CopyButton value={publicUrl} />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
                    Scan to open
                  </p>
                  <div className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
                    <QRCodeCard value={publicUrl} size={108} className="w-28 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">Share anywhere</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                        Point a camera at the code, or share the link on any app.
                      </p>
                    </div>
                    <ShareButton url={publicUrl} label="Share" variant="outline" />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
                    Your secret edit link
                  </p>
                  <div className="flex items-center gap-2 rounded-2xl border border-dashed border-highlighter-yellow/60 bg-blush/30 px-4 py-3">
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink-soft">
                      {editUrl}
                    </span>
                    <CopyButton value={editUrl} />
                  </div>
                  <p className="mt-2 text-xs text-mist">
                    Keep this safe — anyone with it can edit the collection.
                    Visitors never see it.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/open/${publishSlug}`)}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  View collection
                </Button>
                <ShareButton
                  url={publicUrl}
                  label="Share"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                />
              </div>
              <button
                type="button"
                onClick={() => setPublishOpen(false)}
                className="mt-4 w-full text-center text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                Keep editing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && collection && (
          <SettingsModal
            collection={collection}
            onChange={updateMeta}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </ThemedSurface>
  )
}
