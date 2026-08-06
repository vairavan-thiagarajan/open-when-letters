/** Welcome email — sent once, right after a successful signup. */

import { button, escapeHtml, highlight, renderLayout } from './layout'

export function welcomeEmailHtml(appUrl: string, email: string): string {
  const content = `
    <p style="margin:0 0 18px 0;"><strong>Welcome.</strong> This is the beginning of something beautiful.</p>
    <p style="margin:0 0 18px 0;">Open When Letters started with a simple thought: the most important words aren&rsquo;t always spoken in the moment. Sometimes they&rsquo;re written now, folded carefully, and set aside — to be ${highlight('opened when someone needs them most')}.</p>
    <p style="margin:0 0 18px 0;">That&rsquo;s the whole idea. You write the letters today. The right moment opens them later — a hard day, a good one, or one that just needs a little love.</p>
    <p style="margin:0 0 24px 0;">Your first collection is waiting to be written. Create one, add a few letters, and share it with the person you love.</p>
    <p style="margin:0 0 28px 0;text-align:center;">${button(`${appUrl}/create`, 'Create Your First Letter')}</p>
    <p style="margin:0 0 18px 0;color:#4a7030;">The words can wait. They always do. <span style="color:#1a3300;">&#128140;</span></p>
  `
  return renderLayout({
    appUrl,
    title: 'Welcome to Open When Letters',
    preheader: `Welcome, ${escapeHtml(email)} — a warm hello and a nudge to write your first collection.`,
    content,
  })
}
