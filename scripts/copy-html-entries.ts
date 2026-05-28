// scripts/copy-html-entries.ts
import { promises as fs } from 'node:fs'
import path from 'node:path'

const LANGS = ['zh-Hant', 'zh-Hans', 'en'] as const
const DIST = 'dist'

async function main() {
  const rootHtml = await fs.readFile(path.join(DIST, 'index.html'), 'utf-8')
  for (const lang of LANGS) {
    const dir = path.join(DIST, lang)
    await fs.mkdir(dir, { recursive: true })
    // 暫時複製 root HTML 內容；後續 Task 16 prerender 會覆寫成各語言版本
    await fs.writeFile(path.join(dir, 'index.html'), rootHtml, 'utf-8')
    console.log(`✓ copied ${path.join(dir, 'index.html')}`)
  }
}

main().catch((err) => {
  console.error('copy-html-entries failed:', err)
  process.exit(1)
})
