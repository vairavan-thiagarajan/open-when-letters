import { requireSupabase } from './supabase'
import type { Database } from './database.types'
import type { CollectionLetter, LetterInput, UnlockType } from './types'

type LetterRow = Database['public']['Tables']['letters']['Row']

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
    memoryImageUrl: row.memory_image_url || '',
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
    | 'memoryImageUrl'
  >
>

export const letterService = {
  async listByCollection(collectionId: string): Promise<CollectionLetter[]> {
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
    // Only send the memory field when it is actually set, so creating a letter
    // keeps working even before the memory_image_url column migration runs.
    if (input.memoryImageUrl !== undefined) {
      insertData.memory_image_url = input.memoryImageUrl
    }

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
        ...(patch.memoryImageUrl !== undefined && {
          memory_image_url: patch.memoryImageUrl,
        }),
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
