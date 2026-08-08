import type { Collection, CollectionLetter } from '@/services/types'

/**
 * The built-in example collection, always reachable at /open/example.
 *
 * It's an ordinary `Collection` + six ordinary `CollectionLetter`s, so the
 * whole reading experience (cards, envelope, paper, studio styling) is exactly
 * the production one. It lives in code instead of the database so the demo can
 * never be deleted or break — a shortcut inside the services returns it before
 * any database query runs.
 */
export const EXAMPLE_COLLECTION: Collection = {
  id: 'example-collection',
  slug: 'example',
  title: 'To the love of my life',
  description:
    'A sample collection to show you how Open When Letters works. Six letters, each written for a different kind of moment. Open a few, see how it feels, then write your own.',
  coverImage: 1,
  theme: 'say-briefly',
  editToken: 'example-collection-token',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  primaryColor: '',
  accentColor: '',
  fontPair: 'auto',
  passwordHash: '',
  musicUrl: '',
  visibility: 'public',
  from: 'Your person',
  userId: null,
}

export const EXAMPLE_LETTERS: CollectionLetter[] = [
  {
    id: 'example-bad-day',
    collectionId: EXAMPLE_COLLECTION.id,
    title: 'You\u2019re Having a Bad Day',
    trigger: 'For the days when everything feels a little heavier than it should.',
    body: `Dear you,

I don\u2019t know exactly what today took from you \u2014 but I know it took something. I can hear it in the way you keep saying you\u2019re *fine*.

# A quiet reminder

You have outlasted every hard day you have ever lived. This one will not be the first to beat you.

So take a breath. Drink something warm. Let the world wait for a while. And when you are ready, remember the small things that are still true: someone is glad you exist, and this letter was written *just for you*.

---
With love,
The person who wrote this letter`,
    coverImage: 1,
    position: 0,
    createdAt: '2026-01-05T10:00:00.000Z',
    unlockType: 'immediate',
    unlockAt: null,
    font: 'caveat',
    background: 'preset:blush-wash',
    stickers: [],
    photos: [],
  },
  {
    id: 'example-miss-me',
    collectionId: EXAMPLE_COLLECTION.id,
    title: 'You Miss Me',
    trigger: 'For the times you wish I was right there beside you.',
    body: `Dear you,

I\u2019m not there right now \u2014 but I\u2019ve been thinking of you, and I wanted you to know that.

# Right here

Missing someone is just love with nowhere to sit yet. It settles again the moment we talk, or the moment you read this.

Until then, keep a little corner of your day for me. I\u2019m keeping one for you. We\u2019ll fill them both up soon.

---
Still here,
The one who misses you back`,
    coverImage: 2,
    position: 1,
    createdAt: '2026-01-06T10:00:00.000Z',
    unlockType: 'immediate',
    unlockAt: null,
    font: 'dancing-script',
    background: 'preset:teal-wash',
    stickers: [],
    photos: [],
  },
  {
    id: 'example-doubt',
    collectionId: EXAMPLE_COLLECTION.id,
    title: 'You Doubt Yourself',
    trigger: 'For the moments when your head whispers that you\u2019re not enough.',
    body: `Dear you,

That voice in your head? It is not the truth. It is just loud.

# What is true

You are more capable than you feel today. You have carried yourself this far \u2014 through things that would have stopped someone else.

Doubt is allowed to visit. It just is not allowed to stay, or to decide what you are worth.

---
With love,
Someone who believes in you`,
    coverImage: 3,
    position: 2,
    createdAt: '2026-01-07T10:00:00.000Z',
    unlockType: 'immediate',
    unlockAt: null,
    font: 'shadows-into-light',
    background: 'preset:forest-mist',
    stickers: [],
    photos: [],
  },
  {
    id: 'example-sleep',
    collectionId: EXAMPLE_COLLECTION.id,
    title: 'You Can\u2019t Sleep',
    trigger: 'For the nights when the world is quiet and your mind isn\u2019t.',
    body: `Dear you,

It is late, and everything feels bigger at 2am. It is not. It is the same as it will look in the morning \u2014 just with softer light.

# Settle here

Put your phone down. Let your shoulders drop. Your thoughts can wait; they are not going anywhere.

Tomorrow will still have all of your hours. Tonight, you only owe yourself rest.

---
Sleep tight,
Thinking of you`,
    coverImage: 4,
    position: 3,
    createdAt: '2026-01-08T10:00:00.000Z',
    unlockType: 'immediate',
    unlockAt: null,
    font: 'lora',
    background: 'preset:dusk-lavender',
    stickers: [],
    photos: [],
  },
  {
    id: 'example-loved',
    collectionId: EXAMPLE_COLLECTION.id,
    title: 'You Need a Reminder You\u2019re Loved',
    trigger: 'For the times you forget how much you matter.',
    body: `Dear you,

Somewhere along the way you forgot \u2014 so here is your reminder.

# You are loved

Not for what you do, but for who you are. Someone\u2019s whole day changes when they hear from you. Someone carries your words in their pocket.

If today you feel invisible, read this twice. You are seen. You are wanted. You are loved.

---
Forever,
All my love`,
    coverImage: 5,
    position: 4,
    createdAt: '2026-01-09T10:00:00.000Z',
    unlockType: 'immediate',
    unlockAt: null,
    font: 'great-vibes',
    background: 'preset:blush-wash',
    stickers: [],
    photos: [],
  },
  {
    id: 'example-win',
    collectionId: EXAMPLE_COLLECTION.id,
    title: 'You Did Something Great',
    trigger: 'For the wins \u2014 big and small \u2014 that deserve a little celebration.',
    body: `Dear you,

Stop scrolling and sit with this for a second. You did that. *You.*

# Worth celebrating

Whether it felt big or small to you, it matters. Growth is just a series of small wins you did not notice adding up.

So celebrate \u2014 loudly, quietly, however feels like you. I\u2019m proud of you, and I hope you are a little proud of yourself too.

---
Cheers to you,
With love`,
    coverImage: 6,
    position: 5,
    createdAt: '2026-01-10T10:00:00.000Z',
    unlockType: 'immediate',
    unlockAt: null,
    font: 'kalam',
    background: 'preset:sunshine-whisper',
    stickers: [],
    photos: [],
  },
]
