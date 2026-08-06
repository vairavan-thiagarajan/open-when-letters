/**
 * Builds the square logo mark (192x192 — the 96px navbar mark at 2x) used in
 * email headers and anywhere a crisp standalone logo is needed.
 *
 * The geometry mirrors `drawLogo()` in src/utils/ogImage.ts so the mark is
 * always identical to the one in the app's navbar.
 *
 * Run with: `npm run logo:generate`
 */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'logo.png',
)

const SIZE = 192
const S = SIZE / 24

const svg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${SIZE}" height="${SIZE}" rx="${SIZE * 0.3}" fill="#ffe95c"/>
  <rect x="${2.5 * S}" y="${5 * S}" width="${19 * S}" height="${14 * S}" rx="${3.5 * S}" fill="#1a3300"/>
  <path d="M${4 * S} ${8 * S} L${12 * S} ${13.5 * S} L${20 * S} ${8 * S}" fill="none" stroke="#fcfaf5" stroke-width="${2 * S}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

try {
  await sharp(Buffer.from(svg)).png().toFile(OUT)
  console.log(`Wrote ${OUT}`)
} catch (error) {
  console.error('Could not render the logo mark:', error)
  process.exit(1)
}
