import { describe, it, expect } from 'vitest'
import { injectSeoMeta } from '../../scripts/inject-seo-meta'

const SAMPLE_HTML = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>Old Title</title>
    <meta name="description" content="Old desc" />
    <meta property="og:title" content="Old og" />
    <meta property="og:image" content="https://old.example/img.jpg" />
    <link rel="canonical" href="https://old.example/" />
  </head>
  <body><div id="root"><main>App</main></div></body>
</html>`

describe('injectSeoMeta', () => {
  it('removes all old meta and inserts new for zh-Hant', () => {
    const out = injectSeoMeta(SAMPLE_HTML, 'zh-Hant', {
      'tea-product-promo': 'tea-product-promo-abc123.mp4',
      'automotive-kv-promo': 'automotive-kv-promo-def456.mp4',
    })
    // Old title removed
    expect(out).not.toMatch(/<title>Old Title<\/title>/)
    // New title present with zh-Hant text
    expect(out).toMatch(/<title>.*AI 人像工作室.*<\/title>/)
    // Old og:title removed
    expect(out).not.toContain('Old og')
    // New og:url with zh-Hant path
    expect(out).toMatch(/og:url"\s+content="https:\/\/.*\/zh-Hant\/"/)
    // hreflang 4 alternates
    expect(out).toMatch(/hreflang="zh-Hant"/)
    expect(out).toMatch(/hreflang="zh-Hans"/)
    expect(out).toMatch(/hreflang="en"/)
    expect(out).toMatch(/hreflang="x-default"/)
    // JSON-LD ProfessionalService injected
    expect(out).toMatch(/<script type="application\/ld\+json">[^<]*"@type":\s*"ProfessionalService"/)
    // JSON-LD VideoObject × 2 injected with hashed mp4 names
    expect(out).toContain('tea-product-promo-abc123.mp4')
    expect(out).toContain('automotive-kv-promo-def456.mp4')
    // <html lang> updated
    expect(out).toMatch(/<html lang="zh-Hant"/)
  })

  it('injects different lang attribute for zh-Hans', () => {
    const out = injectSeoMeta(SAMPLE_HTML, 'zh-Hans', {
      'tea-product-promo': 'tea-product-promo-abc123.mp4',
      'automotive-kv-promo': 'automotive-kv-promo-def456.mp4',
    })
    expect(out).toMatch(/<html lang="zh-Hans"/)
    expect(out).toMatch(/og:locale"\s+content="zh_CN"/)
  })

  it('injects en lang attribute', () => {
    const out = injectSeoMeta(SAMPLE_HTML, 'en', {
      'tea-product-promo': 'tea-product-promo-abc123.mp4',
      'automotive-kv-promo': 'automotive-kv-promo-def456.mp4',
    })
    expect(out).toMatch(/<html lang="en"/)
    expect(out).toMatch(/og:locale"\s+content="en_US"/)
  })
})
