import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/create/Field'
import { collectionService } from '@/services/collectionService'
import { useToast } from '@/components/ui/toastContext'
import { useUser } from '@/context/authContext'
import { usePageMeta } from '@/utils/meta'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

const inputClass = (invalid?: boolean) =>
  cn(
    'w-full rounded-2xl border bg-paper px-4 py-3 text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] outline-none transition-colors duration-200 placeholder:text-mist',
    invalid ? 'border-forest-ink/70 ring-2 ring-highlighter-yellow/50' : 'border-line focus:border-highlighter-yellow',
  )

export function CreateCollectionPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const user = useUser()

  usePageMeta({
    title: 'Create a collection · Open When Letters',
    description:
      'Start a gift of letters for one person, ready for every moment that has not happened yet.',
    path: '/create',
    noindex: true,
  })

  const [title, setTitle] = useState('')
  const [from, setFrom] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Give your collection a name.')
      return
    }

    setCreating(true)
    try {
      const collection = await collectionService.create({
        title: title.trim(),
        from: from.trim(),
        description: description.trim(),
        coverImage: 0,
        theme: 'say-briefly',
        userId: user?.id ?? null,
      })
      navigate(`/edit/${collection.editToken}`)
    } catch (err) {
      setCreating(false)
      toast(err instanceof Error ? err.message : 'Could not create the collection')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-forest-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                <path
                  d="M19 12H5M11 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="text-center"
          >
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block h-1.5 w-1.5 rounded-full bg-highlighter-yellow"
            />
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Create a collection
            </h1>
            <p className="mt-3 text-ink-soft">
              A gift of letters for one person, ready for every moment that
              hasn't happened yet.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
            className="mt-10 rounded-[2rem] border border-line bg-cream/60 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-6">
              <Field label="Collection title" hint="Shown on every page" error={error ?? undefined}>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    setError(null)
                  }}
                  placeholder="For the love of my life"
                  maxLength={80}
                  className={inputClass(!!error)}
                  autoFocus
                />
              </Field>

              <Field label="From" hint="Shown as the signature on the collection page">
                <input
                  type="text"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  placeholder="Your name, or whoever the letters are from"
                  maxLength={60}
                  className={inputClass()}
                />
              </Field>

              <Field label="A short description" hint="Optional">
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Little letters for the big moments. Open them when the time is right."
                  rows={3}
                  maxLength={240}
                  className={`${inputClass()} resize-none leading-relaxed`}
                />
              </Field>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-8 flex justify-end"
          >
            <Button
              size="lg"
              onClick={handleCreate}
              disabled={creating}
              className="min-w-[220px]"
            >
              {creating ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent"
                  />
                  Creating…
                </>
              ) : (
                <>
                  Continue to your letters <span className="text-lg leading-none">→</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
