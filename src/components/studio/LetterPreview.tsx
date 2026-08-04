import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AudioAttachment } from './AudioAttachment'
import { LetterCanvas, type DecorSelection } from './LetterCanvas'
import { RichText } from './RichText'
import { backgroundCss, letterFontById } from '@/data/letterStudio'
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

  const font = letterFontById(letter.font)
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
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-paper shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px]">
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
            'absolute inset-0',
            hasBackground ? 'paper-grain bg-paper/85 backdrop-blur-[2px]' : 'bg-paper',
          )}
        />

        <div className="relative px-5 py-8 sm:px-10">
          <LetterCanvas
            stickers={letter.stickers}
            photos={letter.photos}
            selected={selection}
            onSelect={setSelection}
            onChange={({ stickers, photos }) => onChange({ stickers, photos })}
          />

          <div className="pointer-events-none relative select-none">
            <div className="text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-blush px-3 py-1 text-[10px] font-semibold tracking-widest font-mono text-forest-ink uppercase">
                Open when
              </p>
            </div>

            <div style={font ? { fontFamily: font.family } : undefined}>
              <h2
                style={font ? { fontFamily: font.family } : undefined}
                className="mt-3 text-center font-display text-lg leading-tight font-semibold text-ink sm:text-2xl"
              >
                {letter.title || 'Untitled letter'}
              </h2>
              {letter.trigger && (
                <p className="mt-2 text-center text-xs text-mist">{letter.trigger}</p>
              )}

              <div className="mx-auto my-5 flex items-center gap-4" aria-hidden>
                <span className="h-px flex-1 bg-line" />
                <span className="text-forest-ink">♥</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <div className="space-y-5">
                <RichText body={letter.body} fontFamily={font?.family} />
              </div>
            </div>
          </div>

          {letter.audioUrl && (
            <div className="pointer-events-auto relative mt-5">
              <AudioAttachment value={letter.audioUrl} letterId={letter.id} />
            </div>
          )}
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
