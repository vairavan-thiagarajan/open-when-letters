import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Say Briefly is a single uniform design. This wrapper exists for
 * structural consistency and future per-collection accent support.
 */
export function ThemedSurface({
  collection: _collection,
  className,
  children,
}: {
  collection?: { theme?: string; primaryColor?: string; accentColor?: string }
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn('min-h-screen', className)}
    >
      {children}
    </div>
  )
}
