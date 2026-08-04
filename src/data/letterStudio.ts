import type { BackgroundPreset, LetterFont } from '@/services/types'

/** The curated letter fonts (max 8). The reader's default look is #1 below. */
export const LETTER_FONTS: LetterFont[] = [
  { id: 'caveat', label: 'Caveat', family: '"Caveat Variable", cursive', vibe: 'Handwritten note' },
  { id: 'dancing-script', label: 'Dancing Script', family: '"Dancing Script Variable", cursive', vibe: 'Flowing cursive' },
  { id: 'great-vibes', label: 'Great Vibes', family: '"Great Vibes", cursive', vibe: 'Romantic script' },
  { id: 'kalam', label: 'Kalam', family: '"Kalam", cursive', vibe: 'Casual handwriting' },
  { id: 'shadows-into-light', label: 'Shadows Into Light', family: '"Shadows Into Light", cursive', vibe: 'Intimate & light' },
  { id: 'special-elite', label: 'Special Elite', family: '"Special Elite", serif', vibe: 'Typewriter' },
  { id: 'cormorant', label: 'Cormorant', family: '"Cormorant Garamond Variable", serif', vibe: 'Elegant & literary' },
  { id: 'lora', label: 'Lora', family: '"Lora Variable", serif', vibe: 'Warm literary serif' },
]

/** '' means "no custom font" → the letter keeps its current default look. */
export const DEFAULT_FONT_ID = ''

export function letterFontById(id: string): LetterFont | undefined {
  if (!id) return undefined
  return LETTER_FONTS.find((font) => font.id === id)
}

/** Built-in backgrounds. All gradients reuse existing palette colors. */
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'mint-wash',
    label: 'Mint wash',
    css: 'linear-gradient(180deg, rgba(213,245,194,0.55), rgba(252,250,245,0))',
  },
  {
    id: 'teal-wash',
    label: 'Teal wash',
    css: 'linear-gradient(180deg, rgba(168,229,229,0.55), rgba(252,250,245,0))',
  },
  {
    id: 'blush-wash',
    label: 'Blush wash',
    css: 'linear-gradient(180deg, rgba(246,208,255,0.5), rgba(252,250,245,0))',
  },
  {
    id: 'sunshine-whisper',
    label: 'Sunshine',
    css: 'linear-gradient(180deg, rgba(255,233,92,0.4), rgba(252,250,245,0))',
  },
  {
    id: 'forest-mist',
    label: 'Forest mist',
    css: 'linear-gradient(180deg, rgba(26,51,0,0.12), rgba(252,250,245,0))',
  },
  {
    id: 'terracotta-glow',
    label: 'Warm glow',
    css: 'radial-gradient(ellipse at 50% 0%, rgba(203,85,33,0.28), transparent 70%)',
  },
  {
    id: 'dusk-lavender',
    label: 'Dusk',
    css: 'radial-gradient(ellipse at 50% 20%, rgba(246,208,255,0.42), transparent 72%)',
  },
]

export const BACKGROUND_NONE = ''

/** Encoded value stored on the letter. */
export function presetBackgroundValue(id: string): string {
  return `preset:${id}`
}

/** Resolves a stored background value to CSS ('' = no background). */
export function backgroundCss(value: string): string {
  if (!value) return ''
  if (value.startsWith('preset:')) {
    const preset = BACKGROUND_PRESETS.find(
      (item) => presetBackgroundValue(item.id) === value,
    )
    return preset?.css ?? ''
  }
  if (value.startsWith('url:')) {
    return `url("${value.slice(4)}") center / cover no-repeat`
  }
  return ''
}

export function isCustomBackground(value: string): boolean {
  return value.startsWith('url:')
}

/** Curated sticker library — 12 categories, emoji-based (zero asset files). */
export interface StickerCategory {
  id: string
  label: string
  emojis: string[]
}

export const STICKER_CATEGORIES: StickerCategory[] = [
  { id: 'hearts', label: 'Hearts', emojis: ['❤️', '💖', '💗', '💓', '💕', '💘', '🤍'] },
  { id: 'flowers', label: 'Flowers', emojis: ['🌸', '🌹', '🌷', '🌻', '🌺', '🌼', '🪷', '🍀'] },
  { id: 'stars', label: 'Stars', emojis: ['⭐', '✨', '🌟', '🌠', '💫', '🌙', '☄️'] },
  { id: 'food', label: 'Coffee & treats', emojis: ['☕', '🍰', '🍪', '🍓', '🍒', '🧁', '🍩', '🍜'] },
  { id: 'weather', label: 'Weather', emojis: ['☀️', '🌈', '🌧️', '⛈️', '❄️', '☁️', '🌤️'] },
  { id: 'animals', label: 'Animals', emojis: ['🐈', '🐾', '🦋', '🐻', '🐰', '🦉', '🐢', '🐝'] },
  { id: 'travel', label: 'Travel', emojis: ['✈️', '🧳', '🗺️', '🚂', '🏔️', '🌊', '⛵', '🎒'] },
  { id: 'music', label: 'Music', emojis: ['🎵', '🎶', '🎸', '🎹', '🎧', '🎼', '🎷', '🎤'] },
  { id: 'celebration', label: 'Celebration', emojis: ['🎉', '🎂', '🎈', '🥂', '🎊', '🪅', '🎁', '🎇'] },
  { id: 'stationery', label: 'Stationery', emojis: ['✉️', '💌', '✏️', '🖋️', '📖', '🖌️', '📝', '🔖'] },
  { id: 'luck', label: 'Good luck', emojis: ['🍀', '🤞', '🍃', '🕊️', '🔮', '✨', '⏳'] },
  { id: 'little', label: 'Little things', emojis: ['🐚', '🍂', '🎐', '🔍', '🧸', '⏰', '💍'] },
]

export const MAX_STICKERS = 12
export const MAX_PHOTOS = 6

/** Scattered, deterministic placement so newly added items never fully overlap. */
export function nextDecorPosition(index: number): { x: number; y: number; rotation: number } {
  return {
    x: 10 + ((index * 13) % 76),
    y: 12 + ((index * 17) % 72),
    rotation: ((index * 7) % 21) - 10,
  }
}
