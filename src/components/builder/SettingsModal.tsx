import { useState } from 'react'
import type { Collection } from '@/services/types'
import type { CollectionUpdate } from '@/services/collectionService'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { hashPassword } from '@/utils/password'
import { cn } from '@/utils/cn'

interface SettingsModalProps {
  collection: Collection
  onChange: (patch: CollectionUpdate) => void
  onClose: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold tracking-widest text-forest-ink uppercase font-mono">
      {children}
    </p>
  )
}

export function SettingsModal({ collection, onChange, onClose }: SettingsModalProps) {
  const [password, setPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const applyPassword = async () => {
    if (savingPassword) return
    setSavingPassword(true)
    const digest = await hashPassword(password)
    setSavingPassword(false)
    onChange({ passwordHash: digest })
    setPassword('')
  }

  const removePassword = () => {
    onChange({ passwordHash: '' })
    setPassword('')
  }

  return (
    <Modal title="Collection settings" onClose={onClose}>
      <div className="flex flex-col gap-9">
        {/* Visibility */}
        <section>
          <SectionLabel>Visibility</SectionLabel>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChange({ visibility: 'public' })}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 min-h-11',
                collection.visibility === 'public'
                  ? 'border-ink bg-paper text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                  : 'border-line bg-paper/60 text-ink-soft hover:border-highlighter-yellow',
              )}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => onChange({ visibility: 'unlisted' })}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 min-h-11',
                collection.visibility === 'unlisted'
                  ? 'border-ink bg-paper text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                  : 'border-line bg-paper/60 text-ink-soft hover:border-highlighter-yellow',
              )}
            >
              Unlisted
            </button>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-mist">
            {collection.visibility === 'unlisted'
              ? 'Hidden from future listing pages. Only people with the link can find it.'
              : 'Anyone with the link can open it. (Every collection is shared by link.)'}
          </p>
        </section>

        {/* Password */}
        <section>
          <SectionLabel>Secret password</SectionLabel>
          {collection.passwordHash ? (
            <div className="rounded-xl border border-dashed border-pencil-gray bg-blush/30 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                A password is protecting this collection
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="New password (optional)"
                  className="min-w-0 flex-1 rounded-md border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-mist focus:border-highlighter-yellow"
                />
                <div className="flex gap-2">
                  <Button
                    size="md"
                    onClick={applyPassword}
                    disabled={!password || savingPassword}
                  >
                    {savingPassword ? 'Saving…' : 'Change'}
                  </Button>
                  <Button size="md" variant="ghost" onClick={removePassword}>
                    Remove
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-mist">
                Visitors must enter this password before reading any letter.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Set a password for the collection…"
                className="min-w-0 flex-1 rounded-md border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-mist focus:border-highlighter-yellow"
              />
              <Button
                size="md"
                onClick={applyPassword}
                disabled={!password || savingPassword}
              >
                {savingPassword ? 'Saving…' : 'Add password'}
              </Button>
            </div>
          )}
        </section>

        <Button size="lg" className="w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  )
}
