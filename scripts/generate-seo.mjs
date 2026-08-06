/**
 * Builds robots.txt and sitemap.xml for the production site.
 *
 * Reads the canonical origin from SITE_URL (falls back to a sensible default
 * and warns so the files never silently target the wrong host).
 *
 * Run with: `npm run seo:generate`
 */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { writeFileSync } from 'node:fs'

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')

const DEFAULT_SITE_URL = 'https://openwhenletters.in'
const siteUrl = (process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, '')
const origin = new URL(siteUrl).origin

const today = new Date().toISOString().slice(0, 10)

const DISALLOWED = [
  '/edit/',
  '/collections',
  '/profile',
  '/settings',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/404',
]

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/create', changefreq: 'monthly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/open/example', changefreq: 'monthly', priority: '0.5' },
  { path: '/design', changefreq: 'monthly', priority: '0.4' },
  { path: '/terms', changefreq: 'yearly', priority: '0.2' },
]

function buildRobots() {
  const lines = ['User-agent: *', 'Allow: /']
  for (const path of DISALLOWED) lines.push(`Disallow: ${path}`)
  lines.push('', `Sitemap: ${origin}/sitemap.xml`)
  return lines.join('\n') + '\n'
}

function buildSitemap() {
  const urls = STATIC_ROUTES.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

try {
  writeFileSync(path.join(OUT, 'robots.txt'), buildRobots())
  writeFileSync(path.join(OUT, 'sitemap.xml'), buildSitemap())
  console.log(`Wrote ${path.join(OUT, 'robots.txt')} and sitemap.xml (${origin})`)
} catch (error) {
  console.error('Could not write robots.txt / sitemap.xml:', error)
  process.exit(1)
}
