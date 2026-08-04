import { DEFAULT_FONT_ID, LETTER_FONTS } from '@/data/letterStudio'
import { cn } from '@/utils/cn'

interface FontSelectorProps {
  value: string
  onChange: (fontId: string) => void
}

/** The curated letter font picker (up to 8 fonts). Applies to letter content only. */
export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        type="button"
        onClick={() => onChange(DEFAULT_FONT_ID)}
        aria-pressed={value === DEFAULT_FONT_ID}
        className={cn(
          'flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all duration-200',
          value === DEFAULT_FONT_ID
            ? 'border-ink bg-paper shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
            : 'border-line bg-paper/60 hover:border-highlighter-yellow',
        )}
      >
        <span className="font-display text-base font-semibold text-ink">Aa</span>
        <span className="text-xs font-medium text-ink">Default</span>
        <span className="text-[11px] text-mist">Current look</span>
      </button>

      {LETTER_FONTS.map((font) => {
        const active = value === font.id
        return (
          <button
            key={font.id}
            type="button"
            onClick={() => onChange(font.id)}
            aria-pressed={active}
            title={font.vibe}
            className={cn(
              'flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all duration-200',
              active
                ? 'border-ink bg-paper shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'border-line bg-paper/60 hover:border-highlighter-yellow',
            )}
          >
            <span className="text-base leading-tight text-ink" style={{ fontFamily: font.family }}>
              Aa
            </span>
            <span className="text-xs font-medium text-ink">{font.label}</span>
            <span className="text-[11px] text-mist">{font.vibe}</span>
          </button>
        )
      })}
    </div>
  )
}
