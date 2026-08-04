/**
 * Lightweight markup for letter bodies.
 *
 * The letter body stays a plain string (backwards compatible with every
 * existing letter) and uses a small, safe markup convention so formatting is
 * applied in the reader without storing HTML or using innerHTML:
 *
 *   **bold**      *italic*      __underline__      ~~strikethrough~~
 *   # A heading            (at the start of a paragraph)
 *   ---                    (a paragraph on its own → divider)
 *
 * Unmatched markers render literally, so old letters (which never use them)
 * are unaffected. Everything here is pure — no JSX, no DOM.
 */

export interface InlineSegment {
  text: string
  mark?: 'strong' | 'em' | 'underline' | 'strike'
}

export type BodyBlock =
  | { type: 'paragraph'; segments: InlineSegment[] }
  | { type: 'heading'; segments: InlineSegment[] }
  | { type: 'divider' }

const INLINE_PATTERN = /\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\*([^*\n]+)\*/g

export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  INLINE_PATTERN.lastIndex = 0
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) })
    }
    const [, strong, underline, strike, em] = match
    const content = strong ?? underline ?? strike ?? em ?? ''
    const mark = strong
      ? 'strong'
      : underline
        ? 'underline'
        : strike
          ? 'strike'
          : 'em'
    segments.push({ text: content, mark })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) })
  }
  return segments
}

export function parseBody(body: string): BodyBlock[] {
  return body
    .split(/\n\n+/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((block): BodyBlock => {
      if (block === '---') return { type: 'divider' }
      if (/^#\s+/.test(block)) {
        return { type: 'heading', segments: parseInline(block.replace(/^#\s+/, '')) }
      }
      return { type: 'paragraph', segments: parseInline(block) }
    })
}

/* ── Editor helpers (pure; the textarea owns the selection) ────────── */

export interface EditResult {
  value: string
  selectionStart: number
  selectionEnd: number
}

/** Wraps the selection in `mark` (or unwraps when already wrapped). */
export function toggleInline(text: string, start: number, end: number, mark: string): EditResult {
  const selected = text.slice(start, end)
  if (selected.startsWith(mark) && selected.endsWith(mark) && selected.length >= mark.length * 2) {
    const inner = selected.slice(mark.length, selected.length - mark.length)
    const value = text.slice(0, start) + inner + text.slice(end)
    return { value, selectionStart: start, selectionEnd: start + inner.length }
  }
  const value = text.slice(0, start) + mark + selected + mark + text.slice(end)
  return { value, selectionStart: start + mark.length, selectionEnd: end + mark.length }
}

/** Toggles a line prefix (e.g. "# ") on the line under the selection. */
export function toggleLinePrefix(text: string, start: number, end: number, prefix: string): EditResult {
  const lineStart = text.lastIndexOf('\n', start - 1) + 1
  const lineEnd = text.indexOf('\n', end)
  const lineEndAdj = lineEnd === -1 ? text.length : lineEnd
  const line = text.slice(lineStart, lineEndAdj)
  const hasPrefix = line.startsWith(prefix)
  const newLine = hasPrefix ? line.slice(prefix.length) : prefix + line
  const value = text.slice(0, lineStart) + newLine + text.slice(lineEndAdj)
  return {
    value,
    selectionStart: lineStart,
    selectionEnd: lineStart + newLine.length,
  }
}

/** Inserts a `---` divider, surrounded by blank lines when needed. */
export function insertDivider(text: string, start: number, end: number): EditResult {
  const before = text.slice(0, start)
  const after = text.slice(end)
  const blankBefore = before.length > 0 && !before.endsWith('\n\n') ? '\n\n' : ''
  const blankAfter = after.length > 0 && !after.startsWith('\n\n') ? '\n\n' : ''
  const value = `${before}${blankBefore}---${blankAfter}${after}`
  const cursor = value.length - after.length
  return { value, selectionStart: cursor, selectionEnd: cursor }
}

/* ── Decorations: free positioning across the paper ─────────────── */

/** Keeps a decor item's center within the paper (anywhere on the letter). */
export function clampPercent(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}
