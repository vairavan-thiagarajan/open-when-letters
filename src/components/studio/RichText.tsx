import { Fragment } from 'react'
import { parseBody, type InlineSegment } from '@/utils/markup'

interface InlineTextProps {
  segments: InlineSegment[]
}

/** Renders one block of parsed inline segments as typed elements (no HTML). */
export function InlineText({ segments }: InlineTextProps) {
  return (
    <>
      {segments.map((segment, index) => {
        const node = segment.text
        if (segment.mark === 'strong') return <strong key={index}>{node}</strong>
        if (segment.mark === 'em') return <em key={index}>{node}</em>
        if (segment.mark === 'underline') return <u key={index}>{node}</u>
        if (segment.mark === 'strike') return <s key={index}>{node}</s>
        return <Fragment key={index}>{node}</Fragment>
      })}
    </>
  )
}

interface RichTextProps {
  body: string
  /** Font family for the letter body. Empty = keep the default look. */
  fontFamily?: string
}

/**
 * Pure rendering of a letter body using the lightweight markup convention.
 * Shared by the reader and the editor preview so both always agree.
 */
export function RichText({ body, fontFamily }: RichTextProps) {
  const blocks = parseBody(body)
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'divider') {
          return (
            <div
              key={index}
              className="mx-auto flex items-center gap-4"
              aria-hidden
            >
              <span className="h-px flex-1 bg-line" />
              <span className="text-forest-ink">♥</span>
              <span className="h-px flex-1 bg-line" />
            </div>
          )
        }
        if (block.type === 'heading') {
          return (
            <h2
              key={index}
              style={fontFamily ? { fontFamily } : undefined}
              className="font-display text-xl leading-snug font-semibold tracking-tight text-ink sm:text-2xl"
            >
              <InlineText segments={block.segments} />
            </h2>
          )
        }
        return (
          <p
            key={index}
            style={fontFamily ? { fontFamily } : undefined}
            className="font-display text-sm leading-[1.75] whitespace-pre-line text-ink/90 sm:text-base"
          >
            <InlineText segments={block.segments} />
          </p>
        )
      })}
    </>
  )
}
