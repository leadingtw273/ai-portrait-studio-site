// scripts/inject-seo-meta.ts
import { parse } from 'node-html-parser'
import { SEO_META } from '../src/lib/seo/meta'
import { canonical, ogImage } from '../src/lib/seo/canonicalUrl'
import { buildProfessionalServiceJsonLd, buildVideoObjectJsonLd } from '../src/lib/seo/jsonld'
import type { Lang } from '../src/i18n/LanguageProvider'

const LANGS: readonly Lang[] = ['zh-Hant', 'zh-Hans', 'en']

const GOATCOUNTER_TRACKING_URL = 'https://ai-portrait-studio.goatcounter.com/count'

export type VideoFileMap = {
  'tea-product-promo': string
  'automotive-kv-promo': string
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildHreflangLinks(): string {
  const lines: string[] = []
  for (const lang of LANGS) {
    lines.push(`<link rel="alternate" hreflang="${lang}" href="${canonical(lang)}" />`)
  }
  lines.push(`<link rel="alternate" hreflang="x-default" href="${canonical('zh-Hant')}" />`)
  return lines.join('\n    ')
}

function buildVideoObjectsJsonLd(videoFiles: VideoFileMap): string {
  const blocks = [
    buildVideoObjectJsonLd({
      name: 'tea-product-promo',
      title: '產品宣傳短片 — AI 人臉 × 茶園實景',
      description: '品牌代言視覺：AI 人臉 × 茶園實景 × 產品手持',
      mp4FileName: videoFiles['tea-product-promo'],
    }),
    buildVideoObjectJsonLd({
      name: 'automotive-kv-promo',
      title: '品牌 KV 概念片 — AI 人物 × 汽車 KV',
      description: '電影分鏡敘事：AI 人物 × 汽車 KV × 多鏡頭剪輯',
      mp4FileName: videoFiles['automotive-kv-promo'],
    }),
  ]
  return blocks
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b, null, 2)}</script>`)
    .join('\n    ')
}

export function injectSeoMeta(html: string, lang: Lang, videoFiles: VideoFileMap): string {
  const root = parse(html)
  const head = root.querySelector('head')
  const htmlEl = root.querySelector('html')
  if (!head || !htmlEl) throw new Error('inject-seo-meta: <head> or <html> not found')

  // 1. <html lang>
  htmlEl.setAttribute('lang', lang)

  // 2. Remove old meta (use querySelectorAll + filter for prefix selectors as fallback)
  head.querySelectorAll('title').forEach((el) => el.remove())
  head.querySelectorAll('meta[name="description"]').forEach((el) => el.remove())
  head.querySelectorAll('meta[name="keywords"]').forEach((el) => el.remove())
  head.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove())
  // Prefix selectors — use filter for portability (some node-html-parser versions don't support [^=])
  head.querySelectorAll('meta').forEach((el) => {
    const prop = el.getAttribute('property')
    const name = el.getAttribute('name')
    if (prop?.startsWith('og:')) el.remove()
    if (name?.startsWith('twitter:')) el.remove()
  })
  head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove())
  head.querySelectorAll('link[rel="alternate"]').forEach((el) => {
    if (el.getAttribute('hreflang')) el.remove()
  })
  head.querySelectorAll('script').forEach((el) => {
    if (el.getAttribute('type') === 'application/ld+json') el.remove()
    if (el.getAttribute('data-goatcounter') !== null) el.remove()
  })

  // 3. Build new head fragment
  const meta = SEO_META[lang]
  const url = canonical(lang)
  const ogImg = ogImage(lang)
  const altLocales = LANGS.filter((l) => l !== lang)
    .map((l) => `<meta property="og:locale:alternate" content="${SEO_META[l].ogLocale}" />`)
    .join('\n    ')

  const newHead = `
    <title>${meta.title}</title>
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <meta name="keywords" content="${escapeAttr(meta.keywords)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />
    <meta property="og:description" content="${escapeAttr(meta.ogDescription)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImg}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="${escapeAttr(meta.ogTitle)}" />
    <meta property="og:locale" content="${meta.ogLocale}" />
    ${altLocales}
    <meta property="og:site_name" content="AI 人像工作室" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}" />
    <meta name="twitter:description" content="${escapeAttr(meta.ogDescription)}" />
    <meta name="twitter:image" content="${ogImg}" />

    ${buildHreflangLinks()}

    <script type="application/ld+json">${JSON.stringify(buildProfessionalServiceJsonLd(lang), null, 2)}</script>
    ${buildVideoObjectsJsonLd(videoFiles)}
    <script data-goatcounter="${GOATCOUNTER_TRACKING_URL}" async src="//gc.zgo.at/count.js"></script>
  `

  head.insertAdjacentHTML('beforeend', newHead)

  return root.toString()
}
