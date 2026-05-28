// scripts/verify-prerender.ts
import { promises as fs } from 'node:fs'
import { parse } from 'node-html-parser'
import path from 'node:path'
import { BASE_PATH } from '../src/lib/seo/canonicalUrl'
import type { Lang } from '../src/i18n/LanguageProvider'

const LANGS: readonly Lang[] = ['zh-Hant', 'zh-Hans', 'en']
const EXPECTED_HREFLANGS = ['zh-Hant', 'zh-Hans', 'en', 'x-default']
const DIST = 'dist'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`❌ ${msg}`)
}

function setEquals<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false
  for (const v of a) if (!b.has(v)) return false
  return true
}

/** Recursively walk a JSON-LD object collecting all string values whose keys are URL-like. */
function collectJsonLdUrls(obj: unknown, found: string[] = []): string[] {
  if (obj === null || typeof obj !== 'object') return found
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    const isUrlKey = /^(url|image|contentUrl|thumbnailUrl)$/i.test(key)
    if (isUrlKey && typeof val === 'string') found.push(val)
    if (Array.isArray(val)) val.forEach((item) => collectJsonLdUrls(item, found))
    else if (val && typeof val === 'object') collectJsonLdUrls(val, found)
  }
  return found
}

async function main() {
  const launchVerify = process.env.LAUNCH_VERIFY === 'true'
  console.log(`Mode: ${launchVerify ? 'Final Launch (strict)' : 'Infrastructure Deploy'}`)

  const hreflangSets: Record<string, Set<string>> = {}
  const ogImages = new Set<string>()

  // 規則 1-5 + Rule 4 expanded + Rule 5b — per-lang loop
  for (const lang of LANGS) {
    const filePath = path.join(DIST, lang, 'index.html')
    const html = await fs.readFile(filePath, 'utf-8')
    const root = parse(html)

    // 規則 1: HTML 基本完整性
    assert(html.includes('<title>'), `${lang}: missing <title>`)
    assert(
      !html.match(/<div\s+id="root"\s*>\s*<\/div>/),
      `${lang}: prerender did not populate root (still empty <div id="root">)`
    )
    assert(
      !html.includes('<script type="module" src="/src/main.tsx"'),
      `${lang}: dev URL leak — /src/main.tsx reference in prod HTML`
    )

    // 規則 2: <html lang>
    const htmlLang = root.querySelector('html')?.getAttribute('lang')
    assert(htmlLang === lang, `${lang}: <html lang>="${htmlLang}", expected "${lang}"`)

    // 規則 3: hreflang 集合完整
    for (const hl of EXPECTED_HREFLANGS) {
      assert(
        html.includes(`hreflang="${hl}"`),
        `${lang}: hreflang missing "${hl}" (need ${EXPECTED_HREFLANGS.join('/')})`
      )
    }

    // 規則 4 (擴充): 所有 crawler-facing URL 為 absolute 含 base path
    // 含 canonical / og:url / og:image / twitter:image
    const metaChecks: Array<{ selector: string; attr: 'href' | 'content'; label: string }> = [
      { selector: 'link[rel="canonical"]', attr: 'href', label: 'canonical' },
      { selector: 'meta[property="og:url"]', attr: 'content', label: 'og:url' },
      { selector: 'meta[property="og:image"]', attr: 'content', label: 'og:image' },
      { selector: 'meta[name="twitter:image"]', attr: 'content', label: 'twitter:image' },
    ]
    for (const c of metaChecks) {
      const el = root.querySelector(c.selector)
      assert(el, `${lang}: ${c.label} element missing from <head>`)
      const val = el.getAttribute(c.attr)
      assert(val, `${lang}: ${c.label} has empty or missing "${c.attr}" attribute`)
      assert(val.startsWith('https://'), `${lang}: ${c.label} = "${val}" is not absolute URL`)
      assert(
        val.includes(BASE_PATH),
        `${lang}: ${c.label} = "${val}" missing base path "${BASE_PATH}"`
      )
    }

    // 規則 4 (擴充): hreflang href absolute + 含 base path
    const hreflangLinks = root
      .querySelectorAll('link[rel="alternate"]')
      .filter((el) => el.getAttribute('hreflang'))
    for (const el of hreflangLinks) {
      const href = el.getAttribute('href') || ''
      const hl = el.getAttribute('hreflang')
      assert(
        href.startsWith('https://'),
        `${lang}: hreflang="${hl}" href="${href}" is not absolute URL`
      )
      assert(
        href.includes(BASE_PATH),
        `${lang}: hreflang="${hl}" href="${href}" missing base path "${BASE_PATH}"`
      )
    }

    // 規則 5: JSON-LD parse-able + 必填欄位齊全
    const scripts = root
      .querySelectorAll('script')
      .filter((el) => el.getAttribute('type') === 'application/ld+json')
    assert(
      scripts.length >= 3,
      `${lang}: expected >= 3 JSON-LD blocks (1 ProfessionalService + 2 VideoObject), got ${scripts.length}`
    )
    let serviceCount = 0
    let videoCount = 0
    for (const script of scripts) {
      let json: Record<string, unknown>
      try {
        json = JSON.parse(script.text) as Record<string, unknown>
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        throw new Error(`${lang}: JSON-LD parse error: ${msg}`)
      }
      // 規則 4 (擴充): JSON-LD URL fields must be absolute + include base path (for non-external URLs like t.me)
      const urls = collectJsonLdUrls(json)
      for (const u of urls) {
        if (!u.startsWith('https://')) {
          throw new Error(`${lang}: JSON-LD url field "${u}" not absolute`)
        }
        // Allow external URLs (t.me/...) — only check that absolute is present
        // For internal URLs (our domain), require BASE_PATH
        if (u.includes('leadingtw.github.io') && !u.includes(BASE_PATH)) {
          throw new Error(
            `${lang}: JSON-LD url field "${u}" on our domain missing base path "${BASE_PATH}"`
          )
        }
      }
      if (json['@type'] === 'ProfessionalService') {
        serviceCount++
        for (const k of ['name', 'url', 'contactPoint', 'hasOfferCatalog']) {
          assert(json[k], `${lang}: ProfessionalService missing "${k}"`)
        }
      }
      if (json['@type'] === 'VideoObject') {
        videoCount++
        for (const k of ['name', 'thumbnailUrl', 'uploadDate', 'description']) {
          assert(json[k], `${lang}: VideoObject missing required "${k}"`)
        }
        const thumbnailUrl = json['thumbnailUrl'] as string
        assert(
          thumbnailUrl.startsWith('https://'),
          `${lang}: VideoObject thumbnailUrl must be absolute`
        )
        // 規則 5b: thumbnailUrl 對應的 jpg 必須存在於 dist/video-posters/
        const fileName = path.basename(new URL(thumbnailUrl).pathname)
        const posterPath = path.join(DIST, 'video-posters', fileName)
        try {
          await fs.access(posterPath)
        } catch {
          throw new Error(
            `${lang}: VideoObject thumbnailUrl points to "${fileName}" but file not at ${posterPath}`
          )
        }
        // 規則 5c: contentUrl mp4 basename must exist in dist/assets/
        const contentUrl = json['contentUrl'] as string | undefined
        assert(contentUrl, `${lang}: VideoObject missing "contentUrl"`)
        const contentBasename = path.basename(new URL(contentUrl).pathname)
        try {
          await fs.access(path.join(DIST, 'assets', contentBasename))
        } catch {
          throw new Error(
            `${lang}: VideoObject contentUrl points to "${contentBasename}" but file not at dist/assets/`
          )
        }
      }
    }
    assert(serviceCount === 1, `${lang}: expected 1 ProfessionalService JSON-LD, got ${serviceCount}`)
    assert(videoCount === 2, `${lang}: expected 2 VideoObject JSON-LD, got ${videoCount}`)

    // 規則 9: GoatCounter analytics script 注入（Task 22）
    const gcScript = root.querySelectorAll('script').find(
      (el) => el.getAttribute('data-goatcounter') !== undefined
             && el.getAttribute('data-goatcounter') !== null
    )
    assert(gcScript, `${lang}: missing GoatCounter script tag (data-goatcounter)`)
    const gcUrl = gcScript!.getAttribute('data-goatcounter')
    assert(gcUrl?.startsWith('https://') && gcUrl.endsWith('/count'),
           `${lang}: GoatCounter URL "${gcUrl}" malformed`)
    const gcSrc = gcScript!.getAttribute('src')
    assert(gcSrc === '//gc.zgo.at/count.js',
           `${lang}: GoatCounter script src is "${gcSrc}", expected "//gc.zgo.at/count.js"`)
    const gcAsync = gcScript!.getAttribute('async')
    assert(gcAsync !== undefined && gcAsync !== null,
           `${lang}: GoatCounter script must be async (avoid LCP regression)`)
    console.log(`✓ ${lang}: 規則 9 GoatCounter script 注入`)

    // 規則 7 collect (validated after loop)
    hreflangSets[lang] = new Set(hreflangLinks.map((l) => l.getAttribute('href')!))

    // 規則 8 collect (validated if launchVerify)
    const ogImg = root.querySelector('meta[property="og:image"]')?.getAttribute('content')
    if (ogImg) ogImages.add(ogImg)

    console.log(`✓ ${lang}: 規則 1-5 + 5b + 9 通過`)
  }

  // 規則 6: root index.html noindex
  const rootHtml = await fs.readFile(path.join(DIST, 'index.html'), 'utf-8')
  assert(
    /<meta\s+name="robots"\s+content="[^"]*noindex/.test(rootHtml),
    'root index.html missing <meta name="robots" content="noindex">'
  )
  console.log('✓ root: 規則 6 (noindex) 通過')

  // 規則 7: 三語 hreflang href set 完全一致
  const refSet = hreflangSets[LANGS[0]]
  for (const lang of LANGS.slice(1)) {
    assert(
      setEquals(hreflangSets[lang], refSet),
      `${lang}: hreflang href set differs from ${LANGS[0]} reference`
    )
  }
  console.log('✓ 規則 7 通過：三語 hreflang 集合一致')

  // 規則 8: Final Launch 階段、三語 og:image 必須各異
  if (launchVerify) {
    assert(
      ogImages.size === LANGS.length,
      `Final Launch: og:image must be unique per language, got ${ogImages.size} unique`
    )
    console.log('✓ 規則 8 通過（Final Launch）：三語 og:image 各異')
  } else {
    console.log(`◷ 規則 8 跳過（Infrastructure Deploy 模式、允許 placeholder）`)
  }

  console.log('✅ verify-prerender all rules passed')
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(msg)
  process.exit(1)
})
