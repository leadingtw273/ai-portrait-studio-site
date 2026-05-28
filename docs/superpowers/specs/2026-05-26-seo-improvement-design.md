# AI Portrait Studio Site — SEO 強化設計規格

- **日期**：2026-05-26
- **狀態**：Spec v2，codex review 完、14 條意見全採納、待 user review final
- **撰寫**：Claude Code (Opus 4.7) + 使用者 leadi + Codex (gpt-5.5) review
- **前情**：`2026-05-21-landing-site-design.md`（landing site v1 已上線、SEO 當時 out of scope）
- **下一步**：user review → writing-plans skill 產出 implementation plan

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

### 1.3 成功標準（分兩階段、避免 placeholder 混淆完成度）

成功標準拆成 **Infrastructure Deploy 驗收**（Step 5 結束時、技術骨架到位）與 **Final Launch 驗收**（leadi 換完真實素材、可對外宣傳）兩階段：

#### 1.3.1 Infrastructure Deploy 驗收（Step 5 結束、可允許 placeholder 素材）

1. **每條語言 URL 用 `curl` 拿到的 HTML 含完整 hero / pricing / footer 文字**（不是空 `<div id="root">`） — 工具：`curl https://.../zh-Hant/ | grep "Mini Launch"`
2. **三條語言 URL 的 `<html lang>` 屬性正確**（zh-Hant / zh-Hans / en） — 工具：`curl ... | grep '<html lang'`
3. **hreflang alternate 在三條 HTML 與 sitemap.xml 都互相交叉指向、self-reference 含自身** — 工具：`curl ... | grep hreflang`
4. **三條 HTML 的 canonical / og:url / og:image / twitter:image / JSON-LD image / VideoObject thumbnailUrl 全為 absolute URL 含 base path** — 工具：`scripts/verify-prerender.ts` 規則 4-6 自動驗證（見 §5.5）
5. **JSON-LD 通過 [Schema.org Validator](https://validator.schema.org/) 無語法錯誤** — 上線後 manual 跑一次
6. **VideoObject 通過 Google Rich Results Test 必填欄位**（name / thumbnailUrl / uploadDate / description）；ProfessionalService **不保證**通過 rich result eligibility（Google 對服務類 rich result 通常需 address/geo/telephone/openingHours、本站線上接案模型不符 — JSON-LD 用作語意輔助、SERP 不一定有 rich snippet）
7. **Core Web Vitals LCP < 2.5s**（mobile）— 工具：PageSpeed Insights manual 抽查
8. **Search Console / Bing Webmaster Tools 帳號建立 + sitemap 提交完成**（GitHub Pages 子路徑 robots.txt 不生效的緩解；見 §6.2）

#### 1.3.2 Final Launch 驗收（leadi 換完三語素材、可對外宣傳）

9. **三語 og:image 各自製作完成**（不再共用 zh-Hant placeholder）— 工具：`scripts/verify-prerender.ts` 規則 8 檢查每語 og:image 檔名異於彼此
10. **LINE / Telegram / Facebook 貼三條語言 URL、預覽顯示對應語言 og:image + title + description**（不是其他語言 fallback） — 觀察方式：實際貼 TG / LINE / FB sharer
11. **三語 SEO 文字（title / description / og:title / og:description）為 leadi 人工撰寫版本、不是 placeholder（i18n messages reuse）**
12. **兩支 demo 影片各有靜態 poster jpg**（給 VideoObject thumbnailUrl 用）；上線前必須產出（ffmpeg 從 mp4 抽 frame 或手做）
13. **Search Console 觀察：三條 URL 都被 Google index**（上線後 1-2 週觀察）

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
├── main.tsx                     ← 改：createRoot → hydrateRoot（讓 prerender HTML 真的被接管，
│                                       否則 React 把 prerender DOM 當普通 children 重建、
│                                       prerender 等於白做）
├── i18n/
│   └── LanguageProvider.tsx     ← 改：detectInitialLang 改讀 URL pathname、不再讀 localStorage
├── sections/
│   └── Nav.tsx                  ← 改：語言切換器 onClick 改成 location.href 跳轉
├── components/
│   └── AddOnsCarousel.tsx       ← 改：移除 window.innerWidth → visibleCount JS state，
│                                       改 CSS-only responsive（Tailwind grid + container query
│                                       或 desktop:grid-cols-3 mobile:grid-cols-1）。
│                                       否則 prerender HTML 永遠是 desktop 3 卡、mobile mount 後
│                                       JS 才改 1 卡、首屏會 layout shift + hydration mismatch
├── lib/
│   ├── currency.ts              ← 改：SSR 安全（typeof window === 'undefined' guard）；
│   │                                   匯率 fallback hardcoded 值（每月手動更新）
│   ├── useCurrency.ts           ← 改：initial state 用 fallback（與 prerender 一致）、
│   │                                   client mount 後 fetch 才更新；保證 hydration 第一幀一致
│   └── seo/                     ← 新：SEO 配置中心
│       ├── meta.ts              ← 各語言 title / description / og 文字
│       ├── jsonld.ts            ← Schema.org 結構化資料生成（讀 content.ts + i18n）
│       └── canonicalUrl.ts      ← 統一 absolute URL helper（含 base path）；
│                                   ★ 所有 crawler-facing URL 都必須經此 helper、
│                                   禁止任何 crawler-facing 位置出現 relative URL
scripts/
├── prerender.ts                 ← 新：Playwright prerender 主腳本（含 viewport 策略）
├── generate-sitemap.ts          ← 新：sitemap.xml 生成
├── inject-seo-meta.ts           ← 新：把 prerender 出的 HTML 注入 SEO meta
├── generate-video-poster.ts     ← 新：ffmpeg 從 mp4 抽 frame 產出 poster jpg（VideoObject 必填）
└── verify-prerender.ts          ← 新：build artifact 深度驗證（見 §5.5）
public/
├── robots.txt                   ← 新
├── og/                          ← 新：1200x630 預覽圖（手做、Figma / Photoshop）
└── video-posters/               ← 新：兩支 demo 影片的 poster jpg
.github/workflows/
└── deploy.yml                   ← 改：build → preview server (trap cleanup) → prerender →
                                       generate-sitemap → verify-prerender → upload；
                                       含 Playwright Chromium binary cache step
```

### 3.4 Absolute URL Helper 統一規範（codex review #8 採納）

**所有 crawler-facing URL 必須由 `src/lib/seo/canonicalUrl.ts` 統一產生**，禁止 inline 字串拼接。

覆蓋範圍（不限於以下、任何被 bot 讀到的 URL 都納入）：

- `<link rel="canonical">`
- `<link rel="alternate" hreflang>`
- `<meta property="og:url">`
- `<meta property="og:image">` + `og:image:url`
- `<meta name="twitter:image">`
- JSON-LD `url` / `image` / `thumbnailUrl` / `contentUrl`
- sitemap.xml `<loc>` + hreflang `href`
- root `index.html` 的 `<meta http-equiv="refresh">` URL
- `<link rel="preload" as="image">` 的 hero-bg URL
- favicon `<link rel="icon">` href

**Helper 介面**：

```ts
// src/lib/seo/canonicalUrl.ts
const SITE_ORIGIN = 'https://<user>.github.io'       // build 時讀 env / vite define
const BASE_PATH   = '/ai-portrait-studio-site'        // 與 vite.config.ts base 一致

export function canonical(lang: Lang): string {
  return `${SITE_ORIGIN}${BASE_PATH}/${lang}/`
}
export function asset(relativeFromRoot: string): string {
  return `${SITE_ORIGIN}${BASE_PATH}/${relativeFromRoot}`
}
export function siteRoot(): string {
  return `${SITE_ORIGIN}${BASE_PATH}/`
}
```

`verify-prerender.ts` 會驗證每條 HTML 不含「裸路徑」（不以 `https://` 開頭的 crawler-facing URL）— 詳見 §5.5。

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

**設計決策說明**（codex review #12 採納）：

- **每條 HTML 必含 self-reference**（zh-Hant 頁也要有 `hreflang="zh-Hant"` 那條）— 這是 Google 文件要求；缺 self-reference 整組 hreflang 會被忽略
- **x-default 指向 zh-Hant 是商業主市場決策**（台灣 = 主市場），不是語言中性選擇。較標準的做法可以指 root 或語言選擇頁，但本版選 zh-Hant 以最大化主市場曝光
- **root `/` 不在 hreflang 範圍**：root 是 redirect 頁、`<meta name="robots" content="noindex">`，不該被當成 canonical

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

**Rich result eligibility 預期管理**（codex review #6 採納）：

ProfessionalService + Offer **語法有效**不等於 Google **rich result eligible**。Google 對服務類 rich result 通常要求更完整的商家資料（address / geo / telephone / openingHours），本站是線上接案服務、不符合 LocalBusiness 模型，**SERP 不一定會出現 rich snippet**。

JSON-LD 此處作為「語意輔助」用途：
- ✅ 讓 Google / Bing / ChatGPT 搜尋 bot 正確理解「我們提供什麼服務、價格區間多少、聯絡方式什麼」
- ✅ 通過 [Schema.org Validator](https://validator.schema.org/) 無語法錯誤
- ❌ 不保證 SERP 顯示價格 rich snippet（這是 Google 自家算法決定）

**2. VideoObject × 2**（兩支 demo 影片）：

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "產品宣傳短片 — AI 人臉 × 茶園實景",
  "description": "...",
  "thumbnailUrl": "https://.../video-posters/tea-product-promo.jpg",
  "contentUrl": "https://.../assets/tea-product-promo-xxxx.mp4",
  "uploadDate": "2026-05-21",
  "duration": "PT15S"
}
```

**VideoObject 必填欄位**（codex review #5 採納）：

`thumbnailUrl` 是 Google VideoObject 必填欄位、且必須可抓取 / 穩定 / absolute URL。**現有 assets 只有 mp4、沒有 poster jpg**，必須產出：

- 工作項：`scripts/generate-video-poster.ts` — 用 ffmpeg 從每支 mp4 抽第 1 秒 frame、產出 1280x720 jpg、放 `public/video-posters/`
- Vite hash 後 URL 注入：mp4 也經 Vite 處理會被 hash、`scripts/inject-seo-meta.ts` 必須讀 build 後的 manifest 取得實際 hash URL
- 沒 poster → Rich Results Test 直接 fail、VideoObject 無效

**Schema 設計決策**：

- 兩支影片各一段 VideoObject、各自獨立 `<script>` block
- 沒有 FAQ section → 不加 FAQPage schema（避免假數據）
- 沒有 ProductReview / AggregateRating → 不加（避免捏造評分）

**Offer `priceCurrency` 永遠寫 TWD 的決策**（codex review #7 採納、策略 A）：

JSON-LD `priceCurrency` 固定 TWD、頁面 zh-Hans / en 切顯示 ¥ / US$ 換算 — 這之間有同頁可見價格與結構化價格不一致的風險。**處理策略 A**（leadi 拍板）：

- **JSON-LD `priceCurrency` 永遠是 TWD**（schema 是「實際報價」、單一真實 source）
- **頁面 Pricing 卡 / 加購卡顯示換算價時、必須加註「約」字 + 一行小字註解「實際以 TWD 報價」**
  - zh-Hans 顯示「约 ¥ 2,775（实际以 TWD 报价）」
  - en 顯示「~US$ 408.6 (billed in TWD)」
  - zh-Hant 顯示「NT$ 12,800」（無註解、TWD 即實際報價）
- 註解文字加進 i18n messages：`pricing.currencyNote` / `addons.currencyNote`
- 達成「JSON-LD ↔ 可見內容語意一致」（不是字面一致、是語意一致）

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

// Prerender viewport 策略（codex review #3 採納）：
// 1. 統一用 desktop viewport 1280x720
// 2. 所有 responsive 差異 100% 由 CSS（Tailwind breakpoints + container query）處理
// 3. 禁止使用 window.innerWidth / matchMedia → state 改 DOM 結構（會造成 prerender
//    HTML 與 mobile mount 後 layout 不一致）
// 4. 這條規則由 §5.4 的 client-only state 處理規範與 §3.3 的 AddOnsCarousel 改造強制執行
const PRERENDER_VIEWPORT = { width: 1280, height: 720 }

const browser = await chromium.launch()
for (const lang of LANGS) {
  const page = await browser.newPage({ viewport: PRERENDER_VIEWPORT })
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

**為什麼只用 desktop viewport（不雙 viewport prerender）**：
- bot 從 prerender HTML 抓的是「語意內容」（hero 文字、pricing 方案、JSON-LD）、不是 layout pixels
- 所有 responsive 由 CSS 處理 → desktop HTML 在 mobile 也能正確 render（CSS class 在 client 重新計算）
- 雙 viewport prerender 等於兩倍 build 時間 + 兩套 sitemap URL（過度設計）
- **強制要求**：實作期間任何「依 viewport 改 DOM 結構」的 JS 都要被改成「CSS 控制 visibility / layout」（最明顯的例子 = AddOnsCarousel 的 visibleCount JS state）

### 5.4 Hydration 一致性處理（codex review #1 #2 採納、大幅擴充）

**前提：`src/main.tsx` 必須改 `createRoot` → `hydrateRoot`**（codex #1）

```tsx
// src/main.tsx — 改造後
import { hydrateRoot, createRoot } from 'react-dom/client'

const container = document.getElementById('root')!

// prerender HTML 已含完整 DOM → hydrate；
// dev mode 沒 prerender、index.html 是空殼 → createRoot
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />)
} else {
  createRoot(container).render(<App />)
}
```

**不改 hydrateRoot 的後果**：React client 把 prerender 出來的 DOM 當作普通 children 重建、整段 unmount→remount、prerender 等於白做、bot 拿到的內容沒被 React 接管、互動性失效。

---

prerender 抓到的 HTML 必須與 client 第一次 React render（hydration）結果一致，否則 React 19 會：

- 在 dev mode 丟 console warning
- 在 production 偵測到 mismatch 後**整段重 render**（client 看到的 DOM 不會壞、但 prerender 的 HTML 等於白做、bot 拿到的內容才是有效）

#### Client-only state 完整盤點（codex #2 採納）

| # | 狀態位置 | 風險 | 處理策略 |
|---|---|---|---|
| 1 | **`useCurrency.ts` 匯率 fetch** | prerender 時拿不到匯率、client mount 才 fetch、顯示「NT$ 12,800 → ¥ 2,775」一瞬間切換 = mismatch | prerender 時 initial state = hardcoded fallback（TWD/CNY=4.50、TWD/USD=0.031，每月手動更新一次寫進 `src/lib/currency.ts`）；client mount 後 fetch 真實匯率才 setState、`useCurrency` initial state **與 prerender 一致**；加 `typeof window !== 'undefined'` guard |
| 2 | **`App.tsx` scroll-driven blur** | progress 受 scrollY 影響 | initial `progress = 0`、prerender 與 client mount 第一幀都是 0、無 mismatch |
| 3 | **`LanguageProvider` 語言偵測** | 改造前讀 `navigator.language` / `localStorage`、client-only | 改造後讀 URL `pathname`（prerender 與 client 看到同樣 path、結果一致）；`navigator.language` 只在 root `index.html` 的 redirect 邏輯用、不在 React app 內 |
| 4 | **`AddOnsCarousel` viewport state** | 改造前讀 `window.innerWidth` → `visibleCount`（desktop 3 卡、tablet 2 卡、mobile 1 卡）、prerender 拿到 desktop 3 卡 HTML、mobile mount 後 JS 改 1 卡 = mismatch + 首屏 layout shift | **改 CSS-only responsive**：移除 visibleCount JS state、改用 Tailwind grid + container query（`grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3`）或 `@tailwindcss/container-queries`（已在 devDependencies）；DOM 永遠是 9 張卡、CSS 控制 visibility / scroll-snap |
| 5 | **`AddOnsCarousel` autoplay `setInterval`** | initial 不影響 DOM、只在 mount 後 schedule | mount 後 useEffect 才 start interval、prerender HTML 不受影響、OK |
| 6 | **`ScrollToTop` 的 `window.scrollY`** | `visible` initial state = false、scroll event 才更新 | initial state = false、prerender HTML 也是 hidden、無 mismatch；`useEffect` 內 `window.scrollY > 600` 判斷與綁 event 都是 mount 後行為 |
| 7 | **`App.tsx` hash scroll**（URL `#demo` 進場 scrollIntoView） | mount 後 requestAnimationFrame、不影響 prerender HTML | OK、純 mount-after 行為 |
| 8 | **`App.tsx` `matchMedia('(prefers-reduced-motion)')` snap rule** | jsdom 已 guard、mount 後才 read | OK；prerender 用 Chromium、`matchMedia` 存在但 useEffect 內 read、不影響 prerender HTML |
| 9 | **`localStorage` 讀寫** | prerender Chromium 有 localStorage 但跨 session 不持久；改造後 LanguageProvider 不再讀寫 localStorage（語言由 URL 決定） | LanguageProvider 內 localStorage 邏輯整段移除；其他元件若有用 localStorage 一律加 `typeof window !== 'undefined'` guard |
| 10 | **CSS scroll snap** | 純 CSS、與 JS state 無關 | OK |
| 11 | **`scroll hint` animate-bounce** | 純 Tailwind CSS animation、無 JS state | OK |

#### 強制檢查項

實作 Step 4 結束前、每個 React component 都要過一次「**prerender / mount 第一幀 DOM 一致**」檢查：

- 任何 `useState(() => somethingFromWindow)` 都要審查是否有 mismatch 風險
- 任何 effect 內的 `setState` 都是 mount-after、不影響 prerender HTML，但要確認 **initial state 與 prerender 一致**
- 任何 viewport / DOM measurement 都不能影響 DOM 結構（只能影響 mount-after 的 layout / behavior）

驗證手段：dev mode `localhost:5173` + `pnpm preview localhost:4173/<lang>/`、開 React DevTools console、檢查無 hydration warning。

### 5.5 Build artifact 驗證 step（codex review #14 採納、大幅擴充）

prerender 後加自動驗證（fail-fast、避免上線壞掉的 HTML）；單純 grep 字串不夠，加 6 項深度驗證：

```ts
// scripts/verify-prerender.ts
import { promises as fs } from 'fs'
import { parse } from 'node-html-parser'  // or cheerio
import { canonical, asset, siteRoot } from '../src/lib/seo/canonicalUrl'

const LANGS = ['zh-Hant', 'zh-Hans', 'en'] as const

// 規則 1：每語 HTML 基本完整性
for (const lang of LANGS) {
  const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
  assert(html.includes('<title>'), `${lang}: missing <title>`)
  assert(!html.includes('<div id="root"></div>'), `${lang}: prerender did not populate root`)
  assert(!html.includes('<script type="module" src="/src/main.tsx"'),
         `${lang}: dev URL leak — main.tsx reference must not appear in prod HTML`)
}

// 規則 2：每語 <html lang> 正確
for (const lang of LANGS) {
  const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
  const root = parse(html)
  const htmlLang = root.querySelector('html')?.getAttribute('lang')
  assert(htmlLang === lang, `${lang}: <html lang> is "${htmlLang}", expected "${lang}"`)
}

// 規則 3：每語 hreflang 集合完整（必含 zh-Hant / zh-Hans / en / x-default、self-reference）
const EXPECTED_HREFLANGS = ['zh-Hant', 'zh-Hans', 'en', 'x-default']
for (const lang of LANGS) {
  const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
  for (const hl of EXPECTED_HREFLANGS) {
    assert(html.includes(`hreflang="${hl}"`),
           `${lang}: hreflang set missing "${hl}" (need all 4: zh-Hant/zh-Hans/en/x-default)`)
  }
}

// 規則 4：所有 crawler-facing URL 為 absolute（含 base path）
const CRAWLER_URL_ATTRS = [
  'canonical', 'og:url', 'og:image', 'twitter:image',
  // JSON-LD 內的 url / image / thumbnailUrl / contentUrl 由規則 5 處理
]
for (const lang of LANGS) {
  const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
  const root = parse(html)
  for (const attr of CRAWLER_URL_ATTRS) {
    const val = root.querySelector(`[rel="${attr}"], [property="${attr}"], [name="${attr}"]`)
                   ?.getAttribute('href') ||
                root.querySelector(`[rel="${attr}"], [property="${attr}"], [name="${attr}"]`)
                   ?.getAttribute('content')
    if (!val) continue  // 某些 attr 不一定存在、缺則跳過
    assert(val.startsWith('https://'),
           `${lang}: ${attr} = "${val}" is not absolute URL`)
    assert(val.includes('/ai-portrait-studio-site/'),
           `${lang}: ${attr} = "${val}" is missing base path`)
  }
}

// 規則 5：JSON-LD parse-able 且必填欄位齊全
for (const lang of LANGS) {
  const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
  const root = parse(html)
  const scripts = root.querySelectorAll('script[type="application/ld+json"]')
  assert(scripts.length >= 2, `${lang}: expected >= 2 JSON-LD blocks (Service + Video), got ${scripts.length}`)
  for (const script of scripts) {
    let json: any
    try { json = JSON.parse(script.text) } catch (e) {
      throw new Error(`${lang}: JSON-LD parse error: ${e.message}`)
    }
    // ProfessionalService 必欄：name / url / contactPoint
    if (json['@type'] === 'ProfessionalService') {
      for (const k of ['name', 'url', 'contactPoint']) {
        assert(json[k], `${lang}: ProfessionalService missing "${k}"`)
      }
    }
    // VideoObject 必欄：name / thumbnailUrl / uploadDate / description（Google 要求）
    if (json['@type'] === 'VideoObject') {
      for (const k of ['name', 'thumbnailUrl', 'uploadDate', 'description']) {
        assert(json[k], `${lang}: VideoObject missing required field "${k}"`)
      }
      assert(json.thumbnailUrl.startsWith('https://'),
             `${lang}: VideoObject thumbnailUrl must be absolute`)
    }
  }
}

// 規則 6：root /index.html 有 noindex（不該被當成 canonical）
const rootHtml = await fs.readFile('dist/index.html', 'utf-8')
assert(rootHtml.includes('name="robots"') && rootHtml.includes('noindex'),
       'root index.html missing <meta name="robots" content="noindex">')

// 規則 7：三語 hreflang href 集合彼此完全一致（每條 HTML 內看到的三條外連 URL 必須相同）
const hreflangHrefs: Record<string, Set<string>> = {}
for (const lang of LANGS) {
  const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
  const root = parse(html)
  const links = root.querySelectorAll('link[rel="alternate"][hreflang]')
  hreflangHrefs[lang] = new Set(links.map(l => l.getAttribute('href')!))
}
const referenceSet = hreflangHrefs[LANGS[0]]
for (const lang of LANGS.slice(1)) {
  assert(setEquals(hreflangHrefs[lang], referenceSet),
         `${lang}: hreflang href set differs from ${LANGS[0]}`)
}

// 規則 8：Final Launch 階段 — 三語 og:image 互不相同（infrastructure deploy 可跳過此規則）
if (process.env.LAUNCH_VERIFY === 'true') {
  const ogImages = new Set<string>()
  for (const lang of LANGS) {
    const html = await fs.readFile(`dist/${lang}/index.html`, 'utf-8')
    const root = parse(html)
    const og = root.querySelector('meta[property="og:image"]')?.getAttribute('content')
    assert(og, `${lang}: missing og:image`)
    ogImages.add(og!)
  }
  assert(ogImages.size === LANGS.length,
         `Final Launch: og:image must be unique per language, got ${ogImages.size} unique among ${LANGS.length}`)
}

console.log('✅ verify-prerender passed')
```

**驗證失敗時 CI build 失敗、不上線**。

**規則對應 codex review 採納項**：
- 規則 1 / 2 / 3 → 基本完整性 + codex #14
- 規則 4 → codex #8 absolute URL helper
- 規則 5 → codex #5 + #6 JSON-LD 必填欄位
- 規則 6 → §3.1 root noindex 強制
- 規則 7 → codex #14 hreflang 一致性
- 規則 8 → codex #13 og:image placeholder gate（透過 env 開關控制 Final Launch 嚴格驗證）

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

### 6.2 robots.txt + Search Console launch 必做（codex review #4 採納）

```
User-agent: *
Allow: /

Sitemap: https://<user>.github.io/ai-portrait-studio-site/sitemap.xml
```

放 `public/robots.txt`、Vite 會原封不動複製到 dist root。

**已知限制：GitHub Pages 子路徑下 robots.txt 不生效**

GitHub Pages 用 `<user>.github.io` 整個帳號共享 root；搜尋引擎只認 `https://<user>.github.io/robots.txt`（帳號 root）、不會自動讀 `https://<user>.github.io/ai-portrait-studio-site/robots.txt`（子路徑）。因此：

- 子路徑下的 robots.txt **不會被當成全站 robots**
- 子路徑下的 sitemap URL **不會被搜尋引擎自動發現**

**緩解策略（必做、不是 nice-to-have）**：

1. **本版接受 robots.txt 子路徑限制**：仍放在子路徑作為 documentation 用途、提示開發者本站允許爬
2. **Search Console / Bing Webmaster Tools sitemap 手動提交列為 Launch 必做驗收**（§1.3.1 標準 #8）：
   - leadi 在 [Google Search Console](https://search.google.com/search-console/) 加入 property `https://<user>.github.io/ai-portrait-studio-site/`（URL prefix property）、提交 sitemap.xml
   - leadi 在 [Bing Webmaster Tools](https://www.bing.com/webmasters/) 同樣加 property + 提交 sitemap
   - 不做這步 → 搜尋引擎不知道 sitemap 存在 → 三條語言 URL 不會被 index → SEO 等於白做
3. **長期解：接 custom domain（v2 議題）**：custom domain 後 robots.txt 放在 domain root 才會被全網路爬蟲識別、不依賴 Webmaster Tools 手動提交

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

### 7.3 暫時 placeholder 策略（codex review #13 採納）

**Infrastructure Deploy 階段**（Step 5 結束、§1.3.1 驗收）：
- 三語 og:image 可暫用同一張 zh-Hant placeholder、reuse 不阻塞 prerender / sitemap / hreflang 等基礎建設先 deploy
- `verify-prerender.ts` 規則 8 由 `LAUNCH_VERIFY` env 控制、預設關閉、允許 placeholder

**Final Launch 階段**（leadi 完成三語素材後、§1.3.2 驗收）：
- **明確禁止 placeholder 進 production**：上線前必須產出三語各自 og:image
- `verify-prerender.ts` 規則 8 開啟（`LAUNCH_VERIFY=true`）、若三語 og:image 仍共用 placeholder、CI fail、不上線
- 配合 §1.3.2 #9 / #10 驗收項

**Launch checklist 明示**：
- ☐ `og-zh-Hans.jpg` 製作完成（非 zh-Hant 複製）
- ☐ `og-en.jpg` 製作完成（非 zh-Hant 複製）
- ☐ `LAUNCH_VERIFY=true pnpm verify-prerender` 通過
- ☐ 三條語言 URL 各自貼 LINE / Telegram / Facebook 預覽、確認 og:image 顯示對應語言視覺

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

## 9. GitHub Actions 調整（codex review #9 #10 採納）

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
      - uses: actions/configure-pages@v5             # ★ 保留:既有 deploy.yml 有此步、不可移除（codex #9）
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

      # Playwright Chromium binary cache（codex #10）— 避免每次 CI 重抓 ~200MB
      - name: Cache Playwright browsers
        id: playwright-cache
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
      - name: Install Playwright Chromium
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: pnpm exec playwright install chromium --with-deps

      - run: pnpm build                              # 既有

      # 起 preview server + PID trap cleanup（codex #9）
      - name: Start preview server (background)
        run: |
          pnpm preview --port 4173 &
          echo "PREVIEW_PID=$!" >> $GITHUB_ENV
      - name: Wait for preview server
        run: pnpm exec wait-on http://localhost:4173/ai-portrait-studio-site/ --timeout 30000

      - run: pnpm generate-video-poster              # 新:ffmpeg 抽 frame
      - run: pnpm prerender                          # 新:三語 prerender
      - run: pnpm generate-sitemap                   # 新:sitemap.xml
      - run: pnpm verify-prerender                   # 新:驗證 prerender 產出

      # 主動關 preview server（避免 runner 卡住）
      - name: Stop preview server
        if: always()
        run: kill ${PREVIEW_PID} 2>/dev/null || true

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

**關鍵改動 vs 現有 deploy.yml**（codex review #9 #10 採納）：

1. ✅ **保留 `actions/configure-pages@v5`** — 既有 deploy.yml 已有此步、絕不可移除（否則 Pages 部署設定回歸）
2. ✅ **Playwright Chromium binary 加 cache** — `actions/cache@v4` cache `~/.cache/ms-playwright`、key 用 `pnpm-lock.yaml` hash；cache hit 跳過 `playwright install`、CI 縮短 30-60s
3. ✅ **preview server PID 保存 + 明確 kill** — 避免 prerender 失敗時 background 程序遺留 / runner timeout
4. ✅ **wait-on timeout 30s** — preview server 起不來時 fail-fast、不掛無限等
5. ✅ **`generate-video-poster` 排在 `prerender` 之前** — 因 prerender 注入 SEO meta 時要參照 poster URL

### 9.2 新增 npm scripts（`package.json`）

```json
{
  "scripts": {
    "prerender": "tsx scripts/prerender.ts",
    "generate-video-poster": "tsx scripts/generate-video-poster.ts",
    "generate-sitemap": "tsx scripts/generate-sitemap.ts",
    "verify-prerender": "tsx scripts/verify-prerender.ts"
  },
  "devDependencies": {
    "playwright": "^1.49.0",
    "wait-on": "^8.0.0",
    "tsx": "^4.19.0",
    "node-html-parser": "^7.0.0"
  }
}
```

**CI 時間預估**（含 Playwright cache hit）：
- `install --frozen-lockfile`：~30s
- `lint + typecheck + test`：~60s
- `build`：~20s
- `playwright install`（cache hit）：~5s；（cache miss）：~60s
- `prerender + verify-prerender`：~30-45s（三語各 1 page、networkidle 等 ~10s/page）
- 整體：cache hit 約 3-4 min、cache miss 約 4-5 min

---

## 10. 施工順序（5 階段、每階段獨立 deploy 驗證；codex review #11 採納、工期上修）

| 階段 | 內容 | 工作量 | 立即效益 |
|---|---|---|---|
| **Step 1**：基本 SEO meta + sitemap + og:image | 改 `index.html` 寫死繁中 meta；新增 sitemap.xml / robots.txt / og-zh-Hant.jpg | 0.5 天 | Google SERP title / description 立即改善；繁中 IM 分享有預覽圖 |
| **Step 2**：三語路由改造 | 改 `LanguageProvider.detectInitialLang` 讀 URL；改 Nav 語言切換器跳 URL；root `index.html` 改成 redirect 頁；新增 `/zh-Hant/` `/zh-Hans/` `/en/` 三條 entry | 1 天 | 三語各自有 URL；hreflang 生效；Search Console 可分別追三條 |
| **Step 3**：JSON-LD 結構化資料 + 三語 og:image | `src/lib/seo/jsonld.ts` 生成 schema；三語各做 og:image | 0.5 天 | Google 理解服務內容；潛在 rich snippet；三語 IM 預覽完整 |
| **Step 4**：Prerender + Hydration 大改造（codex #1 #2 #11 上修） | 含 7 大工作項見 §10.0 細列 | **2.5-3 天** | 所有 bot 拿到完整 HTML；hydration 不 mismatch；百度 / Bing / ChatGPT 搜尋 bot 可正確 index |
| **Step 5**：GitHub Actions pipeline + 上線驗證 + Search Console 提交 | 改 `deploy.yml`（含 configure-pages 保留 / Playwright cache / preview server cleanup / generate-video-poster step）；上線後跑 Schema Validator + PageSpeed Insights + IM 分享預覽抽查；leadi 在 Search Console / Bing Webmaster Tools 提交 sitemap（§1.3.1 #8） | 1 天 | CI/CD 自動化；上線 sanity check；Search Console sitemap 已提交 |

**總計 5-6 天**（原估 4 天偏樂觀、上修以含 CI 失敗迭代時間 + Playwright route 調整 + Vite base path edge case + hydration warning 收斂）。

### 10.0 Step 4 工作項細列（codex review #11 採納）

| 子項 | 內容 | 工作量 |
|---|---|---|
| 4.1 | `src/main.tsx` 改 `createRoot → hydrateRoot`（含 dev mode 空殼 fallback） | 0.3 天 |
| 4.2 | `AddOnsCarousel` 改 CSS-only responsive（移除 `window.innerWidth → visibleCount` JS state）、refactor 完保留既有 carousel UX | 0.5 天 |
| 4.3 | `useCurrency` 改 SSR-safe + initial fallback 與 prerender 一致；Pricing / AddOns 補 `currencyNote` 渲染 | 0.4 天 |
| 4.4 | `scripts/prerender.ts` Playwright 三語抓 HTML、注入 SEO meta（含 absolute URL helper） | 0.5 天 |
| 4.5 | `scripts/generate-video-poster.ts` ffmpeg 抽 frame 產出兩支 demo poster jpg | 0.2 天 |
| 4.6 | `scripts/verify-prerender.ts` 八項深度驗證實作 | 0.4 天 |
| 4.7 | Hydration 偵錯：dev mode console + production 抽查、修剩餘 client-only state mismatch | 0.4-0.7 天 |
| **Step 4 小計** | | **2.7-3.0 天** |

### 10.1 Step-by-step deploy 風險控制

- 每階段都產出 functional commit、可獨立 deploy
- Step 1-3 是純加 meta / 加路由 / 加 JSON-LD、不破壞現有使用者體驗、可獨立上線
- 若 Step 4 prerender / hydration 遇大 bug、可暫不 deploy Step 4 commit、SEO 基礎（Step 1-3）仍在 production
- Step 4 是高風險步驟（React 19 hydration + Vite base path + Playwright route 三方互動的最複雜接點）、保留充裕 buffer 不要 force 縮 1.5 天
- Step 5 完成 = §1.3.1 Infrastructure Deploy 驗收（允許 placeholder 素材）
- 後續 Final Launch 由 leadi 換完三語素材後、跑一次 `LAUNCH_VERIFY=true pnpm verify-prerender` 確認、就是 §1.3.2 驗收

---

## 11. Out of scope（明確排除）

| 項目 | 為什麼不做 | 何時可能做 |
|---|---|---|
| **Server-side rendering（SSR）** | GitHub Pages 純靜態主機、無 Node runtime；prerender 已涵蓋 99% 需求 | 未來換主機（Vercel / Cloudflare Pages）+ 內容動態化時 |
| **Incremental Static Regeneration（ISR）** | 同上 | 同上 |
| **Custom domain** | v2 議題、會額外牽動 sitemap absolute URL、og:url、canonical 等多處 | 等品牌 domain 確定 |
| **Blog / Case Study route** | 一頁式 scope；landing v1 已 lock-out；prerender 架構 ready 但本版不接路由 | 累積案例後加 |
| **多於三語** | 三語已涵蓋目標市場；多語要重寫 i18n state 模型 | 加日 / 韓時 |
| ~~接 analytics~~ → **改為採納 GoatCounter（2026-05-28 leadi 決策）** | ~~landing v1 已 lock-out 不接 analytics；本版維持~~ → **採 GoatCounter：免費 / 無 cookie / async ~1.5KB JS / 自動 bot 過濾 / 三語 URL 自動分流統計**。詳見 §13 鎖定前提 + plan Task 22 | Google Analytics 4 / Plausible / Umami 仍 out-of-scope（cookie banner 拖累 LCP / 付費 / 自架 overhead） |
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

### 架構
- ✅ 採方案 B：保留 React + Vite 架構、加 build-time prerender + 三語獨立 URL
- ✅ Prerender 工具用 Playwright（不用 react-snap / vike / Astro）
- ✅ URL 結構：`/zh-Hant/` `/zh-Hans/` `/en/` 三條獨立路徑 + root redirect 頁

### React / Hydration（codex review v2 採納）
- ✅ `src/main.tsx` 改 `createRoot → hydrateRoot`（含 dev mode 空殼 fallback）— 不改 = prerender 等於白做
- ✅ `AddOnsCarousel` 改 CSS-only responsive（移除 `window.innerWidth → visibleCount` JS state）— 避免 prerender HTML 與 mobile mount 後 layout 不一致
- ✅ Prerender Playwright viewport 固定 desktop 1280x720、所有 responsive 100% 由 CSS 處理
- ✅ Hydration 一致性 11 項 client-only state 已盤點（見 §5.4）— URL path 偵測語言、匯率 fallback、scroll progress = 0 初始值、AddOnsCarousel CSS-only、ScrollToTop visible=false 初始

### SEO 內容
- ✅ 三語 SEO 文字人工撰寫、不機械翻譯
- ✅ JSON-LD 採 ProfessionalService + Offer + VideoObject 三類
- ✅ JSON-LD `priceCurrency` 永遠寫 TWD（schema 是實際定價）
- ✅ priceCurrency 策略 A：頁面 zh-Hans / en 顯示換算價需加註「約」+ 小字「實際以 TWD 報價」、達成 JSON-LD ↔ 可見內容語意一致
- ✅ ProfessionalService 不保證通過 Google rich result eligibility（線上接案、非 LocalBusiness）；JSON-LD 用作語意輔助而非 rich snippet 投資
- ✅ VideoObject `thumbnailUrl` 必填、需先用 ffmpeg 從 mp4 抽 frame 產出兩支 demo poster jpg
- ✅ og:image 1200x630 × 三語、手工 Figma 設計、不用 Vercel OG 動態生成
- ✅ x-default 指向 zh-Hant 是商業主市場決策（非語言中性）

### Crawler-facing URL（codex review #8 採納）
- ✅ 所有 crawler-facing URL（canonical / og:url / og:image / twitter:image / JSON-LD url / image / thumbnailUrl / contentUrl / sitemap loc / preload / favicon / meta refresh）統一由 `src/lib/seo/canonicalUrl.ts` 產生
- ✅ `verify-prerender.ts` 規則 4 強制驗證所有 crawler-facing URL 為 absolute 且含 base path

### Sitemap / robots
- ✅ sitemap.xml 含 hreflang 交叉指向（Google 優先信 sitemap、比 HTML hreflang 可靠）
- ✅ robots.txt 子路徑限制：本版接受、緩解策略 = Search Console / Bing Webmaster 手動提交 sitemap（§1.3.1 #8 launch 必做）
- ✅ Custom domain 是 v2 議題、不在本版範圍

### CI/CD
- ✅ GitHub Actions 保留既有 `actions/configure-pages@v5`、新增 Playwright Chromium binary cache、preview server PID trap cleanup
- ✅ `verify-prerender.ts` 失敗則 CI fail build、不上線
- ✅ Final Launch 驗收用 `LAUNCH_VERIFY=true` env 開啟嚴格規則（三語 og:image 必須各自獨立）

### 工期 / 驗收
- ✅ 5-6 天工程量、5 階段獨立 deploy、每階段可獨立驗證
- ✅ 成功標準拆 Infrastructure Deploy 驗收（8 項）vs Final Launch 驗收（5 項）
- ✅ 不接 SSR、不加 blog route（與 landing v1 一致）
- ✅ **採用 GoatCounter analytics（2026-05-28 leadi 決策、與 landing v1「不接 analytics」決策分歧）**：免費 / 無 cookie / async ~1.5KB JS / 自動 bot 過濾 / 三語 URL 自動分流統計；plan Task 22 整合進 Phase 5；不接 GA4 / Plausible / Umami（cookie banner / 付費 / 自架 overhead 與接案門面定位不符）

---

## 14. Codex review 採納紀錄（2026-05-26 第一版 spec）

Codex（gpt-5.5 / ChatGPT account）對 spec v1 review、共 14 條意見（11 P1 + 3 P2），使用者裁決後**全部採納**。處理對照：

| # | 嚴重度 | Codex 意見 | 處理 | 影響章節 |
|---|---|---|---|---|
| 1 | P1 | `createRoot` 沒改 `hydrateRoot` 導致 prerender 等於白做 | 採納、補 main.tsx 改造規範 | §3.3 §5.4 §13 |
| 2 | P1 | client-only state 盤點不完整（漏 AddOnsCarousel viewport / ScrollToTop / hash / matchMedia） | 採納、擴充為 11 項 client-only state 表 + AddOnsCarousel 改 CSS-only responsive | §3.3 §5.4 §13 |
| 3 | P1 | Prerender 沒指定 viewport、mobile bot 可能拿到 desktop 結構 | 採納、prerender 固定 desktop 1280x720 + 強制 responsive 由 CSS 處理 | §5.3 §13 |
| 4 | P1 | robots.txt 子路徑限制下、Search Console 提交應為 launch 必做 | 採納、§1.3.1 #8 列為驗收項、§6.2 補緩解策略 | §1.3 §6.2 §10 |
| 5 | P1 | VideoObject `thumbnailUrl` 必填、但 spec 引用的 poster jpg 不存在 | 採納、新增 `scripts/generate-video-poster.ts` ffmpeg 抽 frame | §3.3 §4.1.E §10 |
| 6 | P1 | ProfessionalService 語法有效不等於 Google rich result eligible | 採納、§1.3 #6 改成「JSON-LD 無語法錯誤；VideoObject 通過必填；ProfessionalService 不保證 rich result」 | §1.3 §4.1.E §13 |
| 7 | P1 | priceCurrency 永遠 TWD vs 頁面顯示 ¥/US$ 不一致 | 採納策略 A：頁面標註「約」+ 「實際以 TWD 報價」、JSON-LD 保 TWD | §4.1.E §10 §13 |
| 8 | P1 | absolute URL 規範不夠全面（漏 og:image / twitter:image / JSON-LD image / thumbnailUrl 等） | 採納、新增 §3.4 absolute URL helper 統一規範、verify-prerender 規則 4 強制驗證 | §3.3 §3.4 §5.5 §13 |
| 9 | P1 | GitHub Actions 範例少 `configure-pages@v5`、`pnpm preview &` 無 PID 清理 | 採納、§9.1 補保留 configure-pages + PID trap cleanup | §9.1 §13 |
| 10 | P1 | 沒提 Playwright Chromium binary CI cache、4 天估算沒含 CI 失敗迭代 | 採納、§9.1 加 actions/cache step + 工期上修 | §9.1 §10 §13 |
| 11 | P1 | 4 天工期低估、特別是 Step 4 應抓 2.5-3 天 | 採納、Step 4 上修 1.5 → 2.5-3 天、總工期 4 → 5-6 天、§10.0 新增 Step 4 子項細列 | §10 §13 |
| 12 | P2 | x-default 指向 zh-Hant 是市場決策、spec 應註明 | 採納、§4.1.D 補設計決策說明 | §4.1.D |
| 13 | P2 | og:image 三語暫共用與成功標準衝突、應拆 deploy vs launch 驗收 | 採納、§1.3 拆 1.3.1 Infrastructure Deploy / 1.3.2 Final Launch、verify-prerender 規則 8 用 LAUNCH_VERIFY env 控制 | §1.3 §5.5 §7.3 |
| 14 | P2 | verify-prerender 驗證太淺、應補深度檢查 | 採納、§5.5 擴為 8 項深度驗證（HTML 完整性 / `<html lang>` / hreflang 集合 / absolute URL / JSON-LD parse / root noindex / 三語 hreflang 一致 / Final Launch og:image 各異） | §5.5 |

**Spec 改動規模**：v1 (615 行) → v2 (~950 行) ；新增 §3.4 absolute URL helper、§10.0 Step 4 細列、§14 採納紀錄三段。

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
| **C：遷移 Astro** | 工作量 1-2 週（vs B 的 5-6 天）；site 才上線 2 個月、Tailwind breakpoints / 三語 i18n / scroll-driven blur 都已穩定、重寫成本太高；prerender 對痛點已完整解決；未來真要加 blog 再升 C 不晚（B 的 meta / sitemap / hreflang / JSON-LD 工作在 C 都能直接搬） |
