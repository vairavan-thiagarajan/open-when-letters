import type { CollectionLetter, UnlockType } from '@/services/types'

export interface UnlockWindow {
  /** The moment the letter becomes open, or null when it is always open. */
  target: Date | null
  unlocked: boolean
  /** Human label for the schedule, e.g. "Every year on 4 Aug". */
  label: string
}

export const UNLOCK_META: Record<
  UnlockType,
  { label: string; hint: string; badge: string }
> = {
  immediate: {
    label: 'Any time',
    hint: 'Open whenever the moment is right',
    badge: 'Open',
  },
  date: {
    label: 'On a date',
    hint: 'Opens at a specific date and time',
    badge: 'Locked',
  },
  birthday: {
    label: 'Their birthday',
    hint: 'Opens each year on this date',
    badge: 'Birthday',
  },
  anniversary: {
    label: 'Your anniversary',
    hint: 'Opens each year on this date',
    badge: 'Anniversary',
  },
}

function monthDay(dateString: string): { month: number; day: number } {
  const parsed = new Date(dateString)
  if (!Number.isNaN(parsed.getTime())) {
    return { month: parsed.getMonth(), day: parsed.getDate() }
  }
  const parts = dateString.split('-').map(Number)
  return { month: parts[1] - 1, day: parts[2] }
}

/** Formats a stored unlock_at value for display ("4 Aug", "Aug 4, 2026"). */
export function formatUnlockDate(unlockAt: string, type: UnlockType): string {
  const date = new Date(unlockAt)
  const long = date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  })
  if (type === 'date') {
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }
  return `Every year on ${long}`
}

/**
 * Computes whether a letter is open right now and when it opens next.
 * - immediate: always open.
 * - date: opens once, at unlockAt, stays open.
 * - birthday/anniversary: re-opens each year on the stored month/day.
 */
export function getUnlockWindow(
  letter: Pick<CollectionLetter, 'unlockType' | 'unlockAt'>,
  now: Date = new Date(),
): UnlockWindow {
  const { unlockType, unlockAt } = letter

  if (unlockType === 'immediate' || !unlockAt) {
    return { target: null, unlocked: true, label: UNLOCK_META.immediate.label }
  }

  if (unlockType === 'date') {
    const target = new Date(unlockAt)
    return {
      target,
      unlocked: now.getTime() >= target.getTime(),
      label: formatUnlockDate(unlockAt, 'date'),
    }
  }

  const { month, day } = monthDay(unlockAt)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  let target = new Date(now.getFullYear(), month, day, 0, 0, 0, 0)
  if (target.getTime() < today.getTime()) {
    target.setFullYear(target.getFullYear() + 1)
  }
  return {
    target,
    unlocked: target.getTime() === today.getTime(),
    label: formatUnlockDate(unlockAt, unlockType),
  }
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function countdownParts(target: Date, now: Date = new Date()): CountdownParts {
  const diff = Math.max(0, target.getTime() - now.getTime())
  const seconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  }
}

/** Compact label for locked cards, e.g. "in 3d 14h" or "on 4 Aug". */
export function countdownLabel(target: Date, now: Date = new Date()): string {
  const parts = countdownParts(target, now)
  if (parts.days > 0) return `in ${parts.days}d ${parts.hours}h`
  if (parts.hours > 0) return `in ${parts.hours}h ${parts.minutes}m`
  if (parts.minutes > 0) return `in ${parts.minutes}m`
  return `in ${Math.max(1, parts.seconds)}s`
}
