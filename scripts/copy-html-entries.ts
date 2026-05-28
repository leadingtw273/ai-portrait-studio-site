import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const LANGS = ['zh-Hant', 'zh-Hans', 'en'] as const
const DIST = 'dist'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REDIRECT_TEMPLATE = path.join(__dirname, '__fixtures__/root-redirect-template.html')

async function main() {
  // 1) 先把 dist/index.html (SPA app entry) 複製到三條語言路徑
  const rootHtml = await fs.readFile(path.join(DIST, 'index.html'), 'utf-8')
  for (const lang of LANGS) {
    const dir = path.join(DIST, lang)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, 'index.html'), rootHtml, 'utf-8')
    console.log(`✓ copied SPA app to ${path.join(dir, 'index.html')}`)
  }

  // 2) 覆寫 dist/index.html 為 root redirect 頁
  const redirectHtml = await fs.readFile(REDIRECT_TEMPLATE, 'utf-8')
  await fs.writeFile(path.join(DIST, 'index.html'), redirectHtml, 'utf-8')
  console.log(`✓ overwrote root index.html as redirect page`)
}

main().catch((err) => {
  console.error('copy-html-entries failed:', err)
  process.exit(1)
})
