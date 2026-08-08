export type Visibility = 'public' | 'unlisted'

export type UnlockType = 'immediate' | 'date' | 'birthday' | 'anniversary'

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
  /** The sender's name, shown as the signature on the shared page. */
  from: string
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
}

export interface CollectionInput {
  title: string
  description: string
  coverImage: number
  theme: string
  /** The sender's name, shown as the signature on the shared page. */
  from?: string
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
}

export interface LetterSchedule {
  type: UnlockType
  /** ISO datetime. For birthday/anniversary only the month & day are used. */
  date: string | null
}
