export type FontPairId =
  | 'auto'
  | 'classic'
  | 'modern'
  | 'editorial'
  | 'romantic'
  | 'vintage'
  | 'elegant'

export interface FontPair {
  id: FontPairId
  label: string
  serif: string
  sans: string
  hand: string
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: 'auto',
    label: 'Follow theme',
    serif: '',
    sans: '',
    hand: '',
  },
  {
    id: 'classic',
    label: 'Classic',
    serif: '"Cormorant Garamond Variable", Georgia, serif',
    sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    hand: '"Caveat Variable", "Comic Sans MS", cursive',
  },
  {
    id: 'modern',
    label: 'Modern',
    serif: '"Playfair Display Variable", Georgia, serif',
    sans: '"DM Sans Variable", ui-sans-serif, system-ui, sans-serif',
    hand: '"Caveat Variable", "Comic Sans MS", cursive',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    serif: '"Libre Baskerville", Georgia, serif',
    sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    hand: '"Caveat Variable", "Comic Sans MS", cursive',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    serif: '"Cormorant Garamond Variable", Georgia, serif',
    sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    hand: '"Great Vibes", "Snell Roundhand", cursive',
  },
  {
    id: 'vintage',
    label: 'Vintage',
    serif: '"Libre Baskerville", Georgia, serif',
    sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    hand: '"Great Vibes", "Snell Roundhand", cursive',
  },
  {
    id: 'elegant',
    label: 'Elegant',
    serif: '"Playfair Display Variable", Georgia, serif',
    sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    hand: '"Great Vibes", "Snell Roundhand", cursive',
  },
]

export function fontPairById(id: string): FontPair {
  return FONT_PAIRS.find((pair) => pair.id === id) ?? FONT_PAIRS[0]
}
