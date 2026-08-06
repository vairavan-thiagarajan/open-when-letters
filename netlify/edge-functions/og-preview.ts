/**
 * Link-preview crawler handler for /open/:slug.
 *
 * WhatsApp, Discord, Telegram, X, iMessage and friends do not execute
 * JavaScript, so a shared collection link would otherwise show only the
 * site-wide defaults baked into index.html. This edge function intercepts
 * crawler requests, looks the collection up in Supabase, and returns the SPA
 * shell with the real title, description and Open Graph tags injected.
 *
 * Real browsers fall straight through to the normal SPA via context.next().
 * Mapped to "/open/*" in netlify.toml.
 *
 * Environment variables (set in the Netlify dashboard):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 */

type Context = { next: () => Promise<Response> }

interface CollectionMeta {
  title: string
  description: string
  /** Absolute or root-relative og:image URL. */
  ogImage: string
}

const DEFAULT_OG_IMAGE = '/og-image.png'

/** The built-in example collection lives in code, not the database. */
const EXAMPLE_COLLECTION: CollectionMeta = {
  title: 'To the love of my life',
  description:
    'A sample collection to show you how Open When Letters works. Six letters, each written for a different kind of moment. Open a few, see how it feels, then write your own.',
  ogImage: DEFAULT_OG_IMAGE,
}

const CRAWLER_PATTERN =
  /(facebookexternalhit|facebot|twitterbot|whatsapp|telegrambot|discordbot|slackbot|slack-imgproxy|linkedinbot|applebot|viber|vkshare|skypeuripreview|pinterestbot|redditbot|snapchat|tumblr|flipboard|nuzzel|quora|embedly|outbrain|mixrankbot|bitlybot|tweetmemebot|rogerbot|femtosearchbot|showyoubot|googlebot|bingbot|baiduspider|yandexbot|duckduckbot|slurp|ia_archiver|semrushbot|ahrefsbot|meta-externalagent|w3c_validator|curl|wget|python-requests|axios|node-fetch)/i

function isCrawler(userAgent: string): boolean {
  if (!userAgent) return false
  if (CRAWLER_PATTERN.test(userAgent)) return true
  if (/\b(bot|crawler|spider|preview|scraper)\b/i.test(userAgent)) {
    // Headless browsers are still browsers — a real person may be driving them.
    if (/headless|phantomjs|puppeteer|playwright|selenium/i.test(userAgent)) return false
    return true
  }
  return false
}

async function fetchCollectionMeta(slug: string): Promise<CollectionMeta | null> {
  if (slug === 'example') return EXAMPLE_COLLECTION

  const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')
  const supabaseKey = Deno.env.get('VITE_SUPABASE_ANON_KEY')
  if (!supabaseUrl || !supabaseKey) return null

  const endpoint =
    `${supabaseUrl}/rest/v1/collections?slug=eq.${encodeURIComponent(slug)}` +
    '&select=id,title,description&visibility=eq.public'

  try {
    const response = await fetch(endpoint, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return null
    const rows = (await response.json()) as
      | Array<{ id: string; title: string; description: string }>
      | null
    const row = Array.isArray(rows) ? rows[0] : null
    if (!row) return null

    return {
      title: row.title || 'A collection of open when letters',
      description:
        row.description || 'A collection of letters to open at just the right moment.',
      ogImage: `${supabaseUrl}/storage/v1/object/public/og-images/${row.id}.png`,
    }
  } catch {
    return null
  }
}

async function exists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(1500) })
    return response.ok
  } catch {
    return false
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHeadTags(meta: CollectionMeta, pageUrl: string, ogImage: string): string {
  const title = `${meta.title} · Open When Letters`
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Open When Letters" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`,
  ].join('\n    ')
}

/** Rewrites the default head (from index.html) with the collection's meta. */
function injectMeta(html: string, tags: string): string {
  let out = html
  out = out.replace(/<title>[\s\S]*?<\/title>/i, '')
  out = out.replace(
    /<meta[^>]+?(?:name|property)="(?:description|og:[^"]*|twitter:[^"]*)"[^>]*>/gi,
    '',
  )
  out = out.replace(/<link[^>]+?rel="canonical"[^>]*>/gi, '')
  return out.replace('<head>', `<head>\n    ${tags}`)
}

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response> {
  const userAgent = request.headers.get('user-agent') ?? ''
  if (!isCrawler(userAgent)) return context.next()

  const url = new URL(request.url)
  const slugMatch = url.pathname.match(/^\/open\/([^/]+)/)
  if (!slugMatch) return context.next()

  const collection = await fetchCollectionMeta(decodeURIComponent(slugMatch[1]))
  if (!collection) return context.next()

  let ogImage = collection.ogImage
  if (ogImage === DEFAULT_OG_IMAGE || !(await exists(ogImage))) {
    ogImage = new URL(DEFAULT_OG_IMAGE, url.origin).href
  }

  const shell = await fetch(`${url.origin}/index.html`, {
    signal: AbortSignal.timeout(3000),
  })
  if (!shell.ok) return context.next()

  const html = await shell.text()

  return new Response(injectMeta(html, buildHeadTags(collection, url.href, ogImage)), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
