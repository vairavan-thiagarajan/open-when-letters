/** SHA-256 hex digest used to store & verify collection passwords. */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/** Constant-time comparison of two hex digests. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

const UNLOCKED_KEY = 'ow:unlocked'

/** Whether this browser has already unlocked a given collection. */
export function hasUnlockedCollection(collectionId: string): boolean {
  try {
    const stored = window.sessionStorage.getItem(UNLOCKED_KEY)
    return stored ? stored.split(',').includes(collectionId) : false
  } catch {
    return false
  }
}

/** Marks a collection as unlocked for this browser session. */
export function markCollectionUnlocked(collectionId: string): void {
  try {
    const stored = window.sessionStorage.getItem(UNLOCKED_KEY) ?? ''
    const ids = stored ? stored.split(',') : []
    if (!ids.includes(collectionId)) ids.push(collectionId)
    window.sessionStorage.setItem(UNLOCKED_KEY, ids.join(','))
  } catch {
    /* sessionStorage unavailable — the gate stays per visit */
  }
}
