/**
 * Builds the static default Open Graph image (1200x630) from a branded SVG.
 *
 * Used as the fallback og:image for every shared link. Collection-specific
 * previews are generated at runtime on the client and, when Supabase storage
 * is configured, uploaded so crawlers can read them.
 *
 * Run with: `npm run og:generate`
 */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'og-image.png',
)

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="washTeal" cx="88%" cy="8%" r="75%">
      <stop offset="0%" stop-color="#a8e5e5" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#a8e5e5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="washMint" cx="10%" cy="92%" r="68%">
      <stop offset="0%" stop-color="#d5f5c2" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#d5f5c2" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="washBlush" cx="94%" cy="90%" r="58%">
      <stop offset="0%" stop-color="#f6d0ff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#f6d0ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="envBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2a5100"/>
      <stop offset="1" stop-color="#123000"/>
    </linearGradient>
    <linearGradient id="envFlap" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#123000"/>
      <stop offset="1" stop-color="#2a5100"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#fcfaf5"/>
  <rect width="1200" height="630" fill="url(#washTeal)"/>
  <rect width="1200" height="630" fill="url(#washMint)"/>
  <rect width="1200" height="630" fill="url(#washBlush)"/>

  <!-- faint corner dots -->
  <g fill="#1a3300" opacity="0.05">
    <circle cx="80" cy="70" r="6"/><circle cx="120" cy="70" r="6"/><circle cx="160" cy="70" r="6"/>
    <circle cx="1040" cy="560" r="6"/><circle cx="1080" cy="560" r="6"/><circle cx="1120" cy="560" r="6"/>
  </g>

  <!-- floating hearts -->
  <g fill="#1a3300" opacity="0.8">
    <path d="M140 250 C 137 243 130 240 130 235 C 130 231 134 229 137 229 C 139 229 140 230 140 231 C 140 230 141 229 143 229 C 146 229 150 231 150 235 C 150 240 143 243 140 250 Z" transform="rotate(-12 140 240)"/>
    <path d="M1070 150 C 1067 143 1060 140 1060 135 C 1060 131 1064 129 1067 129 C 1069 129 1070 130 1070 131 C 1070 130 1071 129 1073 129 C 1076 129 1080 131 1080 135 C 1080 140 1073 143 1070 150 Z" transform="rotate(10 1070 140)" fill="#cb5521"/>
  </g>

  <!-- envelope -->
  <g>
    <ellipse cx="600" cy="412" rx="180" ry="16" fill="#46343b" opacity="0.08"/>
    <rect x="450" y="180" width="300" height="220" rx="18" fill="url(#envBody)"/>
    <path d="M450 180 L750 180 L600 300 Z" fill="url(#envFlap)"/>
    <rect x="450" y="300" width="300" height="100" rx="18" fill="#fffdfa" stroke="#f0e4dd"/>
    <path d="M462 390 L600 300 L738 390" fill="none" stroke="#f0e4dd" stroke-width="4" stroke-linecap="round"/>
    <circle cx="600" cy="300" r="30" fill="#1a3300" opacity="0.28"/>
    <circle cx="600" cy="300" r="26" fill="#ffe95c"/>
    <path d="M600 316 C 596.4 310.2 590 307.4 590 302.6 C 590 299.1 592.8 297 595.6 297 C 597.1 297 600 298.1 600 299.3 C 600 298.1 602.9 297 604.4 297 C 607.2 297 610 299.1 610 302.6 C 610 307.4 603.6 310.2 600 316 Z" fill="#1a3300"/>
  </g>

  <!-- wordmark -->
  <g text-anchor="middle">
    <text x="600" y="512" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="bold" fill="#1a3300" letter-spacing="-1">
      Open When Letters
    </text>
    <rect x="470" y="528" width="260" height="16" rx="8" fill="#ffe95c" opacity="0.75"/>
    <text x="600" y="582" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic" fill="#4a7030">
      Letters that wait for the right moment
    </text>
  </g>
</svg>
`

try {
  await sharp(Buffer.from(svg)).png().toFile(OUT)
  console.log(`Wrote ${OUT}`)
} catch (error) {
  console.error('Could not render the Open Graph image:', error)
  process.exit(1)
}
