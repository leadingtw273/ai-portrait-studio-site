# AI Portrait Studio Site — SEO 強化設計規格

- **日期**：2026-05-26
- **狀態**：Design pending user approval，待 codex review → user review → plan
- **撰寫**：Claude Code (Opus 4.7) + 使用者 leadi
- **前情**：`2026-05-21-landing-site-design.md`（landing site v1 已上線、SEO 當時 out of scope）
- **下一步**：codex review → user review → writing-plans skill 產出 implementation plan

---

## 1. 目的與成功標準

### 1.1 目的

把現有純 SPA（GitHub Pages、`<div id="root"></div>` 空殼）強化為 **SEO-friendly 三語靜態站**，讓以下四種受眾都能在搜尋 / 分享情境正確接收內容：

1. **繁中潛在客戶（台灣）** — Google 搜尋「AI 人像 / AI 寫真 / LoRA 訓練」
2. **簡中潛在客戶（中國 / 馬新）** — 百度 / 搜狗搜尋「AI 寫真 / AI 頭像 / AI 形象」
3. **英文國際客戶** — Google 搜尋「AI portrait studio / AI headshot / LoRA training」
4. **社群 / IM 分享預覽 bot**（LINE / Telegram / Facebook / X / Slack / ChatGPT 搜尋 bot 等不 render JS 的爬蟲）

### 1.2 元前提（自檢產出，鎖定）

| 維度 | 值 | 影響 |
|---|---|---|
| **目標使用者** | 四種全要：繁中 TW、簡中 CN/MY/SG、英文國際、社群 IM bot | 三語都要做 hreflang + 獨立 URL；prerender 必須做（IM bot 不 render JS） |
| **類比參考** | 業界一般水準（technical SEO best practice），不對齊特定競品 | 採通用 schema.org `ProfessionalService` + `Offer` 結構，不為特定產業做特殊 markup |
| **Identity** | 商業客戶接案門面，要生 lead | 投資強度高、值得做 prerender 與完整 structured data，不只 meta |
| **動機** | 都有（趕著被找到 + 預防性 + 長期累積 + 社群預覽） | 四天分階段交付、每階段獨立 deploy 可驗證；避免「大改一次後等驗證」的風險 |

### 1.3 成功標準

以下 7 條 **質性 + 工具可驗證** 標準，上線後手動 + 工具抽查：

1. **每條語言 URL 用 `curl` 拿到的 HTML 含完整 hero / pricing / footer 文字**（不是空 `<div id="root">`） — 工具：`curl https://.../zh-Hant/ | grep "Mini Launch"`
2. **三條語言 URL 的 `<html lang>` 屬性正確**（zh-Hant / zh-Hans / en） — 工具：`curl ... | grep '<html lang'`
3. **hreflang alternate 在三條 HTML 與 sitemap.xml 都互相交叉指向** — 工具：`curl ... | grep hreflang`
4. **LINE / Telegram 貼連結預覽顯示 og:image + 該語言 title + 該語言 description**（不是中文 fallback） — 觀察方式：實際貼 TG / LINE
5. **Google Search Console 提交 sitemap.xml 無錯誤、三條 URL 都被 index** — 上線後 1-2 週觀察
6. **JSON-LD 通過 Google Rich Results Test**（[search.google.com/test/rich-results](https://search.google.com/test/rich-results)）— 上線後 manual 跑一次
7. **Core Web Vitals LCP < 2.5s**（mobile）— 工具：PageSpeed Insights manual 抽查

### 1.4 不在範圍內的成功標準

- ❌ 自然搜尋流量數字 / 排名 KPI（無法保證、且需要 GA / Search Console 累積數據）
- ❌ 轉換率（landing site v1 spec 已決定不接 analytics、本版維持）
- ❌ 內容 SEO（blog / case study 字數累積）— v2 議題

---

## 2. 技術棧與限制

### 2.1 維持不變

- **框架**：React 19 + TypeScript ~5.6 + Vite 8
- **樣式**：Tailwind 3 + 既有 design tokens
- **i18n 字典**：`messages.zh-hant.ts` / `messages.zh-hans.ts` / `messages.en.ts`（保留現有結構）
- **部署目標**：GitHub Pages（純靜態主機、不接 Node SSR）
- **Vite base path**：`/ai-portrait-studio-site/`（custom domain 仍是 v2 議題）

### 2.2 新增依賴

| 依賴 | 用途 | 為什麼選它 |
|---|---|---|
| `playwright`（dev） | build-time prerender 抓 React 完整 render 後 HTML | repo 已有 `.playwright-cli/`，沿用既有工具鏈；比 react-snap 維護更活躍 |

**明確不選**：
- ~~`react-snap`~~：2020 後維護不活躍、用 puppeteer 老版本、可能跟 Vite 8 衝
- ~~`vite-plugin-prerender-spa` / `vite-prerender-plugin`~~：社群套件可控性差、配置 magic 多
- ~~`vike`（前 vite-plugin-ssr）~~：架構入侵性高、要改 entry point；對單頁三語站 over-engineering
- ~~`Astro`~~：等同方案 C、本版已選 B（保留現架構）

### 2.3 不動的東西（YAGNI）

- ❌ 不接 GA / Plausible / Umami（landing v1 已 lock-out、本版維持）
- ❌ 不接 Sentry / error tracking
- ❌ 不加 blog / case study route（v2 議題）
- ❌ 不接 custom domain（v2 議題；本版用 `<user>.github.io/ai-portrait-studio-site/` 子路徑）

### 2.4 部署慣例

- 工作分支：`main`（landing site repo 使用 main，與 ai-influencers monorepo 用 master 不同 — 已在 README 確認）
- CI/CD：既有 `.github/workflows/deploy.yml` 擴充 prerender step

---

## 3. 改造後的 URL / 檔案結構

### 3.1 URL 結構

```
https://<user>.github.io/ai-portrait-studio-site/             ← root，redirect 到偵測到的語言
https://<user>.github.io/ai-portrait-studio-site/zh-Hant/     ← 繁中
https://<user>.github.io/ai-portrait-studio-site/zh-Hans/     ← 簡中
https://<user>.github.io/ai-portrait-studio-site/en/          ← 英文
https://<user>.github.io/ai-portrait-studio-site/sitemap.xml
https://<user>.github.io/ai-portrait-studio-site/robots.txt
```

**root redirect 策略**：

- 主要靠 JS：`<script>` 偵測 `navigator.language` → `location.replace()` 到對應語言路徑
- 無 JS fallback：`<meta http-equiv="refresh" content="0; url=./zh-Hant/">`（預設繁中）
- Bot 路徑：`<link rel="alternate" hreflang="x-default" href="./zh-Hant/">` + 不該被 index 的 root 加 `<meta name="robots" content="noindex">`（避免 root 跟語言頁分權重）

### 3.2 dist 輸出結構

```
dist/
├── index.html              ← root redirect 頁（輕量、無 React app）
├── zh-Hant/
│   └── index.html          ← prerender 完整繁中 DOM + 繁中 meta + JSON-LD
├── zh-Hans/
│   └── index.html          ← 同上、簡中
├── en/
│   └── index.html          ← 同上、英文
├── sitemap.xml
├── robots.txt
├── favicon.svg
├── og/                     ← 社群預覽圖（1200x630）
│   ├── og-zh-Hant.jpg
│   ├── og-zh-Hans.jpg
│   └── og-en.jpg
└── assets/                 ← Vite 產出 JS / CSS，三條 HTML 共用
    ├── index-xxxx.js
    └── index-xxxx.css
```

### 3.3 source code 新增 / 修改

```
src/
├── i18n/
│   └── LanguageProvider.tsx     ← 改：detectInitialLang 改讀 URL pathname
├── sections/
│   └── Nav.tsx                  ← 改：語言切換器 onClick 改成 location.href 跳轉
├── lib/
│   ├── currency.ts              ← 改：SSR 安全（typeof window === 'undefined' guard）
│   ├── useCurrency.ts           ← 改：prerender 階段使用 fallback、client mount 後 fetch
│   └── seo/                     ← 新：SEO 配置中心
│       ├── meta.ts              ← 各語言 title / description / og 文字
│       ├── jsonld.ts            ← Schema.org 結構化資料生成（讀 content.ts + i18n）
│       └── canonicalUrl.ts      ← Canonical / hreflang URL 生成 helper
scripts/
├── prerender.ts                 ← 新：Playwright prerender 主腳本
├── generate-sitemap.ts          ← 新：sitemap.xml 生成
└── inject-seo-meta.ts           ← 新：把 prerender 出的 HTML 注入 SEO meta
public/
├── robots.txt                   ← 新
└── og/                          ← 新：1200x630 預覽圖（手做、Figma / Photoshop）
.github/workflows/
└── deploy.yml                   ← 改：build 後加 preview server + prerender step
```

---

## 4. 各語言 HTML 的 SEO Meta 規範

### 4.1 每條 entry HTML 必備 meta（5 類）

#### A. 基本 meta（SERP 顯示）

| Tag | 範例（繁中） | 邏輯 |
|---|---|---|
| `<html lang>` | `zh-Hant` | 對應 URL path、prerender 時靜態寫入、不靠 client useEffect |
| `<title>` | `AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 從 NT$ 3,800 起` | 含主關鍵字 + 服務 + 價格區間（吸引點擊）、≤ 65 字元（避免 Google 截斷） |
| `<meta name="description">` | `專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。Mini / Standard / Pro 三方案、含 9 種加購、Telegram 即時諮詢。` | 含主關鍵字 + 服務 + 方案結構 + CTA、≤ 155 字元 |
| `<link rel="canonical">` | `https://.../zh-Hant/` | 自指；告訴 Google「這條 URL 就是 canonical」、避免大小寫 / trailing slash 重複 index |
| `<meta name="robots">` | `index, follow` | 三條語言頁都允許 index；root redirect 頁設 `noindex, follow` |

#### B. Open Graph（FB / LINE / TG / Slack 預覽）

| Tag | 範例（繁中） |
|---|---|
| `og:type` | `website` |
| `og:title` | 同 `<title>` 但可略短（去掉價格） |
| `og:description` | 同 description |
| `og:url` | `https://.../zh-Hant/` |
| `og:image` | `https://.../og/og-zh-Hant.jpg`（絕對 URL、必須 1200x630）|
| `og:image:width` | `1200` |
| `og:image:height` | `630` |
| `og:locale` | `zh_TW` |
| `og:locale:alternate` | `zh_CN`、`en_US`（多條） |
| `og:site_name` | `AI 人像工作室` |

#### C. Twitter Card

| Tag | 值 |
|---|---|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | 同 og:title |
| `twitter:description` | 同 og:description |
| `twitter:image` | 同 og:image |

#### D. hreflang alternate

```html
<link rel="alternate" hreflang="zh-Hant"   href="https://.../zh-Hant/" />
<link rel="alternate" hreflang="zh-Hans"   href="https://.../zh-Hans/" />
<link rel="alternate" hreflang="en"        href="https://.../en/" />
<link rel="alternate" hreflang="x-default" href="https://.../zh-Hant/" />
```

**注意**：x-default 指向繁中（主要市場）；root `/` 不在 hreflang 範圍（root 是 redirect 頁、不該被當成 canonical）。

#### E. JSON-LD Structured Data（重點）

兩段 JSON-LD（用兩個 `<script type="application/ld+json">` block）：

**1. ProfessionalService + Offer 列表**：

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AI 人像工作室",
  "alternateName": "AI Portrait Studio",
  "description": "專業 AI 人像生成與影片製作服務...",
  "url": "https://.../zh-Hant/",
  "image": "https://.../og/og-zh-Hant.jpg",
  "priceRange": "NT$3,500 - NT$168,800",
  "areaServed": ["TW", "HK", "SG", "MY", "CN", "US"],
  "contactPoint": {
    "@type": "ContactPoint",
    "url": "https://t.me/+ggZ71bEWqas5MzRl",
    "contactType": "sales",
    "availableLanguage": ["zh-Hant", "zh-Hans", "en"]
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "服務方案",
    "itemListElement": [
      { "@type": "Offer", "name": "Discovery Pack 試做", "price": "3500", "priceCurrency": "TWD" },
      { "@type": "Offer", "name": "Mini Launch", "price": "12800", "priceCurrency": "TWD" },
      { "@type": "Offer", "name": "Standard Launch", "price": "78800", "priceCurrency": "TWD" },
      { "@type": "Offer", "name": "Pro Launch", "price": "168800", "priceCurrency": "TWD" }
    ]
  }
}
```

**2. VideoObject × 2**（兩支 demo 影片）：

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "產品宣傳短片 — AI 人臉 × 茶園實景",
  "description": "...",
  "thumbnailUrl": "https://.../tea-product-promo-poster.jpg",
  "contentUrl": "https://.../tea-product-promo.mp4",
  "uploadDate": "2026-05-21",
  "duration": "PT15S"
}
```

**注意**：
- `priceCurrency` 永遠寫 TWD（schema 的 price 是「實際定價」、語言切換的 CNY / USD 是顯示用、不是真實定價）
- 兩支影片各一段 VideoObject
- 沒有 FAQ section → 不加 FAQPage schema（避免假數據）

### 4.2 三語 SEO 文字策略

每語言 `<title>` / `<description>` / `og` 文字**人工撰寫**、不機械翻譯：

| 語言 | 主關鍵字 | 文字風格 |
|---|---|---|
| zh-Hant | AI 人像工作室、LoRA 訓練、AI 寫真、影片人像生成 | 台灣繁中語感、含 NT$ 價格區間 |
| zh-Hans | AI 写真、AI 头像、AI 形象、LoRA 训练 | 中國 / 馬新簡中語感、含 ¥ 價格區間 |
| en | AI Portrait Studio, LoRA training, AI headshot, AI video portrait | 英語直接陳述、含 US$ 價格區間 |

**實作**：放在 `src/lib/seo/meta.ts`，型別與 `Messages` 結構解耦（SEO meta 比 i18n messages 更精煉、不適合塞進 messages）。

---

## 5. Prerender 流程

### 5.1 工具與架構

- **執行階段**：build 之後（不是 build 之中）
- **工具**：Playwright（headless Chromium）
- **入口**：`scripts/prerender.ts`，由 `pnpm prerender` 觸發
- **依賴**：本機 / CI 上跑著 `vite preview` server 提供三條 URL

### 5.2 流程順序

```
1. pnpm build                    → 產出 dist/ 含 index.html（SPA 空殼）
2. pnpm preview --port 4173 &    → 起 vite preview server（背景）
3. wait-for http://localhost:4173/ai-portrait-studio-site/  → 等 server ready
4. pnpm prerender                → playwright 抓三條 URL HTML、寫回 dist/<lang>/index.html
5. pnpm generate-sitemap         → 從三條 URL 生成 dist/sitemap.xml
6. kill preview server
7. upload dist/ to GitHub Pages
```

### 5.3 Prerender 腳本邏輯（pseudocode）

```ts
// scripts/prerender.ts
import { chromium } from 'playwright'
import { promises as fs } from 'fs'

const LANGS = ['zh-Hant', 'zh-Hans', 'en'] as const
const BASE_URL = 'http://localhost:4173/ai-portrait-studio-site'
const DIST = 'dist'

const browser = await chromium.launch()
for (const lang of LANGS) {
  const page = await browser.newPage()
  await page.goto(`${BASE_URL}/${lang}/`, { waitUntil: 'networkidle' })
  await page.waitForSelector('main')            // 確保 React render 完成
  await page.waitForSelector('section#pricing') // 確保 pricing section 也 ready

  // 取出完整 HTML
  let html = await page.content()

  // 注入 SEO meta（title / description / og / JSON-LD / hreflang）
  html = injectSeoMeta(html, lang)

  // 寫回 dist/<lang>/index.html
  await fs.mkdir(`${DIST}/${lang}`, { recursive: true })
  await fs.writeFile(`${DIST}/${lang}/index.html`, html, 'utf-8')

  await page.close()
}
await browser.close()
```

### 5.4 Hydration 一致性處理

prerender 抓到的 HTML 必須與 client 第一次 React render 結果一致，否則 React 19 會：

- 在 dev mode 丟 console warning
- 在 production 偵測到 mismatch 後**整段重 render**（client 看到的 DOM 不會壞、但 prerender 的 HTML 等於白做、bot 拿到的內容才是有效）

**4 個 client-only 狀態的處理規格**：

| 狀態 | 處理方式 |
|---|---|
| **匯率 fetch**（`useCurrency`） | prerender 時用 hardcoded fallback 值（TWD/CNY = 4.50、TWD/USD = 0.031，每月手動更新一次寫進 `src/lib/currency.ts`）；client mount 後 fetch 真實匯率才 setState。**SSR safe**：`typeof window !== 'undefined'` guard |
| **scroll-driven blur**（`App.tsx`） | initial `progress = 0`；prerender 與 client mount 第一幀都是 0、無 mismatch |
| **語言偵測**（`LanguageProvider`） | 改讀 URL `pathname`（prerender 與 client 看到同樣 path、結果一致）；`navigator.language` 只在 root redirect 頁用 |
| **scroll hint 動畫** | 純 CSS `animate-bounce`、無 hydration 問題 |

**另外處理：localStorage 存取**：

- `LanguageProvider` 現有的 `localStorage.getItem(STORAGE_KEY)` 在 prerender 時會炸（headless Chromium 有 localStorage、但跨域 / file URL 場景需確認）
- 統一加 `typeof window !== 'undefined'` guard
- prerender 階段不寫 localStorage（讀 URL pathname 就夠）

### 5.5 Build artifact 驗證 step

prerender 後加自動驗證（fail-fast、避免上線壞掉的 HTML）：

```ts
// scripts/verify-prerender.ts
for (const lang of LANGS) {
  const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
  assert(html.includes('<title>'), `${lang}: missing <title>`)
  assert(html.includes('og:image'), `${lang}: missing og:image`)
  assert(html.includes('application/ld+json'), `${lang}: missing JSON-LD`)
  assert(!html.includes('<div id="root"></div>'), `${lang}: prerender did not populate root`)
  assert(html.includes(`hreflang="${lang}"`), `${lang}: missing hreflang`)
}
```

驗證失敗時 CI build 失敗、不上線。

---

## 6. sitemap.xml + robots.txt

### 6.1 sitemap.xml 結構

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://&lt;user&gt;.github.io/ai-portrait-studio-site/zh-Hant/</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="https://&lt;user&gt;.github.io/ai-portrait-studio-site/zh-Hant/" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="https://&lt;user&gt;.github.io/ai-portrait-studio-site/zh-Hans/" />
    <xhtml:link rel="alternate" hreflang="en"      href="https://&lt;user&gt;.github.io/ai-portrait-studio-site/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://&lt;user&gt;.github.io/ai-portrait-studio-site/zh-Hant/" />
    <lastmod>2026-05-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- 重複 zh-Hans / en，每條 URL 都有自己的 <url> 條目 + 相同的 hreflang 集合 -->
</urlset>
```

**生成邏輯**：`scripts/generate-sitemap.ts` 由 build pipeline 觸發，`lastmod` 取 git HEAD commit date（或 build time）。

### 6.2 robots.txt

```
User-agent: *
Allow: /

Sitemap: https://<user>.github.io/ai-portrait-studio-site/sitemap.xml
```

放 `public/robots.txt`、Vite 會原封不動複製到 dist root（注意：GitHub Pages 子路徑下、`robots.txt` 必須放在**網域 root**才會被搜尋引擎抓；GH Pages 用 `<user>.github.io` 整個帳號共享 root、本 repo 的子路徑下放的 robots.txt 不會被當成全站 robots — 這是 **GH Pages 子路徑部署的限制**）。

**緩解**：
- 接 custom domain（v2 議題）後 robots.txt 就生效
- 在 hreflang / sitemap 內顯式宣告 alternate、Google 仍能找到（sitemap 提交給 Search Console 後就直接吃）
- **本版接受此限制**：robots.txt 放在子路徑下、雖然不被搜尋引擎當「全站 robots」、但作為 documentation 用途仍保留（提示開發者本站允許爬）

---

## 7. og:image 製作

### 7.1 規格

- 尺寸：1200×630（FB 推薦、LINE / TG / Slack 兼容）
- 格式：jpg（< 300KB）
- 內容：背景色（#0E0B1F）+ 主標題（該語言）+ logo「✦ AI 人像工作室」+ 一句 slogan
- 三張：`og-zh-Hant.jpg` / `og-zh-Hans.jpg` / `og-en.jpg`

### 7.2 製作流程

- 手工 Figma 設計 1 張 master template、複製 3 份替換語言文字
- 輸出至 `public/og/`、Vite 自動複製到 dist root
- 上線後在 [opengraph.xyz](https://www.opengraph.xyz/) 驗證實際 IM 預覽呈現

### 7.3 暫時 placeholder 策略

plan 階段可先用「同一張中文 og」三語共用（reuse zh-Hant）、prerender 階段先打通；上線前 leadi 再做三語版本替換（不阻塞 prerender / Schema 等基礎建設先 deploy）。

---

## 8. Performance 順手改善

prerender 改造同時順手做（影響 LCP、Google ranking factor）：

| 項目 | 改造 |
|---|---|
| **字型載入** | 6 個 fontsource CSS → 只載入實際用的 weight（Inter 600/700、Noto Sans TC 400/600，砍 400/Inter）；加 `font-display: swap` |
| **Hero background** | `index.html` head 加 `<link rel="preload" href="<base>/assets/hero-bg-xxxx.jpg" as="image" fetchpriority="high">`（注意：Vite hash 過的 asset URL 要 build 後注入） |
| **Demo video** | `<video>` 標籤 `preload="metadata"`（不要 `preload="auto"`，省 mobile 流量） |
| **CSS critical path** | prerender 後 inline critical CSS — **本版不做**（複雜度高 / 已有 prerender HTML 改善 LCP） |

---

## 9. GitHub Actions 調整

### 9.1 改造後 `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install chromium  # 新：prerender 用
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build                            # 既有
      - run: pnpm preview --port 4173 &             # 新：背景起 server
      - run: pnpm exec wait-on http://localhost:4173/ai-portrait-studio-site/  # 新：等 server ready
      - run: pnpm prerender                         # 新：prerender 三語
      - run: pnpm generate-sitemap                  # 新：sitemap.xml
      - run: pnpm verify-prerender                  # 新：驗證 prerender 產出
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 9.2 新增 npm scripts（`package.json`）

```json
{
  "scripts": {
    "prerender": "tsx scripts/prerender.ts",
    "generate-sitemap": "tsx scripts/generate-sitemap.ts",
    "verify-prerender": "tsx scripts/verify-prerender.ts"
  },
  "devDependencies": {
    "playwright": "^1.49.0",
    "wait-on": "^8.0.0",
    "tsx": "^4.19.0"
  }
}
```

---

## 10. 施工順序（5 階段，每階段獨立 deploy 驗證）

| 階段 | 內容 | 工作量 | 立即效益 |
|---|---|---|---|
| **Step 1**：基本 SEO meta + sitemap + og:image | 改 `index.html` 寫死繁中 meta；新增 sitemap.xml / robots.txt / og-zh-Hant.jpg | 0.5 天 | Google SERP title / description 立即改善；繁中 IM 分享有預覽圖 |
| **Step 2**：三語路由改造 | 改 `LanguageProvider.detectInitialLang` 讀 URL；改 Nav 語言切換器跳 URL；root `index.html` 改成 redirect 頁；新增 `/zh-Hant/` `/zh-Hans/` `/en/` 三條 entry | 1 天 | 三語各自有 URL；hreflang 生效；Search Console 可分別追三條 |
| **Step 3**：JSON-LD 結構化資料 + 三語 og:image | `src/lib/seo/jsonld.ts` 生成 schema；三語各做 og:image | 0.5 天 | Google 理解服務內容；潛在 rich snippet；三語 IM 預覽完整 |
| **Step 4**：Playwright prerender 腳本 + Hydration 修 | `scripts/prerender.ts` + 4 個 client-only state 處理 + `verify-prerender.ts` | 1.5 天 | 所有 bot 拿到完整 HTML；百度 / Bing / ChatGPT 搜尋 bot 可正確 index |
| **Step 5**：GitHub Actions pipeline 整合 + 上線驗證 | 改 `deploy.yml`；上線後跑 Google Rich Results Test + PageSpeed Insights + IM 分享預覽抽查 | 0.5 天 | CI/CD 自動化；上線 sanity check |

**總計 4 天**。

### 10.1 Step-by-step deploy 風險控制

- 每階段都產出 functional commit、可獨立 deploy
- 若 Step 4 prerender 遇 hydration 大 bug、可 revert 到 Step 3、SEO 基礎仍在
- Step 3 之前的 deploy 都不破壞現有使用者體驗（純加 meta、不改互動）

---

## 11. Out of scope（明確排除）

| 項目 | 為什麼不做 | 何時可能做 |
|---|---|---|
| **Server-side rendering（SSR）** | GitHub Pages 純靜態主機、無 Node runtime；prerender 已涵蓋 99% 需求 | 未來換主機（Vercel / Cloudflare Pages）+ 內容動態化時 |
| **Incremental Static Regeneration（ISR）** | 同上 | 同上 |
| **Custom domain** | v2 議題、會額外牽動 sitemap absolute URL、og:url、canonical 等多處 | 等品牌 domain 確定 |
| **Blog / Case Study route** | 一頁式 scope；landing v1 已 lock-out；prerender 架構 ready 但本版不接路由 | 累積案例後加 |
| **多於三語** | 三語已涵蓋目標市場；多語要重寫 i18n state 模型 | 加日 / 韓時 |
| **接 Google Analytics / Search Console event tracking** | landing v1 已 lock-out 不接 analytics；本版維持 | 開始 A/B / 追轉換時 |
| **AMP（Accelerated Mobile Pages）** | Google 2024+ 已不強推、單頁 site 不值得雙版本維護 | 永不做 |
| **接 reCAPTCHA / 表單** | landing v1 已 lock-out（無表單）| 開始收 lead form 時 |
| **動態 og:image 生成（Vercel OG / Satori）** | 三語三張、手做 Figma 比動態生成簡單 | 內容變動頻繁時 |
| **Critical CSS inlining** | 改造複雜度高、prerender 已大幅改善 LCP | LCP 仍 > 2.5s 再做 |
| **PWA / Service Worker** | 純展示站、無離線需求 | 永不做 |
| **`robots.txt` 全站生效** | GH Pages 子路徑限制；本版接受、v2 接 custom domain 後解決 | v2 接 custom domain |

---

## 12. 開放問題（writing-plans 階段可解）

1. **GitHub username 確認** — 影響所有 absolute URL（canonical / og:url / sitemap）；plan 前 leadi 提供。**暫定 `<user>` placeholder、plan 階段填實際 username**。
2. **三語 SEO 文字（title / description）人工撰寫** — 不機械翻譯、需 leadi 提供三語文案；plan 階段可給 placeholder（用既有 i18n messages 的 hero.subtitle）先打通、上線前 leadi 改實際 SEO 文字。
3. **og:image 三張設計** — 上線前必須換成 leadi 設計的三語版本；plan 階段先用 zh-Hant 一張共用（不阻塞 prerender 上線）。
4. **匯率 fallback 值更新頻率** — prerender 時用 hardcoded 值；建議每月手動更新一次（寫進 `src/lib/currency.ts`），plan 階段確認是否需 GitHub Actions 自動每月 PR 更新（v2 議題）。
5. **Search Console / Bing Webmaster Tools 帳號** — 上線後需 leadi 提交 sitemap；plan 階段不阻塞、上線後人工操作。

---

## 13. 鎖定前提（決策依據、不再 revisit）

- ✅ 採方案 B：保留 React + Vite 架構、加 build-time prerender + 三語獨立 URL
- ✅ Prerender 工具用 Playwright（不用 react-snap / vike / Astro）
- ✅ URL 結構：`/zh-Hant/` `/zh-Hans/` `/en/` 三條獨立路徑 + root redirect 頁
- ✅ 三語 SEO 文字人工撰寫、不機械翻譯
- ✅ JSON-LD 採 ProfessionalService + Offer + VideoObject 三類
- ✅ JSON-LD `priceCurrency` 永遠寫 TWD（schema 是實際定價、CNY/USD 是顯示用）
- ✅ og:image 1200x630 × 三語、手工 Figma 設計、不用 Vercel OG 動態生成
- ✅ sitemap.xml 含 hreflang 交叉指向（Google 優先信 sitemap、比 HTML hreflang 可靠）
- ✅ robots.txt 子路徑限制：本版接受、v2 接 custom domain 解決
- ✅ 不接 analytics、不接 SSR、不加 blog route（與 landing v1 一致）
- ✅ 4 天工程量、5 階段獨立 deploy、每階段可獨立驗證
- ✅ Hydration 一致性：URL path 偵測語言、匯率 fallback、scroll progress = 0 初始值
- ✅ CI/CD：GitHub Actions 擴充 prerender step、含 verify-prerender 失敗則 fail build

---

## 附錄 A：元前提自檢結果

依 CLAUDE.md「深度決策前的元前提自檢」執行，4 題答案：

| 維度 | 答案 |
|---|---|
| 目標使用者 | 繁中 TW + 簡中 CN/MY/SG + 英文國際 + 社群 IM bot（全選） |
| 類比參考 | 業界一般水準（不對齊特定競品） |
| Identity | 商業客戶接案門面、要生 lead |
| 動機 | 全選（趕著被找到 + 預防性 + 長期累積 + 社群預覽） |

四題答案揭露的新維度：

- **「社群 IM bot 不 render JS」**這項使「純加 meta」（方案 A）無法達成目標、必須做 prerender（方案 B）
- **「簡中 + 英文受眾」**揭露 hreflang + 三語獨立 URL 是必要工作、不是 nice-to-have
- **「商業生 lead」**確認投資強度足夠付 prerender + Schema 結構化資料的工程成本

## 附錄 B：方案 A / C 為何被排除

| 方案 | 排除理由 |
|---|---|
| **A：純加 meta + 不 prerender** | 解不了「社群 IM bot 看到空白」+「百度 / Bing 不 render JS」兩個關鍵痛點；目標使用者四項全選下不夠用 |
| **C：遷移 Astro** | 工作量 1-2 週（vs B 的 4 天）；site 才上線 2 個月、Tailwind breakpoints / 三語 i18n / scroll-driven blur 都已穩定、重寫成本太高；prerender 對痛點已完整解決；未來真要加 blog 再升 C 不晚（B 的 meta / sitemap / hreflang / JSON-LD 工作在 C 都能直接搬） |
