import { supabase } from './supabase'

/**
 * Persists Letter Studio assets (background images, decorative photos) into
 * the public `letter-decor` bucket.
 *
 * Backgrounds & photos are uploaded best-effort with a data-URL fallback so
 * the feature still works when Supabase storage is unavailable.
 */

const BUCKET = 'letter-decor'

function extFromBlob(blob: Blob): string {
  const type = (blob.type || '').split(';')[0].trim().toLowerCase()
  const map: Record<string, string> = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png',
  }
  return map[type] ?? 'bin'
}

async function readAsDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read the file'))
    reader.readAsDataURL(blob)
  })
}

/** Uploads an image (already compressed) and returns its public URL or data URL. */
export async function uploadDecorImage(
  blob: Blob,
  letterId: string,
  kind: 'background' | 'photo',
): Promise<string> {
  const path = `${letterId}/${kind}-${Date.now()}.${extFromBlob(blob)}`

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

/** Best-effort cleanup of a previously stored decor asset. */
export async function removeDecorAsset(url: string): Promise<void> {
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
