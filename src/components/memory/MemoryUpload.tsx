import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '@/utils/anim'
import { compressMemoryImage, isMemoryImage } from '@/utils/imageCompress'
import { removeMemoryImage, uploadMemoryImage } from '@/services/memoryStorage'

interface MemoryUploadProps {
  /** Current memory image URL ('' when none is set). */
  value: string
  /** Called with the new URL, or '' when the memory is removed. */
  onChange: (url: string) => void
  /** Letter id used for the storage path. */
  letterId: string
}

type Status = 'idle' | 'uploading' | 'error'

/**
 * "The Memory" uploader for the letter builder.
 * One optional photo per letter: click or drag & drop to add, large images are
 * compressed before upload, and the photo can be replaced or removed.
 */
export function MemoryUpload({ value, onChange, letterId }: MemoryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      if (!isMemoryImage(file)) {
        setStatus('error')
        return
      }
      setStatus('uploading')
      try {
        const compressed = await compressMemoryImage(file)
        const previousUrl = value
        const url = await uploadMemoryImage(compressed, letterId)
        onChange(url)
        setStatus('idle')
        if (previousUrl && previousUrl !== url) {
          removeMemoryImage(previousUrl).catch(() => {})
        }
      } catch {
        setStatus('error')
      }
    },
    [onChange, letterId, value],
  )

  const remove = useCallback(() => {
    if (value) removeMemoryImage(value).catch(() => {})
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }, [onChange, value])

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="rounded-2xl border border-line bg-paper p-3 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-cream">
              <img
                src={value}
                alt="Memory preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="min-w-0 flex-1 truncate text-xs font-medium text-ink-soft">
                This photo will appear at the end of the letter
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-highlighter-yellow"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={remove}
                  className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-highlighter-yellow"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragOver(false)
              handleFile(event.dataTransfer.files?.[0])
            }}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-paper/50 px-6 py-8 text-center transition-colors duration-200 ${
              dragOver
                ? 'border-highlighter-yellow bg-blush/40'
                : 'border-line hover:border-highlighter-yellow'
            }`}
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blush">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-forest-ink" aria-hidden>
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M4.5 17.5l4.5-4 3 3 4-4 3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm font-medium text-ink">
              {status === 'uploading' ? 'Preparing your memory…' : 'Add one special photo'}
            </span>
            <span className="text-xs leading-relaxed text-mist">
              Click to upload, or drag &amp; drop · JPG, PNG or WebP
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {status === 'uploading' && (
        <p className="mt-2 flex items-center gap-2 text-xs font-medium text-ink-soft">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-ink" />
          Uploading and compressing…
        </p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs font-medium text-terracotta">
          That file couldn't be used. Please try a JPG, PNG or WebP image.
        </p>
      )}
    </div>
  )
}
