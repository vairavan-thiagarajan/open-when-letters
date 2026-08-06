import { supabase } from '@/services/supabase'
import type { Collection } from '@/services/types'

/**
 * Generates a branded Open Graph preview card for a collection (1200x630).
 *
 * Strategy:
 *  1. Draw the card on an offscreen canvas using the app's visual identity
 *     (cream paper, soft colour washes, a wax-sealed envelope and the
 *     collection title).
 *  2. When Supabase storage is configured, upload the PNG to a public
 *     "og-images" bucket so crawlers can fetch a real URL.
 *  3. Fall back to the static /og-image.png when storage is unavailable or
 *     the upload fails, so sharing always produces a beautiful preview.
 *
 * Results are cached per collection so the work happens at most once.
 */

const CACHE_KEY = 'ow_og_images_v1'
const DEFAULT_OG_IMAGE = '/og-image.png'

function readCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeCache(next: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(next))
  } catch {
    /* storage full / private mode — non-fatal */
  }
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y + size * 0.5)
  ctx.bezierCurveTo(
    x - size * 0.6, y - size * 0.2,
    x - size * 0.4, y - size * 0.75,
    x, y - size * 0.3,
  )
  ctx.bezierCurveTo(
    x + size * 0.4, y - size * 0.75,
    x + size * 0.6, y - size * 0.2,
    x, y + size * 0.5,
  )
  ctx.closePath()
  ctx.fill()
}

/** The logo mark: a yellow tile with a sealed envelope, same as the navbar. */
function drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 24
  ctx.fillStyle = '#ffe95c'
  roundedRect(ctx, x, y, size, size, size * 0.3)
  ctx.fill()
  ctx.fillStyle = '#1a3300'
  roundedRect(ctx, x + 2.5 * s, y + 5 * s, 19 * s, 14 * s, 3.5 * s)
  ctx.fill()
  ctx.strokeStyle = '#fcfaf5'
  ctx.lineWidth = 2 * s
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x + 4 * s, y + 8 * s)
  ctx.lineTo(x + 12 * s, y + 13.5 * s)
  ctx.lineTo(x + 20 * s, y + 8 * s)
  ctx.stroke()
}

function drawCard(title: string): HTMLCanvasElement {
  const W = 1200
  const H = 630
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const displayFont = '"Bricolage Grotesque", Georgia, serif'
  const bodyFont = '"Inter", system-ui, sans-serif'

  ctx.fillStyle = '#fcfaf5'
  ctx.fillRect(0, 0, W, H)

  const washes: Array<[number, number, string]> = [
    [960, 60, '#a8e5e5'],
    [120, 590, '#d5f5c2'],
    [1080, 570, '#f6d0ff'],
  ]
  washes.forEach(([cx, cy, color]) => {
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 460)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, W, H)
  })

  drawHeart(ctx, 150, 245, 26, 'rgba(26,51,0,0.8)')
  drawHeart(ctx, 1055, 150, 26, '#cb5521')

  drawLogo(ctx, 84, 70, 96)

  // Envelope
  const env = { x: 455, y: 175, w: 290, h: 225, r: 18 }
  ctx.fillStyle = 'rgba(70,52,59,0.08)'
  ctx.beginPath()
  ctx.ellipse(600, 405, 185, 17, 0, 0, Math.PI * 2)
  ctx.fill()

  const envGrad = ctx.createLinearGradient(env.x, env.y, env.x + env.w, env.y + env.h)
  envGrad.addColorStop(0, '#2a5100')
  envGrad.addColorStop(1, '#123000')
  ctx.fillStyle = envGrad
  roundedRect(ctx, env.x, env.y, env.w, env.h, env.r)
  ctx.fill()

  const flapGrad = ctx.createLinearGradient(0, env.y, 0, env.y + 120)
  flapGrad.addColorStop(0, '#2a5100')
  flapGrad.addColorStop(1, '#123000')
  ctx.fillStyle = flapGrad
  ctx.beginPath()
  ctx.moveTo(env.x, env.y)
  ctx.lineTo(env.x + env.w, env.y)
  ctx.lineTo(env.x + env.w / 2, env.y + 120)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#fffdfa'
  roundedRect(ctx, env.x, env.y + 120, env.w, env.h - 120, env.r)
  ctx.fill()
  ctx.strokeStyle = '#f0e4dd'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.strokeStyle = '#f0e4dd'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(env.x + 12, env.y + 120 + 90)
  ctx.lineTo(env.x + env.w / 2, env.y + 120)
  ctx.lineTo(env.x + env.w - 12, env.y + 120 + 90)
  ctx.stroke()

  ctx.fillStyle = 'rgba(26,51,0,0.28)'
  ctx.beginPath()
  ctx.arc(600, 295, 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffe95c'
  ctx.beginPath()
  ctx.arc(600, 295, 26, 0, Math.PI * 2)
  ctx.fill()
  drawHeart(ctx, 600, 302, 16, '#1a3300')

  // Wordmark
  ctx.textAlign = 'center'
  ctx.fillStyle = '#1a3300'
  ctx.font = `bold 74px ${displayFont}`
  ctx.fillText('Open When Letters', 600, 522, 1000)

  ctx.fillStyle = 'rgba(255,233,92,0.75)'
  roundedRect(ctx, 470, 538, 260, 16, 8)
  ctx.fill()

  ctx.fillStyle = '#4a7030'
  ctx.font = `italic 30px ${bodyFont}`
  ctx.fillText('Letters that wait for the right moment', 600, 588, 1000)

  // Collection title (only when it is not the brand name itself)
  const label = title.trim()
  if (label && label.toLowerCase() !== 'open when letters') {
    ctx.fillStyle = '#1a3300'
    ctx.font = `600 40px ${displayFont}`
    ctx.fillText(label, 600, 470, 860)
  }

  return canvas
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

async function uploadToStorage(collectionId: string, blob: Blob): Promise<string | null> {
  if (!supabase) return null
  try {
    const path = `${collectionId}.png`
    const { error } = await supabase.storage
      .from('og-images')
      .upload(path, blob, { contentType: 'image/png', upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('og-images').getPublicUrl(path)
    return data.publicUrl
  } catch {
    return null
  }
}

/** Best-effort: wait for the display font so text renders crisply. */
async function fontsReady() {
  try {
    await document.fonts.ready
  } catch {
    /* non-fatal */
  }
}

/** Removes a collection's cached card so a rebuilt collection regenerates it. */
export function clearCollectionOgImage(collectionId: string) {
  const cache = readCache()
  if (!(collectionId in cache)) return
  const next = { ...cache }
  delete next[collectionId]
  writeCache(next)
}

/**
 * Returns an absolute og:image URL for the collection, generating the branded
 * card once and caching it. Always falls back to the static default image so
 * sharing never breaks.
 */
export async function getCollectionOgImage(collection: Collection): Promise<string> {
  const cache = readCache()
  const cached = cache[collection.id]
  if (cached) return cached

  try {
    await fontsReady()
    const canvas = drawCard(collection.title || collection.slug)
    const blob = await canvasToBlob(canvas)
    if (!blob) return DEFAULT_OG_IMAGE

    const uploaded = await uploadToStorage(collection.id, blob)
    const url = uploaded ?? DEFAULT_OG_IMAGE
    if (uploaded) {
      const next = { ...cache, [collection.id]: url }
      writeCache(next)
    }
    return url
  } catch {
    return DEFAULT_OG_IMAGE
  }
}
