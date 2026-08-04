import type { PhotoStyle } from '@/services/types'
import { cn } from '@/utils/cn'

interface PhotoFrameProps {
  url: string
  alt: string
  style: PhotoStyle
  className?: string
}

/**
 * A decorative photo frame. Used by both the editor canvas (interactive) and
 * the reader (static). Styles: polaroid, taped, or rounded.
 */
export function PhotoFrame({ url, alt, style, className }: PhotoFrameProps) {
  if (style === 'polaroid') {
    return (
      <span
        className={cn(
          'block rotate-[-2deg] rounded-sm bg-paper p-2 pb-5 shadow-[rgba(0,0,0,0.12)_0px_2px_8px_0px]',
          className,
        )}
      >
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="block aspect-[4/3] w-full rounded-[2px] object-cover"
        />
      </span>
    )
  }

  if (style === 'taped') {
    return (
      <span className={cn('relative block rotate-[-3deg]', className)}>
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 z-10 h-4 w-1/3 -translate-x-1/2 -rotate-2 rounded-[2px] bg-highlighter-yellow/70"
        />
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="block aspect-[4/3] w-full rounded-md object-cover shadow-[rgba(0,0,0,0.12)_0px_2px_8px_0px]"
        />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'block overflow-hidden rounded-2xl border border-line bg-paper shadow-[rgba(0,0,0,0.12)_0px_2px_8px_0px]',
        className,
      )}
    >
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="block aspect-[4/3] w-full object-cover"
      />
    </span>
  )
}
