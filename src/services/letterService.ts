import { requireSupabase } from './supabase'
import type { Database } from './database.types'
import type {
  CollectionLetter,
  LetterInput,
  PhotoItem,
  StickerItem,
  UnlockType,
} from './types'
import { EXAMPLE_COLLECTION, EXAMPLE_LETTERS } from '@/data/exampleCollection'

type LetterRow = Database['public']['Tables']['letters']['Row']

function parseJsonArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function mapRow(row: LetterRow): CollectionLetter {
  return {
    id: row.id,
    collectionId: row.collection_id,
    title: row.title,
    trigger: row.trigger,
    body: row.body,
    coverImage: Number(row.cover_image),
    position: row.position,
    createdAt: row.created_at,
    unlockType: (row.unlock_type as UnlockType) || 'immediate',
    unlockAt: row.unlock_at,
    font: row.font || '',
    background: row.background || '',
    stickers: parseJsonArray(row.stickers) as StickerItem[],
    photos: parseJsonArray(row.photos) as PhotoItem[],
    audioUrl: row.audio_url || '',
  }
}

export type LetterUpdate = Partial<
  Pick<
    CollectionLetter,
    | 'title'
    | 'trigger'
    | 'body'
    | 'coverImage'
    | 'position'
    | 'unlockType'
    | 'unlockAt'
    | 'font'
    | 'background'
    | 'stickers'
    | 'photos'
    | 'audioUrl'
  >
>

export const letterService = {
  async listByCollection(collectionId: string): Promise<CollectionLetter[]> {
    if (collectionId === EXAMPLE_COLLECTION.id) return EXAMPLE_LETTERS

    const client = requireSupabase()
    const { data, error } = await client
      .from('letters')
      .select()
      .eq('collection_id', collectionId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Could not load letters: ${error.message}`)
    return (data ?? []).map(mapRow)
  },

  async create(collectionId: string, input: Partial<LetterInput>): Promise<CollectionLetter> {
    const client = requireSupabase()

    const { data: last, error: countError } = await client
      .from('letters')
      .select('position')
      .eq('collection_id', collectionId)
      .order('position', { ascending: false })
      .limit(1)
    if (countError) throw new Error(`Could not load letters: ${countError.message}`)

    const nextPosition = (last?.[0]?.position ?? -1) + 1

    const insertData: Record<string, unknown> = {
      collection_id: collectionId,
      title: input.title ?? '',
      trigger: input.trigger ?? '',
      body: input.body ?? '',
      cover_image: String(input.coverImage ?? 0),
      position: nextPosition,
      unlock_type: 'immediate',
      unlock_at: null,
    }
    // Only send studio fields when they are actually set, so creating a letter
    // keeps working even before the letter-studio migration runs.
    if (input.font !== undefined) insertData.font = input.font
    if (input.background !== undefined) insertData.background = input.background
    if (input.stickers !== undefined) insertData.stickers = input.stickers
    if (input.photos !== undefined) insertData.photos = input.photos
    if (input.audioUrl !== undefined) insertData.audio_url = input.audioUrl

    const { data, error } = await client
      .from('letters')
      .insert(insertData as never)
      .select()
      .single()

    if (error) throw new Error(`Could not create letter: ${error.message}`)
    return mapRow(data)
  },

  async update(id: string, patch: LetterUpdate): Promise<void> {
    const client = requireSupabase()
    const { error } = await client
      .from('letters')
      .update({
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.trigger !== undefined && { trigger: patch.trigger }),
        ...(patch.body !== undefined && { body: patch.body }),
        ...(patch.coverImage !== undefined && {
          cover_image: String(patch.coverImage),
        }),
        ...(patch.position !== undefined && { position: patch.position }),
        ...(patch.unlockType !== undefined && { unlock_type: patch.unlockType }),
        ...(patch.unlockAt !== undefined && { unlock_at: patch.unlockAt }),
        ...(patch.font !== undefined && { font: patch.font }),
        ...(patch.background !== undefined && { background: patch.background }),
        ...(patch.stickers !== undefined && {
          stickers: JSON.stringify(patch.stickers),
        }),
        ...(patch.photos !== undefined && { photos: JSON.stringify(patch.photos) }),
        ...(patch.audioUrl !== undefined && { audio_url: patch.audioUrl }),
      })
      .eq('id', id)

    if (error) throw new Error(`Could not save letter: ${error.message}`)
  },

  async delete(id: string): Promise<void> {
    const client = requireSupabase()
    const { error } = await client.from('letters').delete().eq('id', id)
    if (error) throw new Error(`Could not delete letter: ${error.message}`)
  },
}
