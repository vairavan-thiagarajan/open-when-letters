import { useRef, useState } from 'react'
import {
  BACKGROUND_NONE,
  BACKGROUND_PRESETS,
  backgroundCss,
  isCustomBackground,
  presetBackgroundValue,
} from '@/data/letterStudio'
import { compressImage, isImageFile } from '@/utils/imageCompress'
import { uploadDecorImage } from '@/services/letterDecorStorage'
import { cn } from '@/utils/cn'

interface BackgroundPickerProps {
  value: string
  letterId: string
  onChange: (value: string) => void
}

type Status = 'idle' | 'uploading' | 'error'

/** Background choices: presets behind the paper, or your own uploaded image. */
export function BackgroundPicker({ value, letterId, onChange }: BackgroundPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (!isImageFile(file)) {
      setStatus('error')
      return
    }
    setStatus('uploading')
    try {
      const compressed = await compressImage(file)
      const url = await uploadDecorImage(compressed, letterId, 'background')
      onChange(`url:${url}`)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  const custom = isCustomBackground(value)
  const customCss = backgroundCss(value)

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => onChange(BACKGROUND_NONE)}
          aria-pressed={value === BACKGROUND_NONE}
          className={cn(
            'group flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-left transition-all duration-200',
            value === BACKGROUND_NONE
              ? 'border-ink bg-paper shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
              : 'border-line bg-paper/60 hover:border-highlighter-yellow',
          )}
        >
          <span className="aspect-[4/3] w-full rounded-lg border border-line bg-paper" />
          <span className="text-xs font-medium text-ink">None</span>
        </button>

        {BACKGROUND_PRESETS.map((preset) => {
          const encoded = presetBackgroundValue(preset.id)
          const active = value === encoded
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(encoded)}
              aria-pressed={active}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-left transition-all duration-200',
                active
                  ? 'border-ink bg-paper shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                  : 'border-line bg-paper/60 hover:border-highlighter-yellow',
              )}
            >
              <span
                className="aspect-[4/3] w-full rounded-lg border border-line"
                style={{ background: preset.css }}
              />
              <span className="text-xs font-medium text-ink">{preset.label}</span>
            </button>
          )
        })}

        {custom && (
          <button
            type="button"
            onClick={() => onChange(BACKGROUND_NONE)}
            aria-pressed={false}
            title="Remove custom background"
            className="group relative flex flex-col items-center gap-1.5 rounded-xl border border-highlighter-yellow bg-paper p-2.5 text-left transition-all duration-200"
          >
            <span
              className="aspect-[4/3] w-full rounded-lg border border-line"
              style={{ background: customCss }}
            />
            <span className="flex items-center gap-1 text-xs font-medium text-ink">
              Your photo
              <span className="grid h-4 w-4 place-items-center rounded-full bg-blush text-[10px] text-forest-ink">
                ×
              </span>
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === 'uploading'}
          aria-pressed={false}
          className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-highlighter-yellow/60 p-2.5 text-left transition-all duration-200 hover:border-forest-ink/60 hover:bg-blush/30 disabled:opacity-40"
        >
          <span className="grid aspect-[4/3] w-full place-items-center rounded-lg bg-blush/40 text-forest-ink">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-xs font-medium text-ink">
            {status === 'uploading' ? 'Uploading…' : 'Upload'}
          </span>
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-2 text-xs font-medium text-terracotta">
          That file couldn't be used. Please try a JPG, PNG or WebP image.
        </p>
      )}
    </div>
  )
}
