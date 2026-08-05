import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Field } from '@/components/create/Field'
import { SchedulePicker } from '@/components/builder/SchedulePicker'
import { RichTextToolbar } from '@/components/studio/RichTextToolbar'
import { LetterToolbar } from '@/components/studio/LetterToolbar'
import { LetterPreview } from '@/components/studio/LetterPreview'
import { LETTER_FONT_FAMILY } from '@/data/letterStudio'
import type { CollectionLetter } from '@/services/types'
import type { LetterUpdate } from '@/services/letterService'
import { EASE } from '@/utils/anim'

interface LetterEditorProps {
  letter: CollectionLetter
  index: number
  total: number
  onChange: (patch: Partial<LetterUpdate>) => void
  onDelete: () => void
  onMove: (direction: -1 | 1) => void
  onDone: () => void
}

const inputClass =
  'w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] outline-none transition-colors duration-200 placeholder:text-mist focus:border-highlighter-yellow'

export function LetterEditor({
  letter,
  index,
  total,
  onChange,
  onDelete,
  onMove,
  onDone,
}: LetterEditorProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const letterFontStyle = { fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic' }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="rounded-xl border border-highlighter-yellow/50 bg-paper p-5 shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
          {letter.title?.trim() ? `"${letter.title.trim()}"` : 'New letter'}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move up"
            className="grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M12 19V5M6 11l6-6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="Move down"
            className="grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M12 5v14M6 13l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete letter"
            className="grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush hover:text-forest-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M6 7h12M9 7V5h6v2m-8 0l1 12h8l1-12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <Field label="Open when…">
          <input
            type="text"
            value={letter.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="You miss me"
            maxLength={60}
            className={inputClass}
          />
        </Field>

        <Field label="When does it open">
          <SchedulePicker
            value={{ type: letter.unlockType, date: letter.unlockAt }}
            onChange={({ type, date }) => onChange({ unlockType: type, unlockAt: date })}
          />
        </Field>

        <Field label="The letter">
          <div className="space-y-2">
            <RichTextToolbar textareaRef={bodyRef} onChange={(body) => onChange({ body })} />
            <textarea
              ref={bodyRef}
              value={letter.body}
              onChange={(event) => onChange({ body: event.target.value })}
              placeholder={'Dear love,\n\nIf you\'re reading this, the moment I wrote for has arrived…'}
              rows={9}
              style={letterFontStyle}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>
        </Field>

        <div className="border-t border-dashed border-line pt-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm font-medium tracking-tight text-ink">
              Letter studio
            </span>
            <span className="text-xs text-mist">Background, font, stickers, photos &amp; music</span>
          </div>
          <LetterToolbar letter={letter} onChange={onChange} />
        </div>

        <div>
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-sm font-medium tracking-tight text-ink">
              Preview
            </span>
            <span className="text-xs text-mist">Drag the stickers &amp; photos to arrange them</span>
          </div>
          <LetterPreview letter={letter} onChange={onChange} />
        </div>
      </div>

      <div className="mt-6 flex justify-center border-t border-dashed border-line pt-6">
        <button
          type="button"
          onClick={onDone}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-forest-ink px-10 text-base font-semibold tracking-tight text-cream-paper transition-colors hover:opacity-90"
        >
          Done
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M5 12l5 5L20 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
