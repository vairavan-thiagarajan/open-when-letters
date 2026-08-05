import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AudioAttachment } from './AudioAttachment'
import { LetterCanvas, type DecorSelection } from './LetterCanvas'
import { RichText } from './RichText'
import { backgroundCss, LETTER_FONT_FAMILY } from '@/data/letterStudio'
import { EASE } from '@/utils/anim'
import { cn } from '@/utils/cn'
import type {
  CollectionLetter,
  PhotoItem,
  PhotoStyle,
  StickerItem,
} from '@/services/types'
import type { LetterUpdate } from '@/services/letterService'

interface LetterPreviewProps {
  letter: CollectionLetter
  onChange: (patch: Partial<LetterUpdate>) => void
}

interface DecorSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (value: number) => void
}

function DecorSlider({ label, value, min, max, step, display, onChange }: DecorSliderProps) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-ink">
      <span className="w-12 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-24 cursor-pointer accent-forest-ink sm:w-32"
      />
      <span className="w-10 shrink-0 text-right tabular-nums text-mist">{display}</span>
    </label>
  )
}

const PHOTO_STYLES: { id: PhotoStyle; label: string }[] = [
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'taped', label: 'Taped' },
  { id: 'rounded', label: 'Rounded' },
]

/**
 * Live paper preview inside the editor. Shows the background, font, body,
 * audio and the decorations layer — stickers & photos are draggable
 * here, and the selected item gets size / rotate / style / delete controls.
 */
export function LetterPreview({ letter, onChange }: LetterPreviewProps) {
  const [selection, setSelection] = useState<DecorSelection | null>(null)

  const letterFontStyle = { fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic' }
  const hasBackground = Boolean(backgroundCss(letter.background))

  const selectedSticker =
    selection?.kind === 'sticker'
      ? letter.stickers.find((item) => item.id === selection.id)
      : undefined
  const selectedPhoto =
    selection?.kind === 'photo'
      ? letter.photos.find((item) => item.id === selection.id)
      : undefined

  const updateSticker = (id: string, patch: Partial<StickerItem>) => {
    onChange({
      stickers: letter.stickers.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })
  }

  const deleteSticker = (id: string) => {
    onChange({ stickers: letter.stickers.filter((item) => item.id !== id) })
    setSelection(null)
  }

  const updatePhoto = (id: string, patch: Partial<PhotoItem>) => {
    onChange({
      photos: letter.photos.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })
  }

  const deletePhoto = (id: string) => {
    onChange({ photos: letter.photos.filter((item) => item.id !== id) })
    setSelection(null)
  }

  return (
    <div>
      <div className="letter-sheet relative aspect-[210/297] w-full overflow-hidden rounded-sm">
        {hasBackground && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: backgroundCss(letter.background) }}
          />
        )}
        <div
          aria-hidden
          className={cn(
            'paper-grain absolute inset-0',
            hasBackground ? 'bg-paper/80 backdrop-blur-[2px]' : 'bg-paper/60',
          )}
        />

        {/* faint fold crease near the top of the sheet */}
        <span aria-hidden className="absolute inset-x-6 top-[9%] h-px bg-ink/5" />

        <div className="relative px-7 py-12 sm:px-16 sm:py-16 lg:px-20">
          <LetterCanvas
            stickers={letter.stickers}
            photos={letter.photos}
            selected={selection}
            onSelect={setSelection}
            onChange={({ stickers, photos }) => onChange({ stickers, photos })}
          />

          <div className="pointer-events-none relative select-none">
            <div className="text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
                Open when
              </p>
            </div>

            <div style={letterFontStyle}>
              <h2
                style={letterFontStyle}
                className="mt-8 text-center font-display text-3xl leading-tight font-semibold text-ink sm:mt-10 sm:text-5xl"
              >
                {letter.title || 'Untitled letter'}
              </h2>

              <div className="mx-auto my-8 flex max-w-xs items-center gap-4 sm:my-10" aria-hidden>
                <span className="h-px flex-1 bg-line/70" />
                <span className="text-forest-ink">♥</span>
                <span className="h-px flex-1 bg-line/70" />
              </div>

              <RichText body={letter.body} fontFamily={LETTER_FONT_FAMILY} />
            </div>
          </div>

          {letter.audioUrl && (
            <div className="pointer-events-auto relative mt-8">
              <AudioAttachment value={letter.audioUrl} letterId={letter.id} />
            </div>
          )}

          {/* closing space — mirrors the reader's blank tail */}
          <div aria-hidden className="pointer-events-none mt-20 flex flex-col items-center gap-3 sm:mt-28">
            <span className="text-forest-ink">♥</span>
            <span className="h-px w-10 bg-line/60" />
          </div>
          <div aria-hidden className="pointer-events-none h-16 sm:h-24" />
        </div>
      </div>

      <AnimatePresence>
        {(selectedSticker || selectedPhoto) && (
          <motion.div
            key="decor-controls"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mt-3 rounded-2xl border border-line bg-paper p-4 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
                {selectedSticker ? 'Selected sticker' : 'Selected photo'}
              </span>

              {selectedSticker && (
                <DecorSlider
                  label="Size"
                  value={selectedSticker.scale}
                  min={0.5}
                  max={2}
                  step={0.05}
                  display={`${Math.round(selectedSticker.scale * 100)}%`}
                  onChange={(scale) => updateSticker(selectedSticker.id, { scale })}
                />
              )}
              {selectedSticker && (
                <DecorSlider
                  label="Tilt"
                  value={selectedSticker.rotation}
                  min={-180}
                  max={180}
                  step={1}
                  display={`${Math.round(selectedSticker.rotation)}°`}
                  onChange={(rotation) => updateSticker(selectedSticker.id, { rotation })}
                />
              )}

              {selectedPhoto && (
                <DecorSlider
                  label="Size"
                  value={selectedPhoto.scale}
                  min={0.5}
                  max={1.6}
                  step={0.05}
                  display={`${Math.round(selectedPhoto.scale * 100)}%`}
                  onChange={(scale) => updatePhoto(selectedPhoto.id, { scale })}
                />
              )}
              {selectedPhoto && (
                <DecorSlider
                  label="Tilt"
                  value={selectedPhoto.rotation}
                  min={-180}
                  max={180}
                  step={1}
                  display={`${Math.round(selectedPhoto.rotation)}°`}
                  onChange={(rotation) => updatePhoto(selectedPhoto.id, { rotation })}
                />
              )}

              {selectedPhoto && (
                <div className="flex items-center gap-1.5">
                  {PHOTO_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => updatePhoto(selectedPhoto.id, { style: style.id })}
                      aria-pressed={selectedPhoto.style === style.id}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        selectedPhoto.style === style.id
                          ? 'border-ink bg-paper text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                          : 'border-line bg-paper/60 text-ink-soft hover:border-highlighter-yellow',
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  selectedSticker
                    ? deleteSticker(selectedSticker.id)
                    : selectedPhoto
                      ? deletePhoto(selectedPhoto.id)
                      : undefined
                }
                className="rounded-full px-3 py-1.5 text-xs font-medium text-terracotta transition-colors hover:bg-blush"
              >
                Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
