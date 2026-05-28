import { describe, it, expect } from 'vitest'
import {
  SITE_ORIGIN,
  BASE_PATH,
  canonical,
  asset,
  siteRoot,
  ogImage,
  videoPoster,
} from '@/lib/seo/canonicalUrl'

describe('canonicalUrl helpers', () => {
  it('SITE_ORIGIN starts with https://', () => {
    expect(SITE_ORIGIN).toMatch(/^https:\/\//)
  })

  it('BASE_PATH matches vite.config.ts', () => {
    expect(BASE_PATH).toBe('/ai-portrait-studio-site')
  })

  it('canonical(lang) returns absolute URL with base path and trailing slash', () => {
    expect(canonical('zh-Hant')).toBe(`${SITE_ORIGIN}${BASE_PATH}/zh-Hant/`)
    expect(canonical('zh-Hans')).toBe(`${SITE_ORIGIN}${BASE_PATH}/zh-Hans/`)
    expect(canonical('en')).toBe(`${SITE_ORIGIN}${BASE_PATH}/en/`)
  })

  it('siteRoot() returns base URL with trailing slash', () => {
    expect(siteRoot()).toBe(`${SITE_ORIGIN}${BASE_PATH}/`)
  })

  it('asset(path) returns absolute URL stripping leading slash if present', () => {
    expect(asset('favicon.svg')).toBe(`${SITE_ORIGIN}${BASE_PATH}/favicon.svg`)
    expect(asset('/favicon.svg')).toBe(`${SITE_ORIGIN}${BASE_PATH}/favicon.svg`)
  })

  it('ogImage(lang) returns absolute URL pointing to public/og/og-<lang>.jpg', () => {
    expect(ogImage('zh-Hant')).toBe(`${SITE_ORIGIN}${BASE_PATH}/og/og-zh-Hant.jpg`)
    expect(ogImage('en')).toBe(`${SITE_ORIGIN}${BASE_PATH}/og/og-en.jpg`)
  })

  it('videoPoster(name) returns absolute URL pointing to public/video-posters/<name>.jpg', () => {
    expect(videoPoster('tea-product-promo')).toBe(
      `${SITE_ORIGIN}${BASE_PATH}/video-posters/tea-product-promo.jpg`,
    )
  })

  it('produces URLs with no double-slash except protocol (regression guard)', () => {
    // Double-slash regression — protect against SITE_ORIGIN gaining trailing slash
    // The pattern (?<!:)\/\/ matches any `//` not preceded by `:` (excludes https://)
    const doubleSlash = /(?<!:)\/\//
    expect(asset('favicon.svg')).not.toMatch(doubleSlash)
    expect(asset('/favicon.svg')).not.toMatch(doubleSlash)
    expect(canonical('zh-Hant')).not.toMatch(doubleSlash)
    expect(siteRoot()).not.toMatch(doubleSlash)
    expect(ogImage('en')).not.toMatch(doubleSlash)
    expect(videoPoster('tea-product-promo')).not.toMatch(doubleSlash)
  })
})
