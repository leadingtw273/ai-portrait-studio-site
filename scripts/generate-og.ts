// scripts/generate-og.ts
// 程式化產生三語 og 預覽圖（1200×630）：暖白咖啡簡約風 + 襯線品牌名 + 標語。
// 用 playwright 渲染 HTML → 截圖存 public/og/og-<lang>.jpg。
// 字體走 Google Fonts CDN（Noto Serif TC / Noto Sans TC），需網路。
import { chromium } from 'playwright'
import path from 'node:path'

type Lang = 'zh-Hant' | 'zh-Hans' | 'en'

const CARDS: Record<Lang, { eyebrow: string; brand: string; tagline: string; services: string; serif: string }> = {
  'zh-Hant': {
    eyebrow: 'AI ・ 創新 ・ 專業',
    brand: 'AI 影像工作室',
    tagline: '專業的 AI 影片與影像生成服務',
    services: 'AI 影片內容生成　・　LoRA 人像訓練　・　AI 寫真',
    serif: "'Noto Serif TC', serif",
  },
  'zh-Hans': {
    eyebrow: 'AI ・ 创新 ・ 专业',
    brand: 'AI 影像工作室',
    tagline: '专业的 AI 视频与影像生成服务',
    services: 'AI 视频内容生成　・　LoRA 人像训练　・　AI 写真',
    serif: "'Noto Serif TC', serif",
  },
  en: {
    eyebrow: 'AI ・ INNOVATION ・ PROFESSIONAL',
    brand: 'AI Imaging Studio',
    tagline: 'Professional AI video & image generation',
    services: 'AI Video Content　・　LoRA Training　・　AI Headshots',
    serif: "'Playfair Display', 'Noto Serif TC', serif",
  },
}

function buildHtml(card: (typeof CARDS)[Lang]): string {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&family=Noto+Sans+TC:wght@400;500&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: #F5F1EB;
    font-family: 'Noto Sans TC', system-ui, sans-serif;
    color: #2B2420;
    position: relative;
    overflow: hidden;
  }
  /* 角落極淡咖啡渲染（呼應網站背景紋理） */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.10;
    background: radial-gradient(circle, #6F4E37 0%, transparent 70%);
  }
  .blob-a { width: 520px; height: 520px; top: -200px; right: -120px; }
  .blob-b { width: 420px; height: 420px; bottom: -180px; left: -120px; opacity: 0.08; }
  .frame {
    position: absolute; inset: 28px;
    border: 1px solid rgba(43,36,32,0.10);
    border-radius: 22px;
  }
  .wrap {
    position: absolute; inset: 0;
    padding: 96px 104px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 24px; letter-spacing: 6px; font-weight: 500;
    color: #6F4E37; margin-bottom: 30px;
  }
  .eyebrow svg { width: 26px; height: 26px; }
  .brand {
    font-family: ${card.serif};
    font-weight: 900;
    font-size: 110px;
    line-height: 1.08;
    letter-spacing: 1px;
    color: #2B2420;
  }
  .tagline {
    font-size: 42px; font-weight: 500;
    color: #6F4E37; margin-top: 30px;
  }
  .rule { width: 104px; height: 5px; background: #6F4E37; border-radius: 3px; margin: 40px 0 28px; }
  .services { font-size: 31px; font-weight: 500; letter-spacing: 1px; color: #6F5C4C; }
  .url {
    position: absolute; right: 104px; bottom: 70px;
    font-size: 24px; color: #8A7C6E; letter-spacing: 0.5px;
  }
</style></head>
<body>
  <div class="blob blob-a"></div>
  <div class="blob blob-b"></div>
  <div class="frame"></div>
  <div class="wrap">
    <div class="eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="#6F4E37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5z"/>
        <path d="M5 3v2M5 21v-2M3 5h2M21 5h-2M3 19h2M21 19h-2"/>
      </svg>
      ${card.eyebrow}
    </div>
    <div class="brand">${card.brand}</div>
    <div class="tagline">${card.tagline}</div>
    <div class="rule"></div>
    <div class="services">${card.services}</div>
  </div>
  <div class="url">leadingtw273.github.io/ai-portrait-studio-site</div>
</body></html>`
}

async function main() {
  const outDir = path.join('public', 'og')
  const browser = await chromium.launch()
  try {
    for (const lang of Object.keys(CARDS) as Lang[]) {
      const context = await browser.newContext({
        viewport: { width: 1200, height: 630 },
        deviceScaleFactor: 1, // 輸出剛好 1200×630，對齊 og:image:width/height 宣告
      })
      const page = await context.newPage()
      await page.setContent(buildHtml(CARDS[lang]), { waitUntil: 'networkidle' })
      await page.evaluate(async () => { await (document as Document).fonts.ready })
      await page.waitForTimeout(300)
      const out = path.join(outDir, `og-${lang}.jpg`)
      await page.screenshot({ path: out, type: 'jpeg', quality: 92 })
      console.log(`✓ wrote ${out}`)
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error('generate-og failed:', err)
  process.exit(1)
})
