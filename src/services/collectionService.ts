import { requireSupabase } from './supabase'
import type { Database } from './database.types'
import type { Collection, CollectionInput, Visibility } from './types'
import { generateEditToken, randomSuffix, slugify } from '@/utils/slug'
import { EXAMPLE_COLLECTION } from '@/data/exampleCollection'

type CollectionRow = Database['public']['Tables']['collections']['Row']
type CollectionInsert = Database['public']['Tables']['collections']['Insert']

/** Patchable subset of Collection, in domain field names. */
export type CollectionUpdate = Partial<
  Pick<
    Collection,
    | 'title'
    | 'description'
    | 'coverImage'
    | 'theme'
    | 'primaryColor'
    | 'accentColor'
    | 'fontPair'
    | 'passwordHash'
    | 'musicUrl'
    | 'visibility'
  >
>

function mapRow(row: CollectionRow): Collection {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    coverImage: Number(row.cover_image),
    theme: row.theme,
    editToken: row.edit_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    primaryColor: row.primary_color,
    accentColor: row.accent_color,
    fontPair: row.font_pair,
    passwordHash: row.password_hash,
    musicUrl: row.music_url,
    visibility: (row.visibility as Visibility) || 'public',
    userId: row.user_id,
  }
}

async function findAvailableSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const client = requireSupabase()

  let query = client.from('collections').select('slug')
  if (excludeId) query = query.neq('id', excludeId)

  const { data, error } = await query
  if (error) throw new Error(`Could not check slug availability: ${error.message}`)

  const existing = new Set((data ?? []).map((row) => row.slug))
  if (!existing.has(baseSlug)) return baseSlug

  let candidate = `${baseSlug}-${randomSuffix()}`
  while (existing.has(candidate)) {
    candidate = `${baseSlug}-${randomSuffix()}`
  }
  return candidate
}

export const collectionService = {
  /** Creates the collection row and returns it with its secret edit token. */
  async create(input: CollectionInput): Promise<Collection> {
    const client = requireSupabase()
    const slug = await findAvailableSlug(slugify(input.title))
    const row: CollectionInsert = {
      title: input.title,
      description: input.description,
      cover_image: String(input.coverImage),
      theme: input.theme,
      slug,
      edit_token: generateEditToken(),
      primary_color: '',
      accent_color: '',
      font_pair: 'auto',
      password_hash: '',
      music_url: '',
      visibility: 'public',
      user_id: input.userId ?? null,
    }

    const { data, error } = await client
      .from('collections')
      .insert(row)
      .select()
      .single()

    if (error) throw new Error(`Could not create collection: ${error.message}`)
    return mapRow(data)
  },

  /** Fetches a public collection by its unique slug. */
  async getBySlug(slug: string): Promise<Collection | null> {
    if (slug === EXAMPLE_COLLECTION.slug) return EXAMPLE_COLLECTION

    const client = requireSupabase()
    const { data, error } = await client
      .from('collections')
      .select()
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw new Error(`Could not fetch collection: ${error.message}`)
    return data ? mapRow(data) : null
  },

  /** Fetches a collection by its secret edit token (builder access). */
  async getByEditToken(token: string): Promise<Collection | null> {
    const client = requireSupabase()
    const { data, error } = await client
      .from('collections')
      .select()
      .eq('edit_token', token)
      .maybeSingle()

    if (error) throw new Error(`Could not fetch collection: ${error.message}`)
    return data ? mapRow(data) : null
  },

  /** Fetches every collection owned by the given account, newest first. */
  async listByUser(userId: string): Promise<Collection[]> {
    const client = requireSupabase()
    const { data, error } = await client
      .from('collections')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Could not fetch your collections: ${error.message}`)
    return (data ?? []).map(mapRow)
  },

  async update(id: string, patch: CollectionUpdate): Promise<void> {
    const client = requireSupabase()
    const { error } = await client
      .from('collections')
      .update({
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.description !== undefined && { description: patch.description }),
        ...(patch.coverImage !== undefined && {
          cover_image: String(patch.coverImage),
        }),
        ...(patch.theme !== undefined && { theme: patch.theme }),
        ...(patch.primaryColor !== undefined && { primary_color: patch.primaryColor }),
        ...(patch.accentColor !== undefined && { accent_color: patch.accentColor }),
        ...(patch.fontPair !== undefined && { font_pair: patch.fontPair }),
        ...(patch.passwordHash !== undefined && { password_hash: patch.passwordHash }),
        ...(patch.musicUrl !== undefined && { music_url: patch.musicUrl }),
        ...(patch.visibility !== undefined && { visibility: patch.visibility }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw new Error(`Could not update collection: ${error.message}`)
  },

  /**
   * Makes sure the slug is unique (appending a random suffix if needed) and
   * returns the final public slug. Called when publishing.
   */
  async publish(id: string, desiredSlug: string): Promise<{ slug: string }> {
    const client = requireSupabase()
    const finalSlug = await findAvailableSlug(slugify(desiredSlug), id)

    const { data, error } = await client
      .from('collections')
      .update({ slug: finalSlug, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('slug')
      .single()

    if (error) throw new Error(`Could not publish collection: ${error.message}`)
    return { slug: data.slug }
  },

  async delete(id: string): Promise<void> {
    const client = requireSupabase()
    const { error } = await client.from('collections').delete().eq('id', id)
    if (error) throw new Error(`Could not delete collection: ${error.message}`)
  },
}
