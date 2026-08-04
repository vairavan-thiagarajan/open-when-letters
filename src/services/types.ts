export type Visibility = 'public' | 'unlisted'

export type UnlockType = 'immediate' | 'date' | 'birthday' | 'anniversary'

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
  /** Optional photo attached to the letter ("The Memory"). Empty = no section. */
  memoryImageUrl: string
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
  memoryImageUrl?: string
}

export interface LetterSchedule {
  type: UnlockType
  /** ISO datetime. For birthday/anniversary only the month & day are used. */
  date: string | null
}
