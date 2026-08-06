/** "Collection shared" email — sent when someone shares a collection with a friend. */

import { button, escapeHtml, renderLayout } from './layout'

interface SharedCollectionEmailData {
  appUrl: string
  /** Public URL path to the collection, e.g. /open/our-adventure. */
  slug: string
  /** Title of the shared collection (for warmth + the alt context). */
  collectionTitle: string
  /** Optional personal note from the sender. */
  note?: string
}

export function sharedCollectionEmailHtml(data: SharedCollectionEmailData): string {
  const collectionUrl = `${data.appUrl}/open/${encodeURIComponent(data.slug)}`
  const noteBlock = data.note
    ? `<p style="margin:0 0 24px 0;border-left:3px solid #ffe95c;padding:2px 0 2px 16px;color:#4a7030;">A note from the sender: <em>&ldquo;${escapeHtml(data.note)}&rdquo;</em></p>`
    : ''

  const content = `
    <p style="margin:0 0 18px 0;">Hi there,</p>
    <p style="margin:0 0 18px 0;">Someone who loves you has written you a collection of <strong>Open When Letters</strong>${data.collectionTitle ? ` — <em>&ldquo;${escapeHtml(data.collectionTitle)}&rdquo;</em>` : ''}.</p>
    <p style="margin:0 0 18px 0;">They&rsquo;ve prepared a set of letters, each one for a different kind of moment. Some are for a hard day. Some are for a good one. And one or two might just be because they were thinking of you.</p>
    <p style="margin:0 0 18px 0;">All of them are waiting for you behind the link below.</p>
    ${noteBlock}
    <p style="margin:0 0 28px 0;text-align:center;">${button(collectionUrl, 'Open Your Letters')}</p>
    <p style="margin:0 0 18px 0;color:#4a7030;">Letters that wait for the right moment. <span style="color:#1a3300;">&#128140;</span></p>
  `

  return renderLayout({
    appUrl: data.appUrl,
    title: 'Someone wrote Open When Letters for you',
    preheader: `${data.collectionTitle ? `${data.collectionTitle} — ` : ''}a collection of letters, waiting for the right moment.`,
    content,
  })
}
