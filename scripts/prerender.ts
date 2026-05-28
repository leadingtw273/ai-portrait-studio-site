// scripts/prerender.ts
import { chromium, type Route } from 'playwright'
import { promises as fs, readdirSync } from 'node:fs'
import path from 'node:path'
import { injectSeoMeta, type VideoFileMap } from './inject-seo-meta'
import type { Lang } from '../src/i18n/LanguageProvider'

const LANGS: readonly Lang[] = ['zh-Hant', 'zh-Hans', 'en']
// Allow overriding base URL via env var for CI/local flexibility
const BASE_URL = (process.env.PRERENDER_BASE_URL ?? 'http://localhost:4173/ai-portrait-studio-site').replace(/\/$/, '')
const DIST = 'dist'
const PRERENDER_VIEWPORT = { width: 1280, height: 720 }

/**
 * Resolve Vite-hashed mp4 filenames from dist/assets.
 * Fail loudly if files aren't there.
 */
function resolveVideoFiles(): VideoFileMap {
  const assetsDir = path.join(DIST, 'assets')
  const files = readdirSync(assetsDir)
  const tea = files.find((f) => /^tea-product-promo-.*\.mp4$/.test(f))
  const auto = files.find((f) => /^automotive-kv-promo-.*\.mp4$/.test(f))
  if (!tea) throw new Error('prerender: tea-product-promo mp4 not found in dist/assets/')
  if (!auto) throw new Error('prerender: automotive-kv-promo mp4 not found in dist/assets/')
  return { 'tea-product-promo': tea, 'automotive-kv-promo': auto }
}

async function main() {
  // 16c: resolve hashed mp4 filenames
  const videoFiles = resolveVideoFiles()
  console.log(`✓ resolved video files: ${videoFiles['tea-product-promo']}, ${videoFiles['automotive-kv-promo']}`)

  const browser = await chromium.launch()
  try {
    for (const lang of LANGS) {
      const context = await browser.newContext({ viewport: PRERENDER_VIEWPORT })
      const page = await context.newPage()

      // 附錄 E: block ALL external domains (open.er-api.com, images.unsplash.com, etc.)
      // Only allow the preview server origin. Keeps useCurrency rate=null
      // → prerender HTML shows TWD 原價 for ALL langs (matches hydration-safe spec).
      const allowedOrigin = new URL(BASE_URL).origin  // e.g. http://localhost:4173
      await context.route('**/*', (route: Route) => {
        const reqUrl = route.request().url()
        if (reqUrl.startsWith(allowedOrigin)) {
          return route.continue()
        }
        return route.abort()
      })

      const url = `${BASE_URL}/${lang}/`
      console.log(`→ prerender ${url}`)
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      // 附錄 E: NOT networkidle — use selector wait instead
      await page.waitForSelector('main', { timeout: 10000 })
      await page.waitForSelector('section#pricing', { timeout: 10000 })

      let html = await page.content()
      html = injectSeoMeta(html, lang, videoFiles)

      const outDir = path.join(DIST, lang)
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf-8')
      console.log(`✓ wrote ${outDir}/index.html`)

      await context.close()
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error('prerender failed:', err)
  process.exit(1)
})
