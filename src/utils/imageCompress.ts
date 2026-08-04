/**
 * Downscales + re-encodes an image before upload so letters stay light.
 *
 * Strategy:
 *  - Reads the file into an <img> to learn its natural size.
 *  - Draws it onto a canvas capped at MAX_DIM (keeps aspect ratio, never crops).
 *  - Exports as WebP when supported, falling back to JPEG — both are accepted
 *    upload formats and small enough for storage + the letters table.
 */
const MAX_DIM = 1600
const QUALITY = 0.82

export function isMemoryImage(file: File): boolean {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
}

export async function compressMemoryImage(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const image = await loadImage(url)
    const scale = Math.min(1, MAX_DIM / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas is not supported in this browser')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0, width, height)

    const useWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp')
    const type = useWebP ? 'image/webp' : 'image/jpeg'
    const blob = await canvasToBlob(canvas, type, QUALITY)
    if (!blob) throw new Error('Could not compress the image')
    return blob
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not read the image'))
    image.src = url
  })
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}
