import type { CSSProperties } from 'react'

/**
 * Say Briefly uses a single uniform palette — no per-collection CSS variable
 * overrides. The base @theme tokens in index.css are the design.
 */
export function collectionThemeStyle(): CSSProperties {
  return {}
}
