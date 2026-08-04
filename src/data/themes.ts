/**
 * Say Briefly ships a single uniform design: cream canvas + forest ink.
 * The only "theme" variation is which pastel sticky-note accent a collection
 * features on its cards (mint, teal, blush, terracotta, or yellow).
 */

export interface AccentOption {
  id: string
  label: string
  color: string
}

export const ACCENTS: AccentOption[] = [
  { id: 'mint', label: 'Mint', color: '#d5f5c2' },
  { id: 'teal', label: 'Teal', color: '#a8e5e5' },
  { id: 'blush', label: 'Blush', color: '#f6d0ff' },
  { id: 'terracotta', label: 'Terracotta', color: '#cb5521' },
  { id: 'yellow', label: 'Yellow', color: '#ffe95c' },
]

export function accentById(id: string): AccentOption {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0]
}

/**
 * Legacy compatibility: old code used themeById().id.
 * All collections now render with the same Say Briefly palette.
 */
export function themeById(_id: string): { id: string; dark: boolean } {
  return { id: 'say-briefly', dark: false }
}
