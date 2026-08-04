export type Visibility = 'public' | 'unlisted'

export type UnlockType = 'immediate' | 'date' | 'birthday' | 'anniversary'

/** A curated font offered by the Letter Studio. */
export interface LetterFont {
  id: string
  label: string
  family: string
  /** One-line description shown in the picker. */
  vibe: string
}

/** A built-in background preset (all gradients reuse the existing palette). */
export interface BackgroundPreset {
  id: string
  label: string
  css: string
}

/** A sticker placed on the letter paper. Positions are paper-relative %. */
export interface StickerItem {
  id: string
  emoji: string
  x: number
  y: number
  scale: number
  rotation: number
}

export type PhotoStyle = 'polaroid' | 'taped' | 'rounded'

/** A decorative photo placed on the letter paper. Positions are paper-relative %. */
export interface PhotoItem {
  id: string
  url: string
  x: number
  y: number
  scale: number
  rotation: number
  style: PhotoStyle
}

export interface Collection {
  id: string
  slug: string
  title: string
  description: string
  coverImage: number
  theme: string
  editToken: string
  createdAt: string
  updatedAt: string
  primaryColor: string
  accentColor: string
  fontPair: string
  passwordHash: string
  musicUrl: string
  visibility: Visibility
  userId: string | null
}

export interface CollectionLetter {
  id: string
  collectionId: string
  title: string
  trigger: string
  body: string
  coverImage: number
  position: number
  createdAt: string
  unlockType: UnlockType
  unlockAt: string | null
  /** Chosen letter font id ('' = default look). */
  font: string
  /** Background value: '' (none), 'preset:<id>', or 'url:<publicUrl>'. */
  background: string
  /** Stickers placed on the letter paper. */
  stickers: StickerItem[]
  /** Decorative photos placed on the letter paper. */
  photos: PhotoItem[]
  /** Optional per-letter audio URL ('' = none). */
  audioUrl: string
}

export interface CollectionInput {
  title: string
  description: string
  coverImage: number
  theme: string
  /** The signed-in account that owns this collection (null for guests). */
  userId?: string | null
}

export interface LetterInput {
  title: string
  trigger: string
  body: string
  coverImage: number
  font?: string
  background?: string
  stickers?: StickerItem[]
  photos?: PhotoItem[]
  audioUrl?: string
}

export interface LetterSchedule {
  type: UnlockType
  /** ISO datetime. For birthday/anniversary only the month & day are used. */
  date: string | null
}
