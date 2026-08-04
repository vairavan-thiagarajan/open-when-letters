/**
 * Say Briefly ships one uniform cover: cream canvas with a soft warm edge.
 * Per-collection cover colours were removed — everything uses the design colour.
 */

export const COVERS: Array<{
  id: number
  name: string
  from: string
  to: string
  swatch: string
}> = [
  { id: 0, name: 'Cream', from: '#fcfaf5', to: '#f0efe8', swatch: 'linear-gradient(135deg,#fcfaf5,#f0efe8)' },
]

export function coverGradient(_id: number): string {
  return COVERS[0].swatch
}
