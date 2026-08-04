import { supabase } from './supabase'

/**
 * Persists "The Memory" photo for a letter into the public `memories` bucket.
 *
 * Mirrors the og-image pattern: best-effort upload, graceful fallback. When
 * Supabase storage is unavailable the compressed image is returned as a data
 * URL so the feature still works — the letter simply stores it inline.
 */

const BUCKET = 'memories'

async function readAsDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read the image'))
    reader.readAsDataURL(blob)
  })
}

/** Uploads a memory image; returns its public URL (or a data URL fallback). */
export async function uploadMemoryImage(
  blob: Blob,
  letterId: string,
): Promise<string> {
  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${letterId}/${Date.now()}.${extension}`

  if (supabase) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: blob.type, upsert: true })
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return data.publicUrl
    }
  }

  return readAsDataURL(blob)
}

/** Best-effort cleanup of a previously stored memory image. */
export async function removeMemoryImage(url: string): Promise<void> {
  if (!supabase) return
  if (!url.startsWith('http')) return
  try {
    const parsed = new URL(url)
    const segments = parsed.pathname.split('/')
    const bucketIndex = segments.indexOf(BUCKET)
    if (bucketIndex === -1) return
    const path = segments.slice(bucketIndex + 1).join('/')
    await supabase.storage.from(BUCKET).remove([path])
  } catch {
    /* non-fatal */
  }
}
