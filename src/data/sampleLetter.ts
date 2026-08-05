import type { CollectionLetter } from '@/services/types'

/**
 * A real sample letter used by the homepage "Experience It Yourself" section.
 *
 * It's an ordinary `CollectionLetter`, so it flows through the exact same
 * reading system as any letter the product produces — the envelope opening,
 * paper extraction, reading view and closing animation are the production
 * ones, not a demo clone.
 */
export const SAMPLE_LETTER: CollectionLetter = {
  id: 'sample-bad-day',
  collectionId: 'sample-experience',
  title: "You're Having A Bad Day",
  trigger: 'For the days when everything feels a little heavier.',
  body: `Dear you,

I don't know exactly what today took from you — but I know it took something. I can hear it in the way you keep saying you're *fine*.

# A quiet reminder

You have outlasted every hard day you have ever lived. This one will not be the first to beat you.

So take a breath. Drink something warm. Let the world wait for a while. And when you are ready, remember the small things that are still true: someone is glad you exist, and this letter was written *just for you*.

---
With love,
Someone who cares about you`,
  coverImage: 0,
  position: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  unlockType: 'immediate',
  unlockAt: null,
  font: 'caveat',
  background: 'preset:blush-wash',
  stickers: [
    { id: 'sample-tulip', emoji: '🌷', x: 14, y: 86, scale: 1.1, rotation: 6 },
    { id: 'sample-heart', emoji: '💛', x: 84, y: 88, scale: 1.15, rotation: -8 },
  ],
  photos: [],
  audioUrl: '',
}
