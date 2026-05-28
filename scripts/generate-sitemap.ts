// scripts/generate-sitemap.ts
import { promises as fs } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { canonical } from '../src/lib/seo/canonicalUrl'
import type { Lang } from '../src/i18n/LanguageProvider'

const LANGS: readonly Lang[] = ['zh-Hant', 'zh-Hans', 'en']
const DIST = 'dist'

function getLastmod(): string {
  try {
    // git HEAD commit date in YYYY-MM-DD format
    return execSync('git log -1 --format=%cd --date=short', { encoding: 'utf-8' }).trim()
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function buildHreflangLinks(): string {
  const lines: string[] = []
  for (const lang of LANGS) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${canonical(lang)}" />`)
  }
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${canonical('zh-Hant')}" />`)
  return lines.join('\n')
}

async function main() {
  const lastmod = getLastmod()
  const urls = LANGS.map((lang) => `  <url>
    <loc>${canonical(lang)}</loc>
${buildHreflangLinks()}
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${lang === 'zh-Hant' ? '1.0' : '0.9'}</priority>
  </url>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

  await fs.writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf-8')
  console.log(`✓ wrote ${DIST}/sitemap.xml (lastmod: ${lastmod}, 3 lang URLs)`)
}

main().catch((err) => {
  console.error('generate-sitemap failed:', err)
  process.exit(1)
})
