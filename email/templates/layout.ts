/**
 * Shared HTML email shell — a faithful translation of the Open When Letters
 * design system into table-based, email-safe markup.
 *
 * Design tokens mirrored from src/index.css:
 *   cream/paper #fcfaf5 · forest-ink #1a3300 · ink-soft #4a7030
 *   line/mist #b6b6b6 · highlighter-yellow #ffe95c · blush #d5f5c2
 *   kraft wash #f6f1e6 · whisper-gray #f1f1f1
 *
 * Typography (fonts.css): display = Bricolage Grotesque (fallback Georgia
 * serif), body = Inter (fallback system sans), micro-labels = Roboto Mono.
 *
 * The logo is `${appUrl}/logo.png` (public/logo.png) — the same yellow-tile
 * + envelope mark as the app's navbar.
 */

export const DISPLAY_FONT =
  "'Bricolage Grotesque', 'Archivo Black', 'Arial Black', Arial, sans-serif"
export const BODY_FONT =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
export const MONO_FONT = "'Roboto Mono', 'Courier New', monospace"

const COLORS = {
  ink: '#1a3300',
  inkSoft: '#4a7030',
  line: '#b6b6b6',
  cream: '#fcfaf5',
  yellow: '#ffe95c',
  blush: '#d5f5c2',
  kraft: '#f6f1e6',
  border: '#e9e0cc',
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Highlighter-yellow accent, matching the `.highlighter-wash` utility. */
export function highlight(text: string): string {
  return `<span style="background-color:${COLORS.yellow};border-radius:3px;padding:0 4px;">${text}</span>`
}

/** Primary CTA button — bulletproof (VML for Outlook) + web-friendly. */
export function button(href: string, label: string): string {
  const style = [
    `background-color:${COLORS.ink}`,
    `border:1px solid ${COLORS.ink}`,
    'border-radius:6px',
    `color:${COLORS.cream}`,
    'display:inline-block',
    `font-family:${BODY_FONT}`,
    'font-size:15px',
    'font-weight:600',
    'letter-spacing:-0.01em',
    'line-height:46px',
    'text-align:center',
    'text-decoration:none',
    'padding:0 28px',
  ].join(';')
  const approxWidth = label.length * 9 + 56
  return `
    <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(href)}" style="height:46px;v-text-anchor:middle;width:${approxWidth}px;" arcsize="13%" stroke="f" fillcolor="${COLORS.ink}">
        <w:anchorlock/>
        <center style="color:${COLORS.cream};font-family:Arial,sans-serif;font-size:15px;font-weight:600;">${escapeHtml(label)}</center>
      </v:roundrect>
    <![endif]-->
    <a href="${escapeHtml(href)}" style="${style}">${escapeHtml(label)}</a>
  `.trim()
}

interface LayoutOptions {
  appUrl: string
  title: string
  preheader: string
  content: string
}

export function renderLayout({ appUrl, title, preheader, content }: LayoutOptions): string {
  const logoUrl = `${appUrl}/logo.png`
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
  <meta name="color-scheme" content="light">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
  <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${COLORS.kraft};-webkit-font-smoothing:antialiased;">
  <div role="article" aria-roledescription="email" aria-label="${escapeHtml(title)}" lang="en" style="background-color:${COLORS.kraft};padding:32px 16px;">
    <span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}&nbsp;&zwnj;</span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:0;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;max-width:600px;background-color:#ffffff;border:1px solid ${COLORS.border};border-radius:24px;overflow:hidden;">

            <!-- Header: logo mark + wordmark -->
            <tr>
              <td align="center" style="padding:40px 40px 0 40px;">
                <img src="${logoUrl}" width="72" height="72" alt="Open When Letters" style="display:block;border:0;outline:none;text-decoration:none;border-radius:22px;">
                <p style="margin:18px 0 0 0;font-family:${DISPLAY_FONT};font-size:22px;font-weight:800;letter-spacing:-0.02em;line-height:1.1;color:${COLORS.ink};">Open When Letters</p>
                <p style="margin:6px 0 0 0;font-family:${MONO_FONT};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.inkSoft};">Letters that wait for the right moment</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 40px 8px 40px;font-family:${BODY_FONT};font-size:15px;line-height:1.65;color:${COLORS.ink};">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px 36px 40px;border-top:1px solid ${COLORS.border};text-align:center;">
                <p style="margin:0;font-family:${BODY_FONT};font-size:12px;line-height:1.7;color:${COLORS.inkSoft};">Made with <span style="color:${COLORS.ink};">&#10084;</span> for couples who want to stay close, even when life gets busy.</p>
                <p style="margin:14px 0 0 0;font-family:${BODY_FONT};font-size:12px;line-height:1.8;color:${COLORS.line};">
                  <a href="${escapeHtml(appUrl)}/privacy" style="color:${COLORS.ink};text-decoration:underline;">Privacy Policy</a>
                  <span style="color:${COLORS.line};">&nbsp;&#183;&nbsp;</span>
                  <a href="${escapeHtml(appUrl)}/terms" style="color:${COLORS.ink};text-decoration:underline;">Terms</a>
                  <span style="color:${COLORS.line};">&nbsp;&#183;&nbsp;</span>
                  <a href="${escapeHtml(appUrl)}/faq" style="color:${COLORS.ink};text-decoration:underline;">FAQ</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`
}
