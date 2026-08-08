import { motion } from 'framer-motion'
import type { CollectionLetter } from '@/services/types'
import { formatDate } from '@/utils/formatDate'
import { LetterCanvas } from '@/components/studio/LetterCanvas'
import { InlineText } from '@/components/studio/RichText'
import { backgroundCss, LETTER_FONT_FAMILY } from '@/data/letterStudio'
import { parseBody } from '@/utils/markup'
import { EASE } from '@/utils/anim'
import { cn } from '@/utils/cn'

interface LetterViewProps {
  letter: CollectionLetter
}

/**
 * The hero of the reading experience: a real sheet of paper.
 *
 * - A4 proportions (210:297) as a minimum so short letters still read as a
 *   full page — the sheet grows taller when a letter is longer, so nothing
 *   is ever clipped.
 * - Minimal corner radius, warm paper texture and a layered, physical shadow.
 * - Generous margins, comfortable line height and paragraph spacing.
 * - A long blank tail so the letter never stops abruptly — it feels like a
 *   printed page with room left on the sheet.
 * - Stickers and photos are preserved exactly as the writer arranged them.
 */
export function LetterView({ letter }: LetterViewProps) {
  const blocks = parseBody(letter.body)
  const letterFontStyle = { fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic' }
  const hasBackground = Boolean(backgroundCss(letter.background))

  return (
    <div className="relative mx-auto w-full max-w-[520px] px-4 sm:max-w-[640px] sm:px-6 lg:max-w-[820px]">
      <div className="relative w-full">
        {/* in-flow spacer that reserves one full A4 page; the sheet paints
            over it and grows taller if the letter's content needs more room */}
        <div aria-hidden className="w-full" style={{ aspectRatio: '210 / 297' }} />
        <motion.article
          initial={{ opacity: 0, y: 44, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="letter-sheet absolute inset-x-0 top-0 min-h-full w-full overflow-hidden rounded-sm"
        >
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
            <LetterCanvas stickers={letter.stickers} photos={letter.photos} readOnly />

            <div style={letterFontStyle}>
              <div className="text-center">
                <p className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
                  Open when
                </p>
                <h1
                  style={letterFontStyle}
                  className="mt-8 font-display text-3xl leading-tight font-semibold text-ink sm:mt-10 sm:text-5xl"
                >
                  {letter.title}
                </h1>
                <p className="mt-3 font-mono text-xs tracking-wide text-mist">
                  Sealed on {formatDate(letter.createdAt)}
                </p>
              </div>

              <div className="mx-auto my-8 flex max-w-xs items-center gap-4 sm:my-10" aria-hidden>
                <span className="h-px flex-1 bg-line/70" />
                <span className="text-forest-ink">♥</span>
                <span className="h-px flex-1 bg-line/70" />
              </div>

              <div className="space-y-7 sm:space-y-9">
                {blocks.map((block, index) => {
                  const delay = 0.3 + index * 0.12
                  if (block.type === 'divider') {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay, ease: EASE }}
                        className="mx-auto flex items-center gap-4"
                        aria-hidden
                      >
                        <span className="h-px flex-1 bg-line/70" />
                        <span className="text-forest-ink">♥</span>
                        <span className="h-px flex-1 bg-line/70" />
                      </motion.div>
                    )
                  }
                  if (block.type === 'heading') {
                    return (
                      <motion.h2
                        key={index}
                        style={letterFontStyle}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay, ease: EASE }}
                        className="font-display text-2xl leading-snug font-semibold tracking-tight text-ink sm:text-[28px]"
                      >
                        <InlineText segments={block.segments} />
                      </motion.h2>
                    )
                  }
                  return (
                    <motion.p
                      key={index}
                      style={letterFontStyle}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay, ease: EASE }}
                      className="font-display text-[15px] leading-[1.9] whitespace-pre-line text-ink/90 sm:text-[17px] sm:leading-[1.95]"
                    >
                      <InlineText segments={block.segments} />
                    </motion.p>
                  )
                })}
              </div>

              {/* closing space — generous blank paper below the last line so the
                  letter feels signed, finished and left with room to breathe */}
              <div aria-hidden className="mt-20 flex flex-col items-center gap-3 sm:mt-28">
                <span className="text-forest-ink">♥</span>
                <span className="h-px w-10 bg-line/60" />
              </div>
              <div aria-hidden className="h-16 sm:h-24" />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}
