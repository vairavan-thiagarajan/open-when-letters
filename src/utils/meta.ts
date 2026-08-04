import { useEffect } from 'react'

/**
 * Client-side SEO manager for the SPA.
 *
 * Keeps the document head in sync with the active route: dynamic title, meta
 * description, canonical URL, robots directives, theme colour, Open Graph,
 * Twitter card, and structured data (JSON-LD).
 *
 * Note: link-preview crawlers (WhatsApp, Discord, X, …) do not run JavaScript,
 * so the static <head> in index.html carries the site-wide defaults. This
 * module refines the metadata for crawlers that execute JS and for users
 * who inspect the live document.
 */

export interface PageMeta {
  /** Full document title. */
  title: string
  /** Meta description (ideally 120–160 characters). */
  description: string
  /** Route path used to build the canonical + og:url (absolute). */
  path: string
  /** Exclude the page from search engine indexes (auth/account pages). */
  noindex?: boolean
  /** Open Graph / Twitter overrides. */
  og?: {
    title?: string
    description?: string
    /** Absolute image URL. Defaults to the branded /og-image.png. */
    image?: string
    type?: 'website' | 'article'
  }
  /** Structured data emitted as a single application/ld+json node. */
  jsonLd?: object | object[]
}

const SITE_NAME = 'Open When Letters'
const DEFAULT_IMAGE = '/og-image.png'

export function absoluteUrl(path: string): string {
  return new URL(path, window.location.origin).toString()
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelectorAll(`meta[${attr}="${key}"]`).forEach((el) => el.remove())
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(data: object | object[]) {
  let node = document.head.querySelector<HTMLScriptElement>('script[data-ow-jsonld]')
  if (!node) {
    node = document.createElement('script')
    node.type = 'application/ld+json'
    node.setAttribute('data-ow-jsonld', '')
    document.head.appendChild(node)
  }
  node.textContent = JSON.stringify(data)
}

function removeJsonLd() {
  document.head.querySelectorAll('script[data-ow-jsonld]').forEach((el) => el.remove())
}

/** Applies the full set of head metadata for the current page. */
export function setPageMeta(meta: PageMeta) {
  document.title = meta.title

  setMeta('name', 'description', meta.description)
  setMeta('property', 'og:title', meta.og?.title ?? meta.title)
  setMeta('property', 'og:description', meta.og?.description ?? meta.description)
  setMeta('property', 'og:type', meta.og?.type ?? 'website')
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:locale', 'en_US')

  const image = meta.og?.image ?? DEFAULT_IMAGE
  setMeta('property', 'og:image', absoluteUrl(image))
  setMeta('name', 'twitter:image', absoluteUrl(image))

  const canonical = absoluteUrl(meta.path)
  setLink('canonical', canonical)
  setMeta('property', 'og:url', canonical)

  setMeta(
    'name',
    'twitter:card',
    'summary_large_image',
  )
  setMeta('name', 'twitter:site', '@openwhenletters')
  setMeta('name', 'twitter:title', meta.og?.title ?? meta.title)
  setMeta('name', 'twitter:description', meta.og?.description ?? meta.description)

  if (meta.noindex) {
    setMeta('name', 'robots', 'noindex, nofollow')
  } else {
    removeMeta('name', 'robots')
  }

  if (meta.jsonLd) {
    setJsonLd(meta.jsonLd)
  } else {
    removeJsonLd()
  }
}

/** Convenience hook — applies metadata whenever it changes. */
export function usePageMeta(meta: PageMeta) {
  const serialized = JSON.stringify(meta)
  useEffect(() => {
    setPageMeta(JSON.parse(serialized))
    return () => removeJsonLd()
  }, [serialized])
}
