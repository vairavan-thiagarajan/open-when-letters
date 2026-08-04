import { useCallback } from 'react'
import type { RefObject } from 'react'
import {
  insertDivider,
  toggleInline,
  toggleLinePrefix,
  type EditResult,
} from '@/utils/markup'
import { cn } from '@/utils/cn'

interface RichTextToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onChange: (value: string) => void
}

/**
 * Formatting toolbar for the letter body. Works on the current textarea
 * selection using the lightweight markup convention — the text stays plain
 * so the reader and autosave never change.
 */
export function RichTextToolbar({ textareaRef, onChange }: RichTextToolbarProps) {
  const apply = useCallback(
    (result: EditResult) => {
      const el = textareaRef.current
      if (!el) return
      onChange(result.value)
      window.requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(result.selectionStart, result.selectionEnd)
      })
    },
    [textareaRef, onChange],
  )

  const run = useCallback(
    (fn: (text: string, start: number, end: number) => EditResult) => {
      const el = textareaRef.current
      if (!el) return
      apply(fn(el.value, el.selectionStart, el.selectionEnd))
    },
    [apply, textareaRef],
  )

  const buttons = [
    {
      label: 'Bold',
      title: 'Bold',
      glyph: 'B',
      className: 'font-bold',
      action: () => run((text, start, end) => toggleInline(text, start, end, '**')),
    },
    {
      label: 'Italic',
      title: 'Italic',
      glyph: 'I',
      className: 'italic',
      action: () => run((text, start, end) => toggleInline(text, start, end, '*')),
    },
    {
      label: 'Underline',
      title: 'Underline',
      glyph: 'U',
      className: 'underline',
      action: () => run((text, start, end) => toggleInline(text, start, end, '__')),
    },
    {
      label: 'Strikethrough',
      title: 'Strikethrough',
      glyph: 'S',
      className: 'line-through',
      action: () => run((text, start, end) => toggleInline(text, start, end, '~~')),
    },
    {
      label: 'Heading',
      title: 'Heading',
      glyph: 'H',
      className: 'font-display font-semibold',
      action: () => run((text, start, end) => toggleLinePrefix(text, start, end, '# ')),
    },
    {
      label: 'Divider',
      title: 'Divider',
      glyph: '—',
      className: '',
      action: () => run((text, start, end) => insertDivider(text, start, end)),
    },
  ]

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      role="toolbar"
      aria-label="Letter formatting"
    >
      {buttons.map((button) => (
        <button
          key={button.label}
          type="button"
          onClick={button.action}
          onMouseDown={(event) => event.preventDefault()}
          title={button.title}
          aria-label={button.title}
          className={cn(
            'grid h-9 min-w-9 place-items-center rounded-md border border-line bg-paper px-2 text-sm text-ink transition-colors hover:border-highlighter-yellow',
            button.className,
          )}
        >
          {button.glyph}
        </button>
      ))}
      <span className="ml-auto hidden text-xs text-mist sm:block">
        **bold** · *italic* · # heading · — divider
      </span>
    </div>
  )
}
