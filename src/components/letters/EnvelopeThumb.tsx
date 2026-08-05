import { LETTER_FONT_FAMILY } from '@/data/letterStudio'
import { cn } from '@/utils/cn'

interface EnvelopeThumbProps {
  cover: number
  locked: boolean
  className?: string
  /** The letter title, printed over the front pocket beneath "Open When". */
  label?: string
  /** Drop the ground + drop shadows for flat, shadow-free covers. */
  shadow?: boolean
}

/**
 * A miniature replica of the reading envelope (the sealed, idle state of
 * EnvelopeScene): the same kraft gradient, grain, rounding, deep shadow, wax
 * seal and lighting sweep, scaled down for covers and collection cards.
 */
export function EnvelopeThumb({
  cover: _cover,
  locked: _locked,
  className,
  label,
  shadow = true,
}: EnvelopeThumbProps) {
  return (
    <div className={cn('relative aspect-[10/7] w-full select-none', className)}>
      {/* ground shadow that gives the envelope its dimensional read */}
      {shadow && (
        <div
          aria-hidden
          className="absolute -bottom-9 left-1/2 h-6 w-[88%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl"
        />
      )}

      <div className="relative aspect-[10/7] w-full">
        {/* back panel — kraft paper */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl',
            shadow && 'shadow-[0_28px_56px_-20px_rgba(0,0,0,0.55)]',
          )}
          style={{
            background:
              'linear-gradient(155deg, var(--color-kraft) 0%, var(--color-kraft-deep) 55%, var(--color-kraft-dark) 100%)',
          }}
        />
        <div className="kraft-grain absolute inset-0 rounded-xl" aria-hidden />

        {/* front pocket with fold lines */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 h-[56%]"
          style={{
            background:
              'linear-gradient(180deg, var(--color-kraft-deep) 0%, var(--color-kraft-dark) 100%)',
          }}
        >
          <svg
            viewBox="0 0 320 148"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden
          >
            <path
              d="M14 142 L160 54 L306 142"
              fill="none"
              stroke="rgba(74,52,20,0.28)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* letter title printed over the pocket, below the fold lines */}
          {label && (
            <div className="pointer-events-none absolute inset-x-[8%] top-[10%] bottom-[8%] flex flex-col items-center justify-center">
              <span className="font-mono text-[8px] font-semibold tracking-[0.14em] text-[#4a3414]/70 uppercase">
                Open When
              </span>
              <span
                className="mt-0.5 line-clamp-2 text-center text-[18px] leading-snug text-[#4a3414]"
                style={{ fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic' }}
              >
                {label}
              </span>
            </div>
          )}
        </div>

        {/* flap — sealed */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[54%]">
          <div
            className="relative h-full w-full rounded-t-xl"
            style={{
              background:
                'linear-gradient(180deg, var(--color-kraft) 0%, var(--color-kraft-deep) 100%)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          >
            <div className="kraft-grain absolute inset-0" aria-hidden />
            {/* heart wax seal */}
            <span
              aria-hidden
              className="absolute top-[56%] left-1/2 grid aspect-square w-[12%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-3px_6px_rgba(0,0,0,0.28),0_2px_6px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-terracotta) 0%, #a84317 100%)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-[48%] w-[48%] text-cream-paper/90" aria-hidden>
                <path
                  d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* lighting sweep — makes the kraft read as dimensional */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-50 rounded-xl"
          style={{
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 34%, rgba(90,60,25,0.08) 80%, rgba(90,60,25,0.2) 100%)',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(74,52,20,0.18)',
          }}
        />
      </div>
    </div>
  )
}
