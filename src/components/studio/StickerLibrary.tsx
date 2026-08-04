import { useState } from 'react'
import { MAX_STICKERS, STICKER_CATEGORIES } from '@/data/letterStudio'
import { cn } from '@/utils/cn'

interface StickerLibraryProps {
  count: number
  onAdd: (emoji: string) => void
}

/** Curated sticker library (12 categories, emoji-based). */
export function StickerLibrary({ count, onAdd }: StickerLibraryProps) {
  const [categoryId, setCategoryId] = useState(STICKER_CATEGORIES[0].id)
  const category = STICKER_CATEGORIES.find((item) => item.id === categoryId) ?? STICKER_CATEGORIES[0]
  const full = count >= MAX_STICKERS

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2">
        {STICKER_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategoryId(item.id)}
            aria-pressed={categoryId === item.id}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              categoryId === item.id
                ? 'border-ink bg-paper text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'border-line bg-paper/60 text-ink-soft hover:border-highlighter-yellow',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8">
        {category.emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onAdd(emoji)}
            disabled={full}
            aria-label={`Add ${emoji} sticker`}
            className="grid h-11 place-items-center rounded-lg border border-line bg-paper/60 text-xl transition-all duration-150 hover:-translate-y-0.5 hover:border-highlighter-yellow hover:shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] disabled:pointer-events-none disabled:opacity-40"
          >
            {emoji}
          </button>
        ))}
      </div>

      <p className={cn('mt-2 text-xs', full ? 'font-medium text-terracotta' : 'text-mist')}>
        {full
          ? `You've added the maximum ${MAX_STICKERS} stickers. Remove one to add another.`
          : `Tap a sticker to place it on the letter · ${count}/${MAX_STICKERS} used`}
      </p>
    </div>
  )
}
