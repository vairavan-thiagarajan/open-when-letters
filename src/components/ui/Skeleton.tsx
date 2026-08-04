import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
}

/**
 * Shimmering placeholder. The sweep animation is a pure-CSS animation so the
 * global `prefers-reduced-motion` query pauses it automatically.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden className={cn('relative overflow-hidden rounded-xl bg-line/60', className)}>
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          backgroundImage:
            'linear-gradient(110deg, transparent 35%, rgb(255 253 250 / 0.85) 50%, transparent 65%)',
          backgroundSize: '220% 100%',
        }}
      />
    </div>
  )
}
