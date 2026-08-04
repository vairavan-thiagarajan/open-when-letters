import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AudioAttachment } from './AudioAttachment'
import { BackgroundPicker } from './BackgroundPicker'
import { FontSelector } from './FontSelector'
import { StickerLibrary } from './StickerLibrary'
import { MAX_PHOTOS, MAX_STICKERS, nextDecorPosition } from '@/data/letterStudio'
import { compressImage, isImageFile } from '@/utils/imageCompress'
import { uploadDecorImage } from '@/services/letterDecorStorage'
import { EASE } from '@/utils/anim'
import type { CollectionLetter, PhotoItem, StickerItem } from '@/services/types'
import type { LetterUpdate } from '@/services/letterService'

interface LetterToolbarProps {
  letter: CollectionLetter
  onChange: (patch: Partial<LetterUpdate>) => void
}

type SectionId = 'background' | 'font' | 'stickers' | 'photos' | 'audio'

interface SectionProps {
  id: SectionId
  label: string
  hint?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

function Section({ id, label, hint, open, onToggle, children }: SectionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`studio-section-${id}`}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-paper"
      >
        <span className="text-sm font-medium tracking-tight text-ink">{label}</span>
        <span className="flex shrink-0 items-center gap-2">
          {hint && <span className="text-xs text-mist">{hint}</span>}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="grid h-6 w-6 place-items-center rounded-full bg-blush text-forest-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`studio-section-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-2 pt-1 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * The Letter Studio toolbar: Background, Letter font, Stickers, Photos and
 * Music for this letter. Composes the individual pickers into the existing
 * letter editor.
 */
export function LetterToolbar({ letter, onChange }: LetterToolbarProps) {
  const [openIds, setOpenIds] = useState<Set<SectionId>>(
    () => new Set(['background', 'font', 'stickers', 'photos', 'audio']),
  )
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'uploading' | 'error'>('idle')

  const toggle = (id: SectionId) =>
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const addSticker = (emoji: string) => {
    if (letter.stickers.length >= MAX_STICKERS) return
    const pos = nextDecorPosition(letter.stickers.length)
    const sticker: StickerItem = {
      id: crypto.randomUUID(),
      emoji,
      x: pos.x,
      y: pos.y,
      scale: 1,
      rotation: pos.rotation,
    }
    onChange({ stickers: [...letter.stickers, sticker] })
  }

  const addPhoto = async (file: File | undefined) => {
    if (!file) return
    if (letter.photos.length >= MAX_PHOTOS) return
    if (!isImageFile(file)) {
      setPhotoStatus('error')
      return
    }
    setPhotoStatus('uploading')
    try {
      const compressed = await compressImage(file)
      const url = await uploadDecorImage(compressed, letter.id, 'photo')
      const pos = nextDecorPosition(letter.photos.length)
      const photo: PhotoItem = {
        id: crypto.randomUUID(),
        url,
        x: pos.x,
        y: pos.y,
        scale: 1,
        rotation: pos.rotation,
        style: 'polaroid',
      }
      onChange({ photos: [...letter.photos, photo] })
      setPhotoStatus('idle')
    } catch {
      setPhotoStatus('error')
    }
  }

  const photosFull = letter.photos.length >= MAX_PHOTOS

  return (
    <div className="rounded-xl border border-line bg-paper/60 p-2 sm:p-3">
      <Section
        id="background"
        label="Background"
        hint="Behind the paper"
        open={openIds.has('background')}
        onToggle={() => toggle('background')}
      >
        <BackgroundPicker
          value={letter.background}
          letterId={letter.id}
          onChange={(background) => onChange({ background })}
        />
      </Section>

      <Section
        id="font"
        label="Letter font"
        hint="For the writing"
        open={openIds.has('font')}
        onToggle={() => toggle('font')}
      >
        <FontSelector value={letter.font} onChange={(font) => onChange({ font })} />
      </Section>

      <Section
        id="stickers"
        label="Stickers"
        hint={`${letter.stickers.length} placed`}
        open={openIds.has('stickers')}
        onToggle={() => toggle('stickers')}
      >
        <StickerLibrary count={letter.stickers.length} onAdd={addSticker} />
      </Section>

      <Section
        id="photos"
        label="Photos"
        hint={`${letter.photos.length}/${MAX_PHOTOS}`}
        open={openIds.has('photos')}
        onToggle={() => toggle('photos')}
      >
        <div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => addPhoto(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={photosFull || photoStatus === 'uploading'}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-highlighter-yellow/60 bg-paper/40 px-5 py-6 text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-ink/60 hover:bg-blush/40 hover:text-forest-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blush text-xl text-forest-ink">
              +
            </span>
            <span className="text-sm font-medium">
              {photoStatus === 'uploading' ? 'Adding photo…' : 'Add a decorative photo'}
            </span>
          </button>
          <p className="mt-2 text-xs leading-relaxed text-mist">
            {photosFull
              ? `You've added the maximum ${MAX_PHOTOS} decorative photos.`
              : 'Add up to 6 photos, then drag, resize, rotate and pick a frame in the preview.'}
          </p>
          {photoStatus === 'error' && (
            <p className="mt-1 text-xs font-medium text-terracotta">
              That file couldn't be used. Please try a JPG, PNG or WebP image.
            </p>
          )}
        </div>
      </Section>

      <Section
        id="audio"
        label="Music for this letter"
        hint={letter.audioUrl ? 'Added' : 'Optional'}
        open={openIds.has('audio')}
        onToggle={() => toggle('audio')}
      >
        <AudioAttachment
          value={letter.audioUrl}
          letterId={letter.id}
          onChange={(audioUrl) => onChange({ audioUrl })}
        />
      </Section>
    </div>
  )
}
