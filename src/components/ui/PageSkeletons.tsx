import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

/**
 * Premium skeleton loaders. Every loader mirrors the resting layout of its
 * page (same containers, spacing and proportions) so the swap from loading to
 * loaded never shifts the layout. Sweeping shimmer comes from <Skeleton/>.
 */

function Bars({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn('space-y-2.5', className)} aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-3.5 rounded-full', index === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  )
}

function Kicker({ className }: { className?: string }) {
  return <Skeleton className={cn('h-3.5 w-24 rounded-full', className)} />
}

function Title({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-64 rounded-2xl sm:h-12 sm:w-80', className)} />
}

function PageHead({ centered = false }: { centered?: boolean }) {
  return (
    <div className={cn('space-y-4', centered && 'flex flex-col items-center')} aria-hidden>
      <Kicker />
      <Title />
      <Skeleton className="h-4 w-full max-w-sm rounded-full" />
    </div>
  )
}

/** Generic full-screen fallback used by lazy route loading. */
export function RouteFallback({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      <div className="mx-auto w-full max-w-6xl flex-1 px-5 pt-28 pb-16 sm:px-8 sm:pt-32">
        <PageHead />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Centered card layout — used by the auth pages. */
export function AuthPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md" aria-hidden>
        <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-8 w-48 rounded-2xl" />
          <Skeleton className="h-4 w-64 rounded-full" />
        </div>
        <Skeleton className="mt-10 h-96 w-full rounded-[2rem]" />
      </div>
    </div>
  )
}

/** Dashboard / Profile / Settings account pages. */
export function AccountPageSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
      <PageHead />
      <div className="mt-10 space-y-5" aria-hidden>
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-[2rem]" />
        ))}
      </div>
    </div>
  )
}

/** Collection card grid — used while the collections list loads. Mirrors
    the manila-folder CollectionFileCard: tab, eyebrow, title, description,
    then a row of pill actions. */
export function CollectionsGridSkeleton() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col rounded-[1.25rem] border border-[#d9bf8a]/60 pt-8 shadow-[0_18px_40px_-22px_rgba(74,52,20,0.45)]"
          style={{
            background:
              'linear-gradient(160deg, #f4e5b8 0%, #ecd9a5 55%, #e0c88e 100%)',
          }}
        >
          <div className="absolute -top-[9px] right-[10%]">
            <Skeleton className="h-[18px] w-24 rounded-t-md rounded-b-none" />
          </div>
          <div className="flex flex-1 flex-col px-6 pb-6 text-center">
            <Skeleton className="mx-auto h-3 w-24 rounded-full" />
            <Skeleton className="mx-auto mt-4 h-7 w-3/4 rounded-xl" />
            <Skeleton className="mx-auto mt-3 h-3.5 w-2/3 rounded-full" />
            <Skeleton className="mx-auto mt-2 h-3.5 w-1/2 rounded-full" />
            <div className="mt-auto flex justify-center gap-2 pt-6">
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Full-page collections skeleton (lazy route fallback). */
export function CollectionsPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
      <PageHead />
      <CollectionsGridSkeleton />
    </div>
  )
}

/** A single letter card inside a collection grid. */
export function LetterCardSkeleton() {
  return (
    <div className="flex h-full flex-col p-2" aria-hidden>
      <Skeleton className="aspect-[10/7] w-full rounded-xl" />
      <Skeleton className="mx-auto mt-3 h-3.5 w-28 rounded-full" />
    </div>
  )
}

/** Shared collection page — clean hero + letter grid. */
export function CollectionPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-28 pb-16 sm:px-8 sm:pt-32">
      <div className="flex flex-col items-center text-center" aria-hidden>
        <Skeleton className="h-24 w-24 rounded-2xl sm:h-28 sm:w-28" />
        <Skeleton className="mt-7 h-10 w-2/3 rounded-2xl sm:h-14 sm:w-96" />
        <Skeleton className="mt-4 h-4 w-full max-w-md rounded-full" />
        <Skeleton className="mt-6 h-11 w-28 rounded-full" />
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LetterCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

/** Letter reader — a real A4-style paper sheet while the reader chunk loads. */
export function LetterReaderSkeleton() {
  return (
    <div
      className="relative mx-auto w-full max-w-[520px] px-4 pt-4 sm:max-w-[640px] sm:px-6 lg:max-w-[820px]"
      aria-hidden
    >
      <div className="letter-sheet relative aspect-[210/297] w-full overflow-hidden rounded-sm px-7 py-12 sm:px-16 sm:py-16 lg:px-20">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="mt-5 h-10 w-3/4 rounded-2xl sm:h-16 sm:w-96" />
          <Skeleton className="mt-4 h-3.5 w-40 rounded-full" />
        </div>
        <div className="mx-auto my-8 flex w-full max-w-xs items-center gap-4">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-px flex-1" />
        </div>
        <div className="space-y-5">
          <Bars lines={3} />
          <Bars lines={4} />
          <Bars lines={2} />
        </div>
      </div>
    </div>
  )
}

/** Letter builder. */
export function BuilderPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between" aria-hidden>
        <div className="flex-1">
          <Kicker />
          <Skeleton className="mt-3 h-11 w-3/4 rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-44 rounded-full" />
        </div>
      </div>

      <Skeleton className="mt-6 h-44 w-full rounded-xl" />

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40 rounded-xl" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="mt-5 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
