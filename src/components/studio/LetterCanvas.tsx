import { PhotoFrame } from './PhotoFrame'
import { MovableDecor } from './MovableDecor'
import type { PhotoItem, StickerItem } from '@/services/types'
import { cn } from '@/utils/cn'

export interface DecorSelection {
  kind: 'sticker' | 'photo'
  id: string
}

interface LetterCanvasProps {
  stickers: StickerItem[]
  photos: PhotoItem[]
  /** When true the layer is purely visual (used by the reader). */
  readOnly?: boolean
  onChange?: (patch: { stickers: StickerItem[]; photos: PhotoItem[] }) => void
  onSelect?: (selection: DecorSelection | null) => void
  selected?: DecorSelection | null
}

/**
 * The decoration layer of a letter paper. Interactive in the editor
 * (drag / resize / rotate / delete) and static in the reader.
 */
export function LetterCanvas({
  stickers,
  photos,
  readOnly = false,
  onChange,
  onSelect,
  selected,
}: LetterCanvasProps) {
  const handleEmptyClick = (event: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly || !onSelect) return
    if (event.target === event.currentTarget) onSelect(null)
  }

  const patchSticker = (id: string, patch: Partial<StickerItem>) => {
    onChange?.({
      stickers: stickers.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
      photos,
    })
  }

  const patchPhoto = (id: string, patch: Partial<PhotoItem>) => {
    onChange?.({
      stickers,
      photos: photos.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })
  }

  return (
    <div
      className={cn('absolute inset-0', readOnly ? 'pointer-events-none' : '')}
      onPointerDown={handleEmptyClick}
    >
      {stickers.map((item) => {
        const isSelected =
          !readOnly && selected?.kind === 'sticker' && selected.id === item.id
        return (
          <MovableDecor
            key={item.id}
            x={item.x}
            y={item.y}
            rotation={item.rotation}
            scale={item.scale}
            readOnly={readOnly}
            onCommit={onChange ? (patch) => patchSticker(item.id, patch) : undefined}
            onSelect={onSelect ? () => onSelect({ kind: 'sticker', id: item.id }) : undefined}
            selected={isSelected}
          >
            <span
              className={cn(
                'block rounded-xl leading-none',
                isSelected &&
                  'ring-2 ring-forest-ink/50 ring-offset-2 ring-offset-paper',
              )}
            >
              <span className="block text-4xl leading-none drop-shadow-sm select-none">
                {item.emoji}
              </span>
            </span>
          </MovableDecor>
        )
      })}

      {photos.map((item) => {
        const isSelected =
          !readOnly && selected?.kind === 'photo' && selected.id === item.id
        return (
          <MovableDecor
            key={item.id}
            x={item.x}
            y={item.y}
            rotation={item.rotation}
            scale={item.scale}
            readOnly={readOnly}
            onCommit={onChange ? (patch) => patchPhoto(item.id, patch) : undefined}
            onSelect={onSelect ? () => onSelect({ kind: 'photo', id: item.id }) : undefined}
            selected={isSelected}
          >
            <PhotoFrame
              url={item.url}
              alt="Decorative photo"
              style={item.style}
              className={cn(
                'w-28',
                isSelected &&
                  'rounded-sm ring-2 ring-forest-ink/50 ring-offset-2 ring-offset-paper',
              )}
            />
          </MovableDecor>
        )
      })}
    </div>
  )
}
