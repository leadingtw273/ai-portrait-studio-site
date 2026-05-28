# AI Portrait Studio Site — SEO 強化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把現有 React 19 + Vite 8 SPA landing site 強化為 SEO-friendly 三語靜態站（zh-Hant / zh-Hans / en 各自獨立 URL + build-time prerender + 完整 SEO meta + JSON-LD structured data）。

**Architecture:** 保留現有 React + Vite 架構、改 `createRoot → hydrateRoot`、新增 Playwright build-time prerender 產出三條語言 entry HTML、URL path 取代 localStorage 作為語言 truth source、所有 crawler-facing URL 由統一 helper 產生、CI 加 verify-prerender 自動驗證 8 項規則。

**Tech Stack:** React 19.2 / TypeScript 5.6 / Vite 8 / Tailwind CSS 3.4 / Playwright 1.49 / tsx 4 / node-html-parser 7 / GitHub Actions (existing) / pnpm 9 / Node 20

**Spec:** `docs/superpowers/specs/2026-05-26-seo-improvement-design.md`

**工作目錄**：所有路徑相對於 `/home/markchou/project/ai-portrait-studio-site/`、每個 step 在這個 repo 內執行（與 ai-influencers monorepo 完全解耦）。

**工作分支**：`main`（這個 repo 用 main 不是 master）。

**22 個 task 分 5 phase**：每個 phase 結束都可以獨立 deploy / 驗證、即使中途暫停也不破壞 production。Task 22 為 leadi 2026-05-28 追加 GoatCounter analytics 整合（Phase 5 收尾）。

> **★ v2（codex plan review 後）**：plan v1 的部分 test code 與現有 component 真實 API 不符（codex 抓到）。**執行任何 task 前先讀附錄 E**（30 條 review 意見 + 修正指引 + 真實 API）。受影響 task body 已標 `⚠️ 見附錄 E`。每個 task Step 1 一律先 `cat` 現有 component 確認 API 再寫 test。

---

## Phase 1 — 基本 SEO 骨架（Task 1-4，0.5 天）

完成後效益：Google SERP title / description 立即改善；繁中 IM 分享有預覽圖。

### Task 1：建 canonicalUrl helper + 測試（所有 crawler-facing URL 唯一 source）

**Files:**
- Create: `src/lib/seo/canonicalUrl.ts`
- Create: `tests/lib/seo/canonicalUrl.test.ts`

- [ ] **Step 1.1：寫 failing test**

```ts
// tests/lib/seo/canonicalUrl.test.ts
import { describe, it, expect } from 'vitest'
import {
  SITE_ORIGIN,
  BASE_PATH,
  canonical,
  asset,
  siteRoot,
  ogImage,
  videoPoster,
} from '@/lib/seo/canonicalUrl'

describe('canonicalUrl helpers', () => {
  it('SITE_ORIGIN starts with https://', () => {
    expect(SITE_ORIGIN).toMatch(/^https:\/\//)
  })

  it('BASE_PATH matches vite.config.ts', () => {
    expect(BASE_PATH).toBe('/ai-portrait-studio-site')
  })

  it('canonical(lang) returns absolute URL with base path and trailing slash', () => {
    expect(canonical('zh-Hant')).toBe(`${SITE_ORIGIN}${BASE_PATH}/zh-Hant/`)
    expect(canonical('zh-Hans')).toBe(`${SITE_ORIGIN}${BASE_PATH}/zh-Hans/`)
    expect(canonical('en')).toBe(`${SITE_ORIGIN}${BASE_PATH}/en/`)
  })

  it('siteRoot() returns base URL with trailing slash', () => {
    expect(siteRoot()).toBe(`${SITE_ORIGIN}${BASE_PATH}/`)
  })

  it('asset(path) returns absolute URL stripping leading slash if present', () => {
    expect(asset('favicon.svg')).toBe(`${SITE_ORIGIN}${BASE_PATH}/favicon.svg`)
    expect(asset('/favicon.svg')).toBe(`${SITE_ORIGIN}${BASE_PATH}/favicon.svg`)
  })

  it('ogImage(lang) returns absolute URL pointing to public/og/og-<lang>.jpg', () => {
    expect(ogImage('zh-Hant')).toBe(`${SITE_ORIGIN}${BASE_PATH}/og/og-zh-Hant.jpg`)
    expect(ogImage('en')).toBe(`${SITE_ORIGIN}${BASE_PATH}/og/og-en.jpg`)
  })

  it('videoPoster(name) returns absolute URL pointing to public/video-posters/<name>.jpg', () => {
    expect(videoPoster('tea-product-promo')).toBe(
      `${SITE_ORIGIN}${BASE_PATH}/video-posters/tea-product-promo.jpg`,
    )
  })
})
```

- [ ] **Step 1.2：跑 test 確認 fail**

Run: `pnpm test tests/lib/seo/canonicalUrl.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/seo/canonicalUrl"`

- [ ] **Step 1.3：實作 helper**

```ts
// src/lib/seo/canonicalUrl.ts
import type { Lang } from '@/i18n/LanguageProvider'

// build 時透過 vite define / env 注入；目前 hardcoded、上線確認 GH username 後改 env
export const SITE_ORIGIN = 'https://leadingtw273.github.io'
export const BASE_PATH = '/ai-portrait-studio-site'

function joinUrl(...parts: string[]): string {
  return parts
    .map((p, i) => (i === 0 ? p.replace(/\/$/, '') : p.replace(/^\/+|\/+$/g, '')))
    .filter(Boolean)
    .join('/')
}

export function canonical(lang: Lang): string {
  return `${joinUrl(SITE_ORIGIN, BASE_PATH, lang)}/`
}

export function siteRoot(): string {
  return `${joinUrl(SITE_ORIGIN, BASE_PATH)}/`
}

export function asset(relativeFromRoot: string): string {
  return joinUrl(SITE_ORIGIN, BASE_PATH, relativeFromRoot)
}

export function ogImage(lang: Lang): string {
  return asset(`og/og-${lang}.jpg`)
}

export function videoPoster(name: string): string {
  return asset(`video-posters/${name}.jpg`)
}
```

**注意**：`Lang` 型別還沒在 LanguageProvider 定義，現有 LanguageProvider.tsx 第 6 行有 `export type Lang = 'zh-Hant' | 'zh-Hans' | 'en'`，這個 import 應該直接可用。

- [ ] **Step 1.4：跑 test 確認 pass**

Run: `pnpm test tests/lib/seo/canonicalUrl.test.ts`
Expected: PASS（7 個 case 全綠）

- [ ] **Step 1.5：lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: 兩個都 0 error

- [ ] **Step 1.6：commit**

```bash
git add src/lib/seo/canonicalUrl.ts tests/lib/seo/canonicalUrl.test.ts
git commit -m "feat(seo): add canonicalUrl helper — single source for all crawler-facing URLs"
```

---

### Task 2：加強 `index.html` 繁中 SEO meta（暫不動三語、Step 2 才拆三條 HTML）

**Files:**
- Modify: `index.html`（完整 head 重寫）

- [ ] **Step 2.1：完整重寫 `index.html` head**

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <link rel="icon" type="image/svg+xml" href="/ai-portrait-studio-site/favicon.svg" />

    <title>AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 從 NT$ 3,500 起</title>
    <meta name="description" content="專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。Mini / Standard / Pro 三方案、含 9 種加購、Telegram 即時諮詢。" />
    <meta name="keywords" content="AI 人像,AI 寫真,LoRA 訓練,AI 影片,人像生成,商品形象,AI portrait,AI headshot" />
    <meta name="robots" content="index, follow" />

    <link rel="canonical" href="https://leadingtw273.github.io/ai-portrait-studio-site/" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成" />
    <meta property="og:description" content="專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。" />
    <meta property="og:url" content="https://leadingtw273.github.io/ai-portrait-studio-site/" />
    <meta property="og:image" content="https://leadingtw273.github.io/ai-portrait-studio-site/og/og-zh-Hant.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="zh_TW" />
    <meta property="og:site_name" content="AI 人像工作室" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成" />
    <meta name="twitter:description" content="專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。" />
    <meta name="twitter:image" content="https://leadingtw273.github.io/ai-portrait-studio-site/og/og-zh-Hant.jpg" />
  </head>
  <body class="bg-bg-base text-white antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**注意**：`og:image` 指向的檔案 Task 4 才會放進 public/og/、本 task 先把 reference 寫完整、檔案缺失只是 og preview 顯示空圖、不影響其他 SEO meta。

- [ ] **Step 2.2：build + preview 驗證**

```bash
pnpm build && pnpm preview --port 4173 &
sleep 3
curl -s http://localhost:4173/ai-portrait-studio-site/ | head -30
kill %1
```

Expected: stdout 含完整新 meta（title / description / og 等），不再是舊版「AI 人像工作室 — 專業的 AI 人像生成與影片製作服務」單句 description。

- [ ] **Step 2.3：commit**

```bash
git add index.html
git commit -m "feat(seo): enrich index.html meta with full OG / Twitter Card / canonical (zh-Hant baseline)"
```

---

### Task 3：新增 `public/sitemap.xml`（root-only）+ `public/robots.txt`

> ⚠️ **見附錄 E（Task 3）**：Phase 1 階段三語 URL 尚未生效（Task 7 才有）。Step 3.1 的 `public/sitemap.xml` **只放 root URL**、避免爬蟲看到 404；三語 sitemap 由 Task 17 build-time 生成覆寫 `dist/sitemap.xml`。下方 Step 3.1 列三語 URL 的版本已過時。

**Files:**
- Create: `public/sitemap.xml`
- Create: `public/robots.txt`

**注意**：本 task 的 sitemap 只列出 root URL（三語路徑要等 Task 7 路由改造後才有 URL），但 hreflang 集合已預先寫進去（即使 zh-Hant / zh-Hans / en URL 暫時 404、Search Console 仍可接受、上線 Step 2 後 URL 才會就位）。

- [ ] **Step 3.1：建 `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hans/" />
    <xhtml:link rel="alternate" hreflang="en"      href="https://leadingtw273.github.io/ai-portrait-studio-site/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <lastmod>2026-05-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hans/</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hans/" />
    <xhtml:link rel="alternate" hreflang="en"      href="https://leadingtw273.github.io/ai-portrait-studio-site/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <lastmod>2026-05-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://leadingtw273.github.io/ai-portrait-studio-site/en/</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hans/" />
    <xhtml:link rel="alternate" hreflang="en"      href="https://leadingtw273.github.io/ai-portrait-studio-site/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <lastmod>2026-05-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

**注意**：lastmod 暫用 hardcoded 日期、Task 17 會改成 build-time auto-generate。

- [ ] **Step 3.2：建 `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://leadingtw273.github.io/ai-portrait-studio-site/sitemap.xml
```

- [ ] **Step 3.3：build + 驗證複製**

```bash
pnpm build
ls dist/sitemap.xml dist/robots.txt
```

Expected: 兩個檔案都存在 dist root（Vite public/ 自動複製到 dist root）。

- [ ] **Step 3.4：commit**

```bash
git add public/sitemap.xml public/robots.txt
git commit -m "feat(seo): add sitemap.xml + robots.txt (hreflang cross-references for 3 languages)"
```

---

### Task 4：製作 `og-zh-Hant.jpg` placeholder（手動 / Figma）

**Files:**
- Create: `public/og/og-zh-Hant.jpg`（1200×630、< 300KB）

**這是手動 task、無 code、無 test**。subagent 執行時若無法做設計、應在 commit 內留 placeholder（用既有 hero-bg.jpg crop 1200x630）並標記「待 leadi 換正式設計」。

- [ ] **Step 4.1：建 `public/og/` 目錄**

```bash
mkdir -p public/og
```

- [ ] **Step 4.2：產出 og-zh-Hant.jpg placeholder**

選項 A（手動）：用 Figma / Photoshop 設計 1200×630 jpg、深紫色背景（#0E0B1F）+ 主標題「AI 人像工作室」+ 副標「LoRA 訓練・AI 寫真・影片人像生成」+ logo「✦」。

選項 B（自動 fallback、subagent 用）：用 ImageMagick / ffmpeg 從 `src/assets/hero-bg.jpg` crop 1200x630：

```bash
# 假設有 imagemagick
convert src/assets/hero-bg.jpg -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 public/og/og-zh-Hant.jpg
```

- [ ] **Step 4.3：驗證尺寸 + 檔案大小**

```bash
file public/og/og-zh-Hant.jpg
ls -lh public/og/og-zh-Hant.jpg
```

Expected: JPEG image data、1200x630、< 300KB。

- [ ] **Step 4.4：commit**

```bash
git add public/og/og-zh-Hant.jpg
git commit -m "feat(seo): add og-zh-Hant.jpg (1200x630 placeholder — leadi to replace before launch)"
```

---

## Phase 2 — 三語路由改造（Task 5-8，1 天）

完成後效益：三語各自獨立 URL；hreflang 生效；Search Console 可分別追三條。

### Task 5：`LanguageProvider.detectInitialLang` 改讀 URL pathname

**Files:**
- Modify: `src/i18n/LanguageProvider.tsx`
- Modify: `tests/i18n.test.tsx`（既有 test 可能需更新）

- [ ] **Step 5.1：先確認既有 test 結構**

```bash
cat tests/i18n.test.tsx
```

記下既有 test。下一步擴充新 test、不要砍既有。

- [ ] **Step 5.2：寫 failing test（新增 URL path 偵測 case）**

在 `tests/i18n.test.tsx` 加入：

```ts
import { renderHook } from '@testing-library/react'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { useT } from '@/i18n/useT'
import { describe, it, expect, beforeEach } from 'vitest'

describe('LanguageProvider — URL path detection (Task 5)', () => {
  beforeEach(() => {
    // 重置 location pathname
    window.history.replaceState({}, '', '/')
    localStorage.clear()
  })

  it('detects zh-Hant from /ai-portrait-studio-site/zh-Hant/', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('zh-Hant')
  })

  it('detects zh-Hans from /ai-portrait-studio-site/zh-Hans/', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hans/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('zh-Hans')
  })

  it('detects en from /ai-portrait-studio-site/en/', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/en/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('en')
  })

  it('falls back to navigator.language detection when URL has no lang prefix', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/')
    // navigator.language 預設 jsdom 給 en-US、預期 fallback 路徑進入 navigator 偵測、返回 en
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(['zh-Hant', 'en']).toContain(result.current.lang)
  })

  it('does NOT read localStorage anymore (URL is the only truth source)', () => {
    localStorage.setItem('ai-portrait-studio-lang', 'en')
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    // URL 是 zh-Hant、就算 localStorage 有 en、也是 zh-Hant
    expect(result.current.lang).toBe('zh-Hant')
  })
})
```

- [ ] **Step 5.3：跑 test 確認 fail**

Run: `pnpm test tests/i18n.test.tsx -t "URL path detection"`
Expected: FAIL（5 個 case 全紅、因為 detectInitialLang 還沒改）

- [ ] **Step 5.4：改寫 `LanguageProvider.tsx`**

```tsx
// src/i18n/LanguageProvider.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react'
import { zhHant, type Messages } from './messages.zh-hant'
import { zhHans } from './messages.zh-hans'
import { en } from './messages.en'

export type Lang = 'zh-Hant' | 'zh-Hans' | 'en'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Messages }
export const LanguageCtx = createContext<Ctx | null>(null)

const BASE_PATH = '/ai-portrait-studio-site'

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh-Hant'

  // 1) URL pathname 是 truth source
  const path = window.location.pathname
  if (path.includes(`${BASE_PATH}/zh-Hant/`)) return 'zh-Hant'
  if (path.includes(`${BASE_PATH}/zh-Hans/`)) return 'zh-Hans'
  if (path.includes(`${BASE_PATH}/en/`)) return 'en'

  // 2) root path（沒 lang prefix）才 fallback 到 navigator.language
  //    這個 fallback 主要給 dev mode `localhost:5173` 用、prod 上 root 是 redirect 頁
  const nav = navigator.language.toLowerCase()
  if (nav === 'zh-cn' || nav.startsWith('zh-hans') || nav === 'zh-sg' || nav === 'zh-my') return 'zh-Hans'
  if (nav.startsWith('zh')) return 'zh-Hant'
  if (nav.startsWith('en')) return 'en'
  return 'zh-Hant'
}

const DICTIONARY: Record<Lang, Messages> = {
  'zh-Hant': zhHant,
  'zh-Hans': zhHans,
  'en':      en,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectInitialLang)
  useEffect(() => {
    // 不再寫 localStorage（URL 是 truth source）
    document.documentElement.lang = lang
  }, [lang])
  const t = DICTIONARY[lang]
  return <LanguageCtx.Provider value={{ lang, setLang, t }}>{children}</LanguageCtx.Provider>
}
```

**關鍵改動**：
1. 移除 `STORAGE_KEY` 與 `localStorage.getItem` / `setItem` 兩處
2. `detectInitialLang` 從 URL pathname 偵測（含 base path）
3. root path 才 fallback navigator.language（給 dev mode 用）

- [ ] **Step 5.5：跑 test 確認 pass**

Run: `pnpm test tests/i18n.test.tsx`
Expected: PASS（新加 5 個 case + 既有 case 全綠）

- [ ] **Step 5.6：commit**

```bash
git add src/i18n/LanguageProvider.tsx tests/i18n.test.tsx
git commit -m "refactor(i18n): detectInitialLang reads URL pathname (URL is truth source, drop localStorage)"
```

---

### Task 6：Nav 語言切換器改成跳 URL（不只 setState）

**Files:**
- Modify: `src/sections/Nav.tsx`
- Modify: `tests/components/Nav.test.tsx`（若無則新建）

- [ ] **Step 6.1：找到既有 Nav.tsx 內語言切換器位置**

```bash
grep -n "setLang\|languageSwitcher" src/sections/Nav.tsx
```

記下 `onClick={() => setLang('zh-Hant')}` 之類的位置。

- [ ] **Step 6.2：寫 failing test**

```tsx
// tests/components/Nav.test.tsx（若已存在則加入新 describe）
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Nav } from '@/sections/Nav'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Nav — language switcher navigates to URL (Task 6)', () => {
  let originalLocation: Location

  beforeEach(() => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
    originalLocation = window.location
    // 不能直接設 location.href、要 spy
  })

  it('clicking 简中 button navigates to /ai-portrait-studio-site/zh-Hans/', async () => {
    const hrefSpy = vi.spyOn(window.location, 'href', 'set').mockImplementation(() => {})
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <Nav />
      </LanguageProvider>,
    )
    await user.click(screen.getByRole('button', { name: /简中/i }))
    expect(hrefSpy).toHaveBeenCalledWith(
      expect.stringContaining('/ai-portrait-studio-site/zh-Hans/'),
    )
    hrefSpy.mockRestore()
  })

  it('clicking EN button navigates to /ai-portrait-studio-site/en/', async () => {
    const hrefSpy = vi.spyOn(window.location, 'href', 'set').mockImplementation(() => {})
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <Nav />
      </LanguageProvider>,
    )
    await user.click(screen.getByRole('button', { name: /EN/i }))
    expect(hrefSpy).toHaveBeenCalledWith(
      expect.stringContaining('/ai-portrait-studio-site/en/'),
    )
    hrefSpy.mockRestore()
  })
})
```

**注意**：`window.location.href` 在 jsdom 不能直接 set、用 `vi.spyOn(window.location, 'href', 'set')` mock setter。若 jsdom 版本不支援、改用 `Object.defineProperty(window, 'location', { ... })` 重定義整個 location 物件（這個比較複雜、優先用 spyOn）。

- [ ] **Step 6.3：跑 test 確認 fail**

Run: `pnpm test tests/components/Nav.test.tsx`
Expected: FAIL（Nav 語言切換 button 還是 setState、沒跳 URL）

- [ ] **Step 6.4：改 `Nav.tsx` 內語言切換 onClick**

找到既有的語言切換 button group（通常是 zh-Hant / 简中 / EN 三個 button）、改 onClick：

```tsx
// 改造前（假設既有）：
<button onClick={() => setLang('zh-Hant')}>繁中</button>

// 改造後：
const BASE_PATH = '/ai-portrait-studio-site'

function navigateToLang(targetLang: Lang) {
  // 保留 hash（讓使用者在 #pricing 切語言後仍停在 #pricing）
  const hash = window.location.hash
  window.location.href = `${BASE_PATH}/${targetLang}/${hash}`
}

<button onClick={() => navigateToLang('zh-Hant')}>繁中</button>
<button onClick={() => navigateToLang('zh-Hans')}>简中</button>
<button onClick={() => navigateToLang('en')}>EN</button>
```

`Lang` 型別 import from `@/i18n/LanguageProvider`。`setLang` 不再 call（換 URL 後 page reload 會由 detectInitialLang 重判）。

- [ ] **Step 6.5：跑 test 確認 pass**

Run: `pnpm test tests/components/Nav.test.tsx`
Expected: PASS

- [ ] **Step 6.6：dev mode 手動驗證（subagent 跳過此步、CI 不需）**

```bash
pnpm dev
# 開 localhost:5173/ai-portrait-studio-site/zh-Hant/、點「简中」、URL 變成 zh-Hans 路徑
# 開 console 確認沒 hydration warning
```

- [ ] **Step 6.7：commit**

```bash
git add src/sections/Nav.tsx tests/components/Nav.test.tsx
git commit -m "feat(i18n): language switcher navigates to URL instead of setState"
```

---

### Task 7：Vite 配置產出三語 entry HTML 結構（rollupOptions 多 entry / 或 build-time copy）

**Files:**
- Modify: `vite.config.ts`
- Create: `scripts/copy-html-entries.ts`（build 後執行、把 dist/index.html 複製到 zh-Hant/ zh-Hans/ en/）

**設計選擇**：不用 Vite rollupOptions multi-entry（會產生重複 JS chunk），改為 build 後用 node script 複製 `dist/index.html` 到三條語言路徑、共用同一份 JS / CSS bundle。

- [ ] **Step 7.1：新增 `scripts/copy-html-entries.ts`**

```ts
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
```

- [ ] **Step 7.2：`package.json` 加 script**

```json
{
  "scripts": {
    "build": "tsc -b && vite build && tsx scripts/copy-html-entries.ts"
  },
  "devDependencies": {
    "tsx": "^4.19.0"
  }
}
```

- [ ] **Step 7.3：安裝 tsx**

```bash
pnpm add -D tsx@^4.19.0
```

- [ ] **Step 7.4：build 驗證**

```bash
pnpm build
ls dist/zh-Hant/index.html dist/zh-Hans/index.html dist/en/index.html
```

Expected: 三條 index.html 都存在、內容暫時相同（與 root index.html 一致；後續 Task 16 prerender 會分化內容）。

- [ ] **Step 7.5：preview 驗證三條路徑可訪問**

```bash
pnpm preview --port 4173 &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/ai-portrait-studio-site/zh-Hant/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/ai-portrait-studio-site/zh-Hans/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/ai-portrait-studio-site/en/
kill %1
```

Expected: 三個 HTTP 都 200。

- [ ] **Step 7.6：commit**

```bash
git add scripts/copy-html-entries.ts package.json pnpm-lock.yaml
git commit -m "feat(build): copy index.html to /zh-Hant/ /zh-Hans/ /en/ for 3-language routes"
```

---

### Task 8：root `dist/index.html` 改 redirect 頁（noindex + JS / meta refresh fallback）

**Files:**
- Modify: `scripts/copy-html-entries.ts`（複製完三條語言 HTML 後、覆寫 root index.html 為 redirect 頁）
- Create: `scripts/__fixtures__/root-redirect-template.html`（redirect 頁模板）

- [ ] **Step 8.1：新增 redirect 頁模板**

```html
<!-- scripts/__fixtures__/root-redirect-template.html -->
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <link rel="alternate" hreflang="zh-Hant" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <link rel="alternate" hreflang="zh-Hans" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hans/" />
    <link rel="alternate" hreflang="en"      href="https://leadingtw273.github.io/ai-portrait-studio-site/en/" />
    <link rel="alternate" hreflang="x-default" href="https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/" />
    <meta http-equiv="refresh" content="0; url=./zh-Hant/" />
    <title>AI 人像工作室 — AI Portrait Studio</title>
  </head>
  <body>
    <script>
      (function () {
        var BASE = '/ai-portrait-studio-site';
        var nav = (navigator.language || '').toLowerCase();
        var target = 'zh-Hant';
        if (nav === 'zh-cn' || nav.indexOf('zh-hans') === 0 || nav === 'zh-sg' || nav === 'zh-my') {
          target = 'zh-Hans';
        } else if (nav.indexOf('zh') === 0) {
          target = 'zh-Hant';
        } else if (nav.indexOf('en') === 0) {
          target = 'en';
        }
        location.replace(BASE + '/' + target + '/' + location.hash);
      })();
    </script>
    <noscript>
      <p>請前往 <a href="./zh-Hant/">繁體中文版</a>、<a href="./zh-Hans/">简体中文版</a> 或 <a href="./en/">English</a>。</p>
    </noscript>
  </body>
</html>
```

- [ ] **Step 8.2：改 `scripts/copy-html-entries.ts`**

```ts
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
```

- [ ] **Step 8.3：build + 驗證 root 是 redirect 頁、三條語言頁是 SPA app**

```bash
pnpm build
grep "noindex" dist/index.html
grep -L "noindex" dist/zh-Hant/index.html dist/zh-Hans/index.html dist/en/index.html
```

Expected:
- `dist/index.html` 含 `noindex`
- 三條語言頁**不**含 noindex

- [ ] **Step 8.4：驗證 root redirect 標記 + 直接 curl 三語 URL**

> ⚠️ **見附錄 E（Task 8）**：`curl -L` 不執行 JS redirect / meta refresh、不能靠它驗 redirect 結果。改驗 root HTML 標記 + 直接 curl 三語 URL。

```bash
pnpm preview --port 4173 &
PREVIEW_PID=$!
sleep 3
# 1) root HTML 含 redirect 標記（不靠 curl 跟隨）
grep -q 'noindex' dist/index.html && echo "✓ noindex"
grep -q 'http-equiv="refresh"' dist/index.html && echo "✓ meta refresh"
grep -q 'location.replace' dist/index.html && echo "✓ JS redirect"
# 2) 直接 curl 三語 URL（不靠 redirect）拿到內容
curl -s http://localhost:4173/ai-portrait-studio-site/zh-Hant/ | grep -q "hero-bg\|Mini Launch" && echo "✓ zh-Hant has content"
kill $PREVIEW_PID 2>/dev/null
```

Expected: 4 個 ✓ 都印出。

- [ ] **Step 8.5：commit**

```bash
git add scripts/copy-html-entries.ts scripts/__fixtures__/root-redirect-template.html
git commit -m "feat(seo): root index.html becomes redirect page with noindex (preserves SEO weight for lang URLs)"
```

---

## Phase 3 — JSON-LD + 三語 og:image + 價格註解（Task 9-11，0.5 天）

完成後效益：JSON-LD 讓 Google 理解服務內容；priceCurrency 策略 A 達成「JSON-LD ↔ 可見內容語意一致」。

### Task 9：i18n messages 加 `currencyNote` + Pricing / AddOns 卡渲染註解

> ⚠️ **見附錄 E（Task 9）**：PlanCard **無 tier prop、不用 useCurrency**。currencyNote 加在 **Pricing section（`src/sections/Pricing.tsx`）**、不是 PlanCard；下方 Step 9.1 / 9.6 的 `<PlanCard tier="pro" />` test code 已過時、改測 Pricing section。PlanCard API 不動。

**Files:**
- Modify: `src/i18n/messages.zh-hant.ts`
- Modify: `src/i18n/messages.zh-hans.ts`
- Modify: `src/i18n/messages.en.ts`
- Modify: `src/components/PlanCard.tsx`
- Modify: `src/components/AddOnCard.tsx`
- Modify: `tests/components/PlanCard.test.tsx`（若無則新建）

- [ ] **Step 9.1：寫 failing test**

```tsx
// tests/components/PlanCard.test.tsx（新增 currencyNote describe block）
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PlanCard } from '@/components/PlanCard'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('PlanCard — currency note (Task 9)', () => {
  function renderInLang(lang: 'zh-Hant' | 'zh-Hans' | 'en') {
    window.history.replaceState({}, '', `/ai-portrait-studio-site/${lang}/`)
    return render(
      <LanguageProvider>
        <PlanCard tier="pro" />
      </LanguageProvider>,
    )
  }

  it('zh-Hant does NOT show currency note (TWD is the actual price)', () => {
    renderInLang('zh-Hant')
    expect(screen.queryByText(/實際以 TWD 報價/)).not.toBeInTheDocument()
  })

  it('zh-Hans shows currency note "实际以 TWD 报价"', () => {
    renderInLang('zh-Hans')
    expect(screen.getByText(/实际以 TWD 报价/)).toBeInTheDocument()
  })

  it('en shows currency note "billed in TWD"', () => {
    renderInLang('en')
    expect(screen.getByText(/billed in TWD/i)).toBeInTheDocument()
  })

  it('zh-Hans price has "约" prefix', () => {
    renderInLang('zh-Hans')
    expect(screen.getByText(/约 ¥/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 9.2：跑 test 確認 fail**

Run: `pnpm test tests/components/PlanCard.test.tsx -t "currency note"`
Expected: FAIL（currencyNote key 還沒加進 messages、PlanCard 也還沒渲染）

- [ ] **Step 9.3：messages.zh-hant.ts 加 `pricing.currencyNote` + `addons.currencyNote`**

找到既有 `pricing: { ... }` block、加入：

```ts
pricing: {
  // ... 既有欄位 ...
  currencyNote: '',  // 繁中不顯示註解
  pricePrefix: '',   // 繁中價格無「約」前綴
},
addons: {
  // ... 既有欄位 ...
  currencyNote: '',
  pricePrefix: '',
},
```

- [ ] **Step 9.4：messages.zh-hans.ts 加對應內容**

```ts
pricing: {
  // ... 既有欄位 ...
  currencyNote: '实际以 TWD 报价',
  pricePrefix: '约 ',
},
addons: {
  // ... 既有欄位 ...
  currencyNote: '实际以 TWD 报价',
  pricePrefix: '约 ',
},
```

- [ ] **Step 9.5：messages.en.ts 加對應內容**

```ts
pricing: {
  // ... 既有欄位 ...
  currencyNote: 'billed in TWD',
  pricePrefix: '~',
},
addons: {
  // ... 既有欄位 ...
  currencyNote: 'billed in TWD',
  pricePrefix: '~',
},
```

- [ ] **Step 9.6：改 `PlanCard.tsx` 渲染註解**

找到既有價格顯示位置（類似 `<span>{formattedPrice}</span>`）、改成：

```tsx
import { useT } from '@/i18n/useT'
import { useCurrency } from '@/lib/useCurrency'

export function PlanCard({ tier }: Props) {
  const { t } = useT()
  const { formatPrice } = useCurrency()
  // ... 既有 logic ...

  return (
    <div>
      {/* ... 既有 JSX ... */}
      <div className="price">
        <span>{t.pricing.pricePrefix}{formatPrice(price)}</span>
        {t.pricing.currencyNote && (
          <p className="text-xs text-gray-400 mt-1">{t.pricing.currencyNote}</p>
        )}
      </div>
      {/* ... */}
    </div>
  )
}
```

**注意**：實際 PlanCard 內部結構需先用 `cat src/components/PlanCard.tsx` 看一遍、找到價格 render 位置插入。Currency note 只在非空字串時 render。

- [ ] **Step 9.7：改 `AddOnCard.tsx` 同樣加 pricePrefix + currencyNote**

```tsx
// 類似 PlanCard 改造、找到價格 render 位置：
<span>{t.addons.pricePrefix}{formatPrice(card.priceTwd)}</span>
{t.addons.currencyNote && (
  <p className="text-[10px] text-gray-400 mt-0.5">{t.addons.currencyNote}</p>
)}
```

- [ ] **Step 9.8：跑 test 確認 pass**

```bash
pnpm test tests/components/PlanCard.test.tsx
pnpm typecheck
```

Expected: PASS、typecheck 0 error。

- [ ] **Step 9.9：commit**

```bash
git add src/i18n/messages.*.ts src/components/PlanCard.tsx src/components/AddOnCard.tsx tests/components/PlanCard.test.tsx
git commit -m "feat(i18n): add currencyNote for zh-Hans/en (\"约/约/~\" + \"billed in TWD\" annotation)"
```

---

### Task 10：`src/lib/seo/meta.ts` 三語 SEO 文字 + `jsonld.ts` JSON-LD 生成

**Files:**
- Create: `src/lib/seo/meta.ts`
- Create: `src/lib/seo/jsonld.ts`
- Create: `tests/lib/seo/jsonld.test.ts`

- [ ] **Step 10.1：建 `src/lib/seo/meta.ts`**

```ts
// src/lib/seo/meta.ts
import type { Lang } from '@/i18n/LanguageProvider'

export type SeoMeta = {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogLocale: string         // FB OG 規格、底線分隔（zh_TW / zh_CN / en_US）
  keywords: string
}

export const SEO_META: Record<Lang, SeoMeta> = {
  'zh-Hant': {
    title: 'AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 從 NT$ 3,500 起',
    description: '專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。Mini / Standard / Pro 三方案、含 9 種加購、Telegram 即時諮詢。',
    ogTitle: 'AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成',
    ogDescription: '專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。',
    ogLocale: 'zh_TW',
    keywords: 'AI 人像,AI 寫真,LoRA 訓練,AI 影片,人像生成,商品形象,AI portrait,AI headshot',
  },
  'zh-Hans': {
    title: 'AI 人像工作室｜LoRA 训练・AI 写真・视频人像生成 — 约 ¥800 起',
    description: '专业 AI 人像工作室。LoRA 个人模型训练 + AI 商品形象写真 + AI 视频人像生成。Mini / Standard / Pro 三方案，含 9 种加购，Telegram 即时咨询。',
    ogTitle: 'AI 人像工作室｜LoRA 训练・AI 写真・视频人像生成',
    ogDescription: '专业 AI 人像工作室。LoRA 个人模型训练 + AI 商品形象写真 + AI 视频人像生成。',
    ogLocale: 'zh_CN',
    keywords: 'AI 写真,AI 头像,AI 形象,LoRA 训练,AI 视频,人像生成,商品形象',
  },
  'en': {
    title: 'AI Portrait Studio | LoRA Training・AI Headshots・Video Portraits — From US$ 109',
    description: 'Professional AI Portrait Studio. Custom LoRA training + AI brand photography + AI video portraits. Mini / Standard / Pro plans, 9 add-ons, instant Telegram consultation.',
    ogTitle: 'AI Portrait Studio | LoRA Training・AI Headshots・Video Portraits',
    ogDescription: 'Professional AI Portrait Studio. Custom LoRA training + AI brand photography + AI video portraits.',
    ogLocale: 'en_US',
    keywords: 'AI portrait studio,AI headshot,LoRA training,AI video,brand photography,personal AI model',
  },
}
```

**注意**：價格區間數字（NT$ 3,500 / ¥800 / US$ 109）是參考用、上線前 leadi 可調整；目前以 spec §1.3.2 #11「leadi 人工撰寫」為前提先放 placeholder。

- [ ] **Step 10.2：寫 `tests/lib/seo/jsonld.test.ts` failing test**

```ts
// tests/lib/seo/jsonld.test.ts
import { describe, it, expect } from 'vitest'
import { buildProfessionalServiceJsonLd, buildVideoObjectJsonLd } from '@/lib/seo/jsonld'

describe('JSON-LD generators (Task 10)', () => {
  describe('ProfessionalService', () => {
    it('contains required schema.org fields for zh-Hant', () => {
      const json = buildProfessionalServiceJsonLd('zh-Hant')
      expect(json['@context']).toBe('https://schema.org')
      expect(json['@type']).toBe('ProfessionalService')
      expect(json.name).toBeTruthy()
      expect(json.url).toMatch(/^https:\/\/.*\/zh-Hant\/$/)
      expect(json.image).toMatch(/^https:\/\/.*\/og\/og-zh-Hant\.jpg$/)
      expect(json.contactPoint).toBeTruthy()
      expect(json.contactPoint.url).toContain('t.me/')
    })

    it('OfferCatalog contains 4 plans (Discovery + Mini + Standard + Pro) with TWD price', () => {
      const json = buildProfessionalServiceJsonLd('zh-Hant')
      const offers = json.hasOfferCatalog.itemListElement
      expect(offers).toHaveLength(4)
      offers.forEach((o: any) => {
        expect(o['@type']).toBe('Offer')
        expect(o.priceCurrency).toBe('TWD')
        expect(Number(o.price)).toBeGreaterThan(0)
      })
    })

    it('priceCurrency is always TWD regardless of lang (codex review #7, strategy A)', () => {
      for (const lang of ['zh-Hant', 'zh-Hans', 'en'] as const) {
        const json = buildProfessionalServiceJsonLd(lang)
        json.hasOfferCatalog.itemListElement.forEach((o: any) => {
          expect(o.priceCurrency).toBe('TWD')
        })
      }
    })
  })

  describe('VideoObject', () => {
    it('contains Google-required fields: name / thumbnailUrl / uploadDate / description', () => {
      const json = buildVideoObjectJsonLd({
        name: 'tea-product-promo',
        title: '產品宣傳短片',
        description: 'AI 人臉 × 茶園實景',
        mp4FileName: 'tea-product-promo-abc123.mp4',
      })
      expect(json['@type']).toBe('VideoObject')
      expect(json.name).toBeTruthy()
      expect(json.thumbnailUrl).toMatch(/^https:\/\/.*\.jpg$/)
      expect(json.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(json.description).toBeTruthy()
      expect(json.contentUrl).toMatch(/^https:\/\/.*\.mp4$/)
    })
  })
})
```

- [ ] **Step 10.3：跑 test 確認 fail**

Run: `pnpm test tests/lib/seo/jsonld.test.ts`
Expected: FAIL

- [ ] **Step 10.4：實作 `src/lib/seo/jsonld.ts`**

```ts
// src/lib/seo/jsonld.ts
import type { Lang } from '@/i18n/LanguageProvider'
import { canonical, ogImage, videoPoster, asset } from './canonicalUrl'
import { PLAN_PRICES, DISCOVERY_PRICE, TELEGRAM_URL } from '@/data/content'
import { SEO_META } from './meta'

export type ProfessionalServiceJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'ProfessionalService'
  name: string
  alternateName?: string
  description: string
  url: string
  image: string
  priceRange: string
  areaServed: string[]
  contactPoint: {
    '@type': 'ContactPoint'
    url: string
    contactType: string
    availableLanguage: string[]
  }
  hasOfferCatalog: {
    '@type': 'OfferCatalog'
    name: string
    itemListElement: Array<{
      '@type': 'Offer'
      name: string
      price: string
      priceCurrency: 'TWD'
    }>
  }
}

const SERVICE_NAME: Record<Lang, string> = {
  'zh-Hant': 'AI 人像工作室',
  'zh-Hans': 'AI 人像工作室',
  'en':      'AI Portrait Studio',
}

const OFFER_NAMES: Record<Lang, { discovery: string; mini: string; standard: string; pro: string }> = {
  'zh-Hant': { discovery: 'Discovery Pack 試做', mini: 'Mini Launch', standard: 'Standard Launch', pro: 'Pro Launch' },
  'zh-Hans': { discovery: 'Discovery Pack 试做', mini: 'Mini Launch', standard: 'Standard Launch', pro: 'Pro Launch' },
  'en':      { discovery: 'Discovery Pack',      mini: 'Mini Launch', standard: 'Standard Launch', pro: 'Pro Launch' },
}

export function buildProfessionalServiceJsonLd(lang: Lang): ProfessionalServiceJsonLd {
  const meta = SEO_META[lang]
  const offers = OFFER_NAMES[lang]
  const minPrice = DISCOVERY_PRICE
  const maxPrice = PLAN_PRICES.enterprise
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SERVICE_NAME[lang],
    alternateName: lang === 'en' ? undefined : 'AI Portrait Studio',
    description: meta.description,
    url: canonical(lang),
    image: ogImage(lang),
    priceRange: `NT$${minPrice.toLocaleString()} - NT$${maxPrice.toLocaleString()}`,
    areaServed: ['TW', 'HK', 'SG', 'MY', 'CN', 'US'],
    contactPoint: {
      '@type': 'ContactPoint',
      url: TELEGRAM_URL,
      contactType: 'sales',
      availableLanguage: ['zh-Hant', 'zh-Hans', 'en'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'en' ? 'Service Plans' : '服務方案',
      itemListElement: [
        { '@type': 'Offer', name: offers.discovery, price: String(DISCOVERY_PRICE), priceCurrency: 'TWD' },
        { '@type': 'Offer', name: offers.mini,      price: String(PLAN_PRICES.basic), priceCurrency: 'TWD' },
        { '@type': 'Offer', name: offers.standard,  price: String(PLAN_PRICES.pro), priceCurrency: 'TWD' },
        { '@type': 'Offer', name: offers.pro,       price: String(PLAN_PRICES.enterprise), priceCurrency: 'TWD' },
      ],
    },
  }
}

export type VideoObjectJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'VideoObject'
  name: string
  description: string
  thumbnailUrl: string
  contentUrl: string
  uploadDate: string
  duration?: string
}

export type VideoObjectInput = {
  name: string           // 用於 poster 檔名 + JSON-LD name
  title: string          // 顯示用 title
  description: string
  mp4FileName: string    // Vite hash 後的 mp4 檔名（從 build manifest 取）
}

export function buildVideoObjectJsonLd(input: VideoObjectInput): VideoObjectJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: input.title,
    description: input.description,
    thumbnailUrl: videoPoster(input.name),
    contentUrl: asset(`assets/${input.mp4FileName}`),
    uploadDate: '2026-05-21',  // landing v1 上線日期、後續可改 build-time inject
    duration: 'PT15S',
  }
}
```

- [ ] **Step 10.5：跑 test 確認 pass**

Run: `pnpm test tests/lib/seo/jsonld.test.ts`
Expected: PASS

- [ ] **Step 10.6：commit**

```bash
git add src/lib/seo/meta.ts src/lib/seo/jsonld.ts tests/lib/seo/jsonld.test.ts
git commit -m "feat(seo): add meta.ts (3-lang SEO text) + jsonld.ts (ProfessionalService + VideoObject builders)"
```

---

### Task 11：`og-zh-Hans.jpg` + `og-en.jpg` placeholder（共用 zh-Hant）

**Files:**
- Create: `public/og/og-zh-Hans.jpg`
- Create: `public/og/og-en.jpg`

**注意**：本 task 只放 placeholder（共用 zh-Hant），Final Launch 階段（§1.3.2 #9）leadi 才換真實設計。

- [ ] **Step 11.1：複製 zh-Hant placeholder 給其他兩語**

```bash
cp public/og/og-zh-Hant.jpg public/og/og-zh-Hans.jpg
cp public/og/og-zh-Hant.jpg public/og/og-en.jpg
ls -lh public/og/
```

Expected: 三個 jpg 都存在、檔名分別 og-zh-Hant.jpg / og-zh-Hans.jpg / og-en.jpg。

- [ ] **Step 11.2：對照 spec §1.3.2 Final Launch checklist 確認佔位策略**

確認 `docs/superpowers/specs/2026-05-26-seo-improvement-design.md` §1.3.2 #9 已寫明「三語 og:image 各自製作完成（不再共用 zh-Hant placeholder）」— 不改 spec、確認後繼續。

- [ ] **Step 11.3：commit**

```bash
git add public/og/og-zh-Hans.jpg public/og/og-en.jpg
git commit -m "feat(seo): add og-zh-Hans.jpg + og-en.jpg placeholders (Final Launch will replace with per-lang designs)"
```

---

## Phase 4 — Prerender + Hydration 大改造（Task 12-18，2.5-3 天）

完成後效益：所有 bot 拿到完整 HTML；hydration 不 mismatch；百度 / Bing / ChatGPT 搜尋 bot 可正確 index。

### Task 12：`src/main.tsx` 改 `createRoot → hydrateRoot`（含 dev 空殼 fallback）

> ⚠️ **見附錄 E（Task 12）**：下方 Step 12.1 的 `vi.importMock('react-dom/client')` test 不可靠。改為 main.tsx export `mountApp(container)` 純函式、test 直接測 `mountApp` 傳 mock container。執行順序：Task 12 排在 Task 13 / 14 之後、最後驗一次 console hydration warning。

**Files:**
- Modify: `src/main.tsx`
- Create: `tests/main.test.tsx`（smoke test 確認 logic）

- [ ] **Step 12.1：寫 failing test**

```tsx
// tests/main.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('main.tsx — hydrate vs createRoot logic (Task 12)', () => {
  let hydrateRootSpy: any
  let createRootSpy: any

  beforeEach(() => {
    vi.resetModules()
    // jsdom 預設 root 為空、與 dev mode 一致
    document.body.innerHTML = '<div id="root"></div>'
  })

  it('uses createRoot when root has no children (dev mode / empty shell)', async () => {
    const mod = await vi.importMock<any>('react-dom/client')
    createRootSpy = vi.fn().mockReturnValue({ render: vi.fn() })
    hydrateRootSpy = vi.fn()
    vi.mocked(mod.createRoot).mockImplementation(createRootSpy)
    vi.mocked(mod.hydrateRoot).mockImplementation(hydrateRootSpy)

    await import('@/main')

    expect(createRootSpy).toHaveBeenCalled()
    expect(hydrateRootSpy).not.toHaveBeenCalled()
  })

  it('uses hydrateRoot when root has children (prerender HTML)', async () => {
    document.body.innerHTML = '<div id="root"><nav>prerendered content</nav></div>'
    const mod = await vi.importMock<any>('react-dom/client')
    createRootSpy = vi.fn().mockReturnValue({ render: vi.fn() })
    hydrateRootSpy = vi.fn()
    vi.mocked(mod.createRoot).mockImplementation(createRootSpy)
    vi.mocked(mod.hydrateRoot).mockImplementation(hydrateRootSpy)

    await import('@/main')

    expect(hydrateRootSpy).toHaveBeenCalled()
    expect(createRootSpy).not.toHaveBeenCalled()
  })
})
```

**注意**：vitest 對 `vi.importMock` + dynamic import 的處理可能需調整、若 mock 不生效改用「export 一個 `mountApp(container)` function、test mountApp 即可」的 refactor 路徑。

- [ ] **Step 12.2：跑 test 確認 fail**

Run: `pnpm test tests/main.test.tsx`
Expected: FAIL（main.tsx 目前無條件 createRoot）

- [ ] **Step 12.3：改寫 `src/main.tsx`**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/noto-sans-tc/400.css'
import '@fontsource/noto-sans-tc/600.css'
import '@fontsource/noto-sans-tc/700.css'
import './styles/globals.css'
import { App } from './App'
import { LanguageProvider } from './i18n/LanguageProvider'

const container = document.getElementById('root')!
const tree = (
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
)

// hasChildNodes() = true → prerender HTML 已渲染、用 hydrateRoot 接管
// hasChildNodes() = false → dev mode / 空殼 → 用 createRoot 從頭 render
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
```

**順便砍掉**：
1. `@fontsource/inter/400.css`（performance 優化、Inter 600/700 已足夠、400 weight 不用）

- [ ] **Step 12.4：跑 test 確認 pass**

Run: `pnpm test tests/main.test.tsx`
Expected: PASS

- [ ] **Step 12.5：build + dev mode 抽查 hydration**

```bash
pnpm dev
# 開 http://localhost:5173/ai-portrait-studio-site/
# 預期：dev mode 空殼 → createRoot path、頁面 render 正常、console 0 error
```

- [ ] **Step 12.6：commit**

```bash
git add src/main.tsx tests/main.test.tsx
git commit -m "feat(main): hydrateRoot for prerendered HTML, createRoot for dev / empty shell"
```

---

### Task 13：`AddOnsCarousel` hydration-safe（visibleCount 初始固定 3 + AddOnCard role）

> ⚠️ **見附錄 E（Task 13 + E.3 最小改法）**：下方 Step 13.4 的「全面改 CSS-only scroll-snap」風險高（會動 autoplay/dots/translateX 整套）。**最小改法**：保留現有 translateX + autoplay + dots UX，只把 `useState(3)` 維持初始固定 `3`（與 prerender desktop 1280 一致、hydration 第一幀無 mismatch），mount 後 useEffect 才依 innerWidth 調整；AddOnCard 最外層 `<div>` 加 `role="article"` 供 test 抓。下方 Step 13.2 test 用 `getAllByRole('article')` 需此 role。CSS-only 全改降為 P2 可選。

**Files:**
- Modify: `src/components/AddOnsCarousel.tsx`
- Modify: `tests/components/AddOnsCarousel.test.tsx`

**這是 Phase 4 最大的 refactor**。`AddOnsCarousel` 原本依 `window.innerWidth` 改 `visibleCount` → DOM 結構（desktop 3 卡、tablet 2 卡、mobile 1 卡），這在 prerender 時拿不到正確 viewport、會 mismatch。

- [ ] **Step 13.1：讀現有 component、記下結構**

```bash
cat src/components/AddOnsCarousel.tsx
cat tests/components/AddOnsCarousel.test.tsx 2>/dev/null || echo "no existing test"
```

記下：
- `visibleCount` state 怎麼算出來
- `startIdx` clamp logic
- prev / next button onClick 怎麼改 `startIdx`
- 卡片渲染怎麼用 `visibleCount` + `startIdx` 切 slice

- [ ] **Step 13.2：寫 failing test（基於 CSS 層改造後的行為）**

```tsx
// tests/components/AddOnsCarousel.test.tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { AddOnsCarousel } from '@/components/AddOnsCarousel'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('AddOnsCarousel — CSS-only responsive (Task 13)', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
  })

  it('renders all 9 cards in DOM regardless of viewport (CSS controls visibility)', () => {
    render(
      <LanguageProvider>
        <AddOnsCarousel />
      </LanguageProvider>,
    )
    // 9 張卡片全在 DOM 內、CSS 用 grid / overflow / scroll-snap 控制可視範圍
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(9)
  })

  it('does NOT depend on window.innerWidth (no JS resize listener)', () => {
    // 監聽 addEventListener('resize', ...)
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    render(
      <LanguageProvider>
        <AddOnsCarousel />
      </LanguageProvider>,
    )
    const resizeCalls = addEventListenerSpy.mock.calls.filter(([evt]) => evt === 'resize')
    expect(resizeCalls).toHaveLength(0)
    addEventListenerSpy.mockRestore()
  })

  it('scroll buttons exist and scroll horizontally', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <AddOnsCarousel />
      </LanguageProvider>,
    )
    const next = screen.getByRole('button', { name: /下一張|next/i })
    const prev = screen.getByRole('button', { name: /上一張|prev/i })
    expect(next).toBeInTheDocument()
    expect(prev).toBeInTheDocument()
    // CSS scroll-snap 容器
    const track = screen.getByTestId('addons-track')
    expect(track).toHaveClass('snap-x')
  })
})
```

**注意**：`vi` import 需加 `import { vi } from 'vitest'`。

- [ ] **Step 13.3：跑 test 確認 fail**

Run: `pnpm test tests/components/AddOnsCarousel.test.tsx`
Expected: FAIL（既有 carousel 還有 resize listener、卡片數依 viewport）

- [ ] **Step 13.4：refactor `AddOnsCarousel.tsx`**

完整重寫成 CSS-only：

```tsx
// src/components/AddOnsCarousel.tsx
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { ADDON_CARDS } from '@/data/content'
import { AddOnCard } from './AddOnCard'

export function AddOnsCarousel() {
  const { t } = useT()
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.clientWidth / getVisibleCount() // 動態算「一張卡寬度」、用 CSS 視覺一致
    const offset = direction === 'next' ? cardWidth : -cardWidth
    track.scrollBy({ left: offset, behavior: 'smooth' })
  }

  // 取得「目前 viewport 顯示幾張」— 只用於 scroll 步進的 UX，不影響 DOM
  // 純看當下 scrollWidth / clientWidth 算、不依 window.innerWidth state
  const getVisibleCount = (): number => {
    const track = trackRef.current
    if (!track) return 1
    const firstCard = track.querySelector<HTMLElement>('[data-card]')
    if (!firstCard) return 1
    return Math.max(1, Math.round(track.clientWidth / firstCard.clientWidth))
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t.addons.prevLabel}
        onClick={() => scroll('prev')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 ..."
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div
        ref={trackRef}
        data-testid="addons-track"
        className="
          flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
        style={{ scrollbarWidth: 'none' }}
      >
        {ADDON_CARDS.map((card) => (
          <div
            key={card.key}
            data-card
            className="
              shrink-0 snap-start
              w-full mobile:w-[calc(50%-0.5rem)] tablet:w-[calc(33.333%-0.667rem)]
            "
          >
            <AddOnCard data={card} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label={t.addons.nextLabel}
        onClick={() => scroll('next')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 ..."
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
```

**關鍵改動**：
1. ❌ 移除 `const [visibleCount, setVisibleCount] = useState(...)` JS state
2. ❌ 移除 `useEffect(() => { window.addEventListener('resize', ...) }, [])` resize listener
3. ❌ 移除 `const [startIdx, setStartIdx] = useState(0)` slice index
4. ✅ DOM 永遠是 9 張卡（map ADDON_CARDS 全部）
5. ✅ 卡片寬度用 Tailwind responsive class（`w-full mobile:w-[calc(50%-0.5rem)] tablet:w-[calc(33.333%-0.667rem)]`）
6. ✅ Scroll 用 `track.scrollBy()` + CSS `scroll-snap` + `snap-mandatory`
7. ✅ `AddOnCard` 不變、外層 wrapper div 控寬度

**保留 UX**：
- prev/next button 可點 → scroll 一張卡寬度
- mobile 一次看 1 張、tablet 一次看 2 張、desktop 一次看 3 張
- scroll-snap 確保停在卡片邊緣

- [ ] **Step 13.5：跑 test 確認 pass**

Run: `pnpm test tests/components/AddOnsCarousel.test.tsx`
Expected: PASS

- [ ] **Step 13.6：dev mode 手動驗證所有 RWD 切點**

```bash
pnpm dev
# 開 dev tools、切 device toolbar：
# - mobile (425px) → 一張卡
# - tablet (768px) → 2 張卡
# - desktop (1024px+) → 3 張卡
# 點 prev/next button → scroll 一張卡距離、snap 到卡邊緣
# console 0 error
```

- [ ] **Step 13.7：commit**

```bash
git add src/components/AddOnsCarousel.tsx tests/components/AddOnsCarousel.test.tsx
git commit -m "refactor(AddOnsCarousel): CSS-only responsive (drop window.innerWidth state, all 9 cards in DOM)"
```

---

### Task 14：`useCurrency` hydration 一致（保留現有 API、靠 prerender block 外部 fetch）

> ⚠️ **見附錄 E（Task 14）**：下方 Step 14.4 引入 `FALLBACK_RATES` 的方向**錯誤**。現有 `useCurrency` 回傳 `{currency, symbol, rate, format}`（是 `format` 不是 `formatPrice`、rate 初始 `null`、已有 null→TWD 原價 fallback）。**保留現有 API 不改簽章**；hydration 一致性改靠 Task 16 prerender route block 外部匯率 fetch → rate 停 null → prerender HTML 顯示 TWD 原價、與 client 第一幀一致。本 task 可能只需「確認 SSR-safe（fetchRates 加 typeof window guard）」、不需大改。

**Files:**
- Modify: `src/lib/currency.ts`
- Modify: `src/lib/useCurrency.ts`
- Modify: `tests/lib/currency.test.ts`

- [ ] **Step 14.1：讀現有 currency.ts / useCurrency.ts**

```bash
cat src/lib/currency.ts
cat src/lib/useCurrency.ts
cat tests/lib/currency.test.ts 2>/dev/null || echo "no existing test"
```

記下：
- 匯率 fetch 流程
- localStorage cache key
- TWD/CNY、TWD/USD 數字

- [ ] **Step 14.2：寫 failing test（SSR-safe + initial fallback）**

```ts
// tests/lib/currency.test.ts（加新 describe block）
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCurrency, FALLBACK_RATES } from '@/lib/useCurrency'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('useCurrency — SSR-safe + initial fallback (Task 14)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('FALLBACK_RATES has stable hardcoded values for prerender', () => {
    expect(FALLBACK_RATES.CNY).toBeGreaterThan(0)
    expect(FALLBACK_RATES.USD).toBeGreaterThan(0)
    expect(FALLBACK_RATES.CNY).toBeLessThan(10)  // CNY/TWD < 10 always
  })

  it('initial state uses FALLBACK_RATES (prerender consistency)', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hans/')
    const { result } = renderHook(() => useCurrency(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    // First render = prerender result, fallback rates apply
    expect(result.current.rate).toBe(FALLBACK_RATES.CNY)
  })

  it('en lang uses USD fallback', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/en/')
    const { result } = renderHook(() => useCurrency(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.rate).toBe(FALLBACK_RATES.USD)
  })

  it('zh-Hant returns 1 (TWD is the actual price, no conversion)', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
    const { result } = renderHook(() => useCurrency(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.rate).toBe(1)
  })
})
```

- [ ] **Step 14.3：跑 test 確認 fail**

Run: `pnpm test tests/lib/currency.test.ts -t "SSR-safe"`
Expected: FAIL（`FALLBACK_RATES` not exported）

- [ ] **Step 14.4：改 `src/lib/useCurrency.ts`**

```ts
// src/lib/useCurrency.ts
import { useEffect, useState } from 'react'
import { useT } from '@/i18n/useT'
import type { Lang } from '@/i18n/LanguageProvider'

// Hardcoded fallback rates — 每月手動更新一次（spec §5.4）
// 來源：open.er-api.com 2026-05 月平均
export const FALLBACK_RATES = {
  CNY: 0.2168,  // 1 TWD ≈ 0.2168 CNY
  USD: 0.0319,  // 1 TWD ≈ 0.0319 USD
} as const

function getFallbackRate(lang: Lang): number {
  if (lang === 'zh-Hans') return FALLBACK_RATES.CNY
  if (lang === 'en') return FALLBACK_RATES.USD
  return 1  // zh-Hant 用 TWD 原價
}

function getCurrencyCode(lang: Lang): 'TWD' | 'CNY' | 'USD' {
  if (lang === 'zh-Hans') return 'CNY'
  if (lang === 'en') return 'USD'
  return 'TWD'
}

const CACHE_KEY = 'ai-portrait-studio-rates'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

type Rates = { CNY: number; USD: number; timestamp: number }

function readCache(): Rates | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Rates
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(cny: number, usd: number) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ CNY: cny, USD: usd, timestamp: Date.now() }))
  } catch {
    // localStorage 滿 / 禁用、ignore
  }
}

export function useCurrency() {
  const { lang } = useT()
  // ★ initial state 用 fallback（與 prerender 一致），client mount 後才 fetch
  const [rate, setRate] = useState<number>(() => getFallbackRate(lang))

  useEffect(() => {
    // 1. 先試 localStorage cache
    const cached = readCache()
    if (cached) {
      setRate(lang === 'zh-Hans' ? cached.CNY : lang === 'en' ? cached.USD : 1)
      return
    }
    // 2. cache 過期 / 不存在 → fetch
    if (lang === 'zh-Hant') return  // 繁中不需匯率、用 TWD 原價
    fetch('https://open.er-api.com/v6/latest/TWD')
      .then((r) => r.json())
      .then((data) => {
        const cny = data?.rates?.CNY
        const usd = data?.rates?.USD
        if (cny && usd) {
          writeCache(cny, usd)
          setRate(lang === 'zh-Hans' ? cny : usd)
        }
      })
      .catch(() => {
        // fetch 失敗、保留 fallback、不切回原價避免 flicker
      })
  }, [lang])

  const formatPrice = (priceTwd: number): string => {
    const code = getCurrencyCode(lang)
    if (code === 'TWD') return `NT$ ${priceTwd.toLocaleString()}`
    // 公式：TWD × rate × 1.005（小幅買賣價差）、無條件進位 1 位小數
    const converted = Math.ceil(priceTwd * rate * 1.005 * 10) / 10
    const symbol = code === 'CNY' ? '¥' : 'US$'
    return `${symbol} ${converted.toFixed(1)}`
  }

  return { rate, formatPrice }
}
```

**關鍵改動**：
1. ✅ Export `FALLBACK_RATES` 給 test 用
2. ✅ `useState(() => getFallbackRate(lang))` — initial state = fallback、與 prerender 一致
3. ✅ `typeof window === 'undefined'` guard 在 readCache / writeCache
4. ✅ fetch 失敗時保留 fallback、不切回原 TWD（避免 flicker）

- [ ] **Step 14.5：跑 test 確認 pass**

```bash
pnpm test tests/lib/currency.test.ts
pnpm typecheck
```

Expected: PASS、typecheck 0 error。

- [ ] **Step 14.6：commit**

```bash
git add src/lib/useCurrency.ts tests/lib/currency.test.ts
git commit -m "feat(currency): SSR-safe initial state with FALLBACK_RATES (hydration consistent with prerender)"
```

---

### Task 15：`scripts/generate-video-poster.ts` ffmpeg 抽 frame 產出 poster jpg

**Files:**
- Create: `scripts/generate-video-poster.ts`
- Create: `public/video-posters/`（目錄）

- [ ] **Step 15.1：確認 ffmpeg 在 dev / CI 環境可用**

```bash
which ffmpeg || echo "ffmpeg not installed"
ffmpeg -version 2>&1 | head -1
```

Expected: ffmpeg 已安裝。若 CI 沒有、GitHub Actions Ubuntu runner 預裝 ffmpeg、無需額外 setup-ffmpeg action。

- [ ] **Step 15.2：寫 `scripts/generate-video-poster.ts`**

```ts
// scripts/generate-video-poster.ts
import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const VIDEOS = [
  { name: 'tea-product-promo',     source: 'src/assets/tea-product-promo.mp4' },
  { name: 'automotive-kv-promo',   source: 'src/assets/automotive-kv-promo.mp4' },
] as const

const OUT_DIR = 'public/video-posters'

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })
  for (const v of VIDEOS) {
    const out = path.join(OUT_DIR, `${v.name}.jpg`)
    try {
      await fs.access(v.source)
    } catch {
      console.warn(`⚠ source not found, skip: ${v.source}`)
      continue
    }
    // 抽第 1 秒 frame、resize 1280x720、jpg 質量 85
    execSync(
      `ffmpeg -y -ss 00:00:01 -i "${v.source}" -frames:v 1 -vf "scale=1280:720:force_original_aspect_ratio=cover,crop=1280:720" -q:v 3 "${out}"`,
      { stdio: 'inherit' },
    )
    console.log(`✓ ${out}`)
  }
}

main().catch((err) => {
  console.error('generate-video-poster failed:', err)
  process.exit(1)
})
```

- [ ] **Step 15.3：執行驗證**

```bash
pnpm tsx scripts/generate-video-poster.ts
ls -lh public/video-posters/
```

Expected:
- `public/video-posters/tea-product-promo.jpg` 約 100-300 KB
- `public/video-posters/automotive-kv-promo.jpg` 同範圍

- [ ] **Step 15.4：commit**

```bash
git add scripts/generate-video-poster.ts public/video-posters/
git commit -m "feat(seo): generate-video-poster.ts (ffmpeg extracts mp4 frame → VideoObject thumbnailUrl)"
```

---

### Task 16：`scripts/prerender.ts` + inject SEO meta 三條 HTML

> ⚠️ **見附錄 E（Task 16 拆三 + networkidle + selector + mp4 hash）**：本 task 拆成 **16a** inject-seo-meta.ts + unit test（`tests/scripts/inject-seo-meta.test.ts`）、**16b** prerender.ts（Playwright `page.route` block 外部 domain + `waitUntil:'domcontentloaded'` + waitForSelector，**不用 networkidle**）、**16c** asset/video URL resolution（`readdirSync('dist/assets')` 找 hash 後 mp4 檔名、找不到 throw）。node-html-parser prefix selector 需 unit test 驗證；block 外部 fetch 同時解 currency hydration 一致。

**Files:**
- Create: `scripts/prerender.ts`
- Create: `scripts/inject-seo-meta.ts`

- [ ] **Step 16.1：安裝 playwright + wait-on + node-html-parser**

```bash
pnpm add -D playwright@^1.49.0 wait-on@^8.0.0 node-html-parser@^7.0.0
pnpm exec playwright install chromium
```

- [ ] **Step 16.2：寫 `scripts/inject-seo-meta.ts`**

```ts
// scripts/inject-seo-meta.ts
import { parse, type HTMLElement } from 'node-html-parser'
import { SEO_META } from '../src/lib/seo/meta'
import { canonical, ogImage, siteRoot } from '../src/lib/seo/canonicalUrl'
import { buildProfessionalServiceJsonLd, buildVideoObjectJsonLd } from '../src/lib/seo/jsonld'
import type { Lang } from '../src/i18n/LanguageProvider'

const LANGS = ['zh-Hant', 'zh-Hans', 'en'] as const

function buildHreflangLinks(): string {
  const lines: string[] = []
  for (const lang of LANGS) {
    lines.push(`<link rel="alternate" hreflang="${lang}" href="${canonical(lang)}" />`)
  }
  lines.push(`<link rel="alternate" hreflang="x-default" href="${canonical('zh-Hant')}" />`)
  return lines.join('\n    ')
}

function buildVideoObjectsJsonLd(): string {
  // 兩支 demo 影片、注入 build manifest 後的 mp4 hash 檔名
  // 此處用簡化策略：從 build manifest 讀 mp4 檔名（Vite 5+ assets 通常含 hash）
  // 若 mp4 在 dist/assets/ 下、用 readdir + 模糊 match
  // 此 implementation simplified, 假設 mp4 檔名不含 hash（Vite assetsInlineLimit 控制）
  return [
    JSON.stringify(buildVideoObjectJsonLd({
      name: 'tea-product-promo',
      title: '產品宣傳短片 — AI 人臉 × 茶園實景',
      description: '品牌代言視覺：AI 人臉 × 茶園實景 × 產品手持',
      mp4FileName: 'tea-product-promo.mp4',
    }), null, 2),
    JSON.stringify(buildVideoObjectJsonLd({
      name: 'automotive-kv-promo',
      title: '品牌 KV 概念片 — AI 人物 × 汽車 KV',
      description: '電影分鏡敘事：AI 人物 × 汽車 KV × 多鏡頭剪輯',
      mp4FileName: 'automotive-kv-promo.mp4',
    }), null, 2),
  ]
    .map((s) => `<script type="application/ld+json">${s}</script>`)
    .join('\n    ')
}

export function injectSeoMeta(html: string, lang: Lang): string {
  const root = parse(html)
  const head = root.querySelector('head')!
  const htmlEl = root.querySelector('html')!

  // 1. <html lang>
  htmlEl.setAttribute('lang', lang)

  // 2. 清掉舊 meta（避免 Phase 1 寫死的 zh-Hant meta 殘留進 zh-Hans / en HTML）
  head.querySelectorAll('title').forEach((el) => el.remove())
  head.querySelectorAll('meta[name="description"]').forEach((el) => el.remove())
  head.querySelectorAll('meta[name="keywords"]').forEach((el) => el.remove())
  head.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove())
  head.querySelectorAll('meta[property^="og:"]').forEach((el) => el.remove())
  head.querySelectorAll('meta[name^="twitter:"]').forEach((el) => el.remove())
  head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove())
  head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
  head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove())

  // 3. 注入新 meta
  const meta = SEO_META[lang]
  const url = canonical(lang)
  const ogImg = ogImage(lang)

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
    <meta property="og:locale" content="${meta.ogLocale}" />
    ${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${SEO_META[l].ogLocale}" />`).join('\n    ')}
    <meta property="og:site_name" content="AI 人像工作室" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}" />
    <meta name="twitter:description" content="${escapeAttr(meta.ogDescription)}" />
    <meta name="twitter:image" content="${ogImg}" />

    ${buildHreflangLinks()}

    <script type="application/ld+json">${JSON.stringify(buildProfessionalServiceJsonLd(lang), null, 2)}</script>
    ${buildVideoObjectsJsonLd()}
  `
  head.insertAdjacentHTML('beforeend', newHead)

  return root.toString()
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
```

- [ ] **Step 16.3：寫 `scripts/prerender.ts`**

```ts
// scripts/prerender.ts
import { chromium } from 'playwright'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { injectSeoMeta } from './inject-seo-meta'
import type { Lang } from '../src/i18n/LanguageProvider'

const LANGS: readonly Lang[] = ['zh-Hant', 'zh-Hans', 'en']
const BASE_URL = 'http://localhost:4173/ai-portrait-studio-site'
const DIST = 'dist'
const PRERENDER_VIEWPORT = { width: 1280, height: 720 }

async function main() {
  const browser = await chromium.launch()
  try {
    for (const lang of LANGS) {
      const page = await browser.newPage({ viewport: PRERENDER_VIEWPORT })
      const url = `${BASE_URL}/${lang}/`
      console.log(`→ prerender ${url}`)
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForSelector('main', { timeout: 10000 })
      await page.waitForSelector('section#pricing', { timeout: 10000 })

      let html = await page.content()
      html = injectSeoMeta(html, lang)

      const outDir = path.join(DIST, lang)
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf-8')
      console.log(`✓ wrote ${outDir}/index.html`)

      await page.close()
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error('prerender failed:', err)
  process.exit(1)
})
```

- [ ] **Step 16.4：手動跑一次驗證**

```bash
pnpm build
pnpm preview --port 4173 &
sleep 3
pnpm exec wait-on http://localhost:4173/ai-portrait-studio-site/zh-Hant/ --timeout 30000
pnpm tsx scripts/prerender.ts
kill %1

# 驗證：
grep '<title>' dist/zh-Hant/index.html
grep '<title>' dist/zh-Hans/index.html
grep '<title>' dist/en/index.html
grep 'hreflang="zh-Hant"' dist/zh-Hant/index.html
grep 'application/ld+json' dist/zh-Hant/index.html
```

Expected:
- 三條 `<title>` 各為對應語言文字
- hreflang 在三條 HTML 都存在
- JSON-LD script 注入成功

- [ ] **Step 16.5：commit**

```bash
git add scripts/prerender.ts scripts/inject-seo-meta.ts pnpm-lock.yaml package.json
git commit -m "feat(seo): prerender.ts + inject-seo-meta.ts (Playwright produces 3 fully-meta HTML files)"
```

---

### Task 17：`scripts/generate-sitemap.ts` 動態生成

**Files:**
- Create: `scripts/generate-sitemap.ts`
- Modify: `package.json`（加 script）

- [ ] **Step 17.1：寫 `scripts/generate-sitemap.ts`**

```ts
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
    // git HEAD commit date in YYYY-MM-DD
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
  console.log(`✓ wrote ${DIST}/sitemap.xml (lastmod: ${lastmod})`)
}

main().catch((err) => {
  console.error('generate-sitemap failed:', err)
  process.exit(1)
})
```

- [ ] **Step 17.2：手動跑一次驗證**

```bash
pnpm tsx scripts/generate-sitemap.ts
cat dist/sitemap.xml | head -20
```

Expected: sitemap 含三條 URL、lastmod 是 git HEAD commit 日期、hreflang 集合完整。

- [ ] **Step 17.3：commit**

```bash
git add scripts/generate-sitemap.ts
git commit -m "feat(seo): generate-sitemap.ts (build-time sitemap with git commit date as lastmod)"
```

---

### Task 18：`scripts/verify-prerender.ts` 八項深度驗證

**Files:**
- Create: `scripts/verify-prerender.ts`

- [ ] **Step 18.1：寫 `scripts/verify-prerender.ts`**

```ts
// scripts/verify-prerender.ts
import { promises as fs } from 'node:fs'
import { parse } from 'node-html-parser'
import path from 'node:path'
import { canonical, ogImage, BASE_PATH } from '../src/lib/seo/canonicalUrl'
import type { Lang } from '../src/i18n/LanguageProvider'

const LANGS: readonly Lang[] = ['zh-Hant', 'zh-Hans', 'en']
const EXPECTED_HREFLANGS = ['zh-Hant', 'zh-Hans', 'en', 'x-default']
const DIST = 'dist'

function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(`❌ ${msg}`)
}

function setEquals<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false
  for (const v of a) if (!b.has(v)) return false
  return true
}

async function main() {
  const launchVerify = process.env.LAUNCH_VERIFY === 'true'
  console.log(`Mode: ${launchVerify ? 'Final Launch (strict)' : 'Infrastructure Deploy'}`)

  // 收集每語 hreflang href set（規則 7 用）
  const hreflangSets: Record<string, Set<string>> = {}
  const ogImages = new Set<string>()

  // 規則 1-5 + 6（root noindex）+ Rule 8（Final Launch og:image 各異）— 逐 lang 跑
  for (const lang of LANGS) {
    const filePath = path.join(DIST, lang, 'index.html')
    const html = await fs.readFile(filePath, 'utf-8')
    const root = parse(html)

    // 規則 1：HTML 基本完整性
    assert(html.includes('<title>'), `${lang}: missing <title>`)
    assert(!html.match(/<div\s+id="root"\s*>\s*<\/div>/),
           `${lang}: prerender did not populate root (still empty <div id="root">)`)
    assert(!html.includes('<script type="module" src="/src/main.tsx"'),
           `${lang}: dev URL leak — /src/main.tsx reference in prod HTML`)

    // 規則 2：<html lang>
    const htmlLang = root.querySelector('html')?.getAttribute('lang')
    assert(htmlLang === lang, `${lang}: <html lang>="${htmlLang}", expected "${lang}"`)

    // 規則 3：hreflang 集合完整
    for (const hl of EXPECTED_HREFLANGS) {
      assert(html.includes(`hreflang="${hl}"`),
             `${lang}: hreflang missing "${hl}" (need ${EXPECTED_HREFLANGS.join('/')})`)
    }

    // 規則 4：crawler-facing URL 為 absolute 含 base path
    const checks: Array<{ selector: string; attr: 'href' | 'content'; label: string }> = [
      { selector: 'link[rel="canonical"]', attr: 'href', label: 'canonical' },
      { selector: 'meta[property="og:url"]', attr: 'content', label: 'og:url' },
      { selector: 'meta[property="og:image"]', attr: 'content', label: 'og:image' },
      { selector: 'meta[name="twitter:image"]', attr: 'content', label: 'twitter:image' },
    ]
    for (const c of checks) {
      const el = root.querySelector(c.selector)
      const val = el?.getAttribute(c.attr)
      if (!val) continue
      assert(val.startsWith('https://'),
             `${lang}: ${c.label} = "${val}" is not absolute URL`)
      assert(val.includes(BASE_PATH),
             `${lang}: ${c.label} = "${val}" missing base path "${BASE_PATH}"`)
    }

    // 規則 5：JSON-LD parse-able + 必填欄位齊全
    const scripts = root.querySelectorAll('script[type="application/ld+json"]')
    assert(scripts.length >= 2,
           `${lang}: expected >= 2 JSON-LD blocks (Service + Video×2), got ${scripts.length}`)
    let foundService = false
    let foundVideo = false
    for (const script of scripts) {
      let json: any
      try {
        json = JSON.parse(script.text)
      } catch (e: any) {
        throw new Error(`${lang}: JSON-LD parse error: ${e.message}`)
      }
      if (json['@type'] === 'ProfessionalService') {
        foundService = true
        for (const k of ['name', 'url', 'contactPoint', 'hasOfferCatalog']) {
          assert(json[k], `${lang}: ProfessionalService missing "${k}"`)
        }
      }
      if (json['@type'] === 'VideoObject') {
        foundVideo = true
        for (const k of ['name', 'thumbnailUrl', 'uploadDate', 'description']) {
          assert(json[k], `${lang}: VideoObject missing required "${k}"`)
        }
        assert(json.thumbnailUrl.startsWith('https://'),
               `${lang}: VideoObject thumbnailUrl must be absolute`)
      }
    }
    assert(foundService, `${lang}: no ProfessionalService JSON-LD found`)
    assert(foundVideo,   `${lang}: no VideoObject JSON-LD found`)

    // 規則 7 蒐集
    const hreflangLinks = root.querySelectorAll('link[rel="alternate"][hreflang]')
    hreflangSets[lang] = new Set(hreflangLinks.map((l) => l.getAttribute('href')!))

    // 規則 8 蒐集（og:image 三語各異）
    const ogImg = root.querySelector('meta[property="og:image"]')?.getAttribute('content')
    if (ogImg) ogImages.add(ogImg)

    console.log(`✓ ${lang}: 規則 1-5 通過`)
  }

  // 規則 6：root index.html noindex
  const rootHtml = await fs.readFile(path.join(DIST, 'index.html'), 'utf-8')
  assert(/<meta\s+name="robots"\s+content="[^"]*noindex/.test(rootHtml),
         'root index.html missing <meta name="robots" content="noindex">')
  console.log('✓ root: noindex 規則 6 通過')

  // 規則 7：三語 hreflang href set 完全一致
  const refSet = hreflangSets[LANGS[0]]
  for (const lang of LANGS.slice(1)) {
    assert(setEquals(hreflangSets[lang], refSet),
           `${lang}: hreflang href set differs from ${LANGS[0]} reference`)
  }
  console.log('✓ 規則 7 通過：三語 hreflang 集合一致')

  // 規則 8：Final Launch 階段、三語 og:image 必須各異
  if (launchVerify) {
    assert(ogImages.size === LANGS.length,
           `Final Launch: og:image must be unique per language, got ${ogImages.size} unique`)
    console.log('✓ 規則 8 通過（Final Launch）：三語 og:image 各異')
  } else {
    console.log(`◷ 規則 8 跳過（Infrastructure Deploy 模式、允許 placeholder）`)
  }

  console.log('✅ verify-prerender all rules passed')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
```

- [ ] **Step 18.2：手動驗證跑通**

```bash
pnpm tsx scripts/verify-prerender.ts
```

Expected: 全部規則 ✓ + 最後 `✅ verify-prerender all rules passed`。

- [ ] **Step 18.3：刻意破壞測試 fail-fast**

```bash
# 暫時把 dist/zh-Hant/index.html 的 <title> 拿掉、驗證腳本應 fail
cp dist/zh-Hant/index.html /tmp/zh-Hant-backup.html
sed -i 's/<title>[^<]*<\/title>//' dist/zh-Hant/index.html
pnpm tsx scripts/verify-prerender.ts && echo "BUG: should have failed" || echo "✓ correctly failed"
# 還原
cp /tmp/zh-Hant-backup.html dist/zh-Hant/index.html
```

Expected: stdout `✓ correctly failed` + 上面 verify 跑出 `❌ zh-Hant: missing <title>` 之類訊息。

- [ ] **Step 18.4：commit**

```bash
git add scripts/verify-prerender.ts
git commit -m "feat(seo): verify-prerender.ts (8-rule deep validation, LAUNCH_VERIFY for stricter Final Launch mode)"
```

---

## Phase 5 — CI/CD + 上線驗證（Task 19-21，1 天）

完成後效益：CI/CD 自動跑 prerender + verify、Search Console / Bing Webmaster Tools sitemap 已提交。

### Task 19：`package.json` 整合 scripts + dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 19.1：把所有新 script + deps 整合進 `package.json`**

```json
{
  "name": "ai-portrait-studio-site",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build && tsx scripts/copy-html-entries.ts",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "generate-video-poster": "tsx scripts/generate-video-poster.ts",
    "prerender": "tsx scripts/prerender.ts",
    "generate-sitemap": "tsx scripts/generate-sitemap.ts",
    "verify-prerender": "tsx scripts/verify-prerender.ts",
    "verify-launch": "LAUNCH_VERIFY=true tsx scripts/verify-prerender.ts"
  },
  "dependencies": {
    "@fontsource/inter": "^5.1.0",
    "@fontsource/noto-sans-tc": "^5.1.0",
    "lucide-react": "^0.460.0",
    "qrcode.react": "^4.2.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@tailwindcss/container-queries": "^0.1.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "jsdom": "^29.0.2",
    "node-html-parser": "^7.0.0",
    "playwright": "^1.49.0",
    "postcss": "^8.5.10",
    "tailwindcss": "^3.4.19",
    "tsx": "^4.19.0",
    "typescript": "~5.6.3",
    "typescript-eslint": "^8.58.0",
    "vite": "^8.0.4",
    "vitest": "^4.1.4",
    "wait-on": "^8.0.0"
  }
}
```

- [ ] **Step 19.2：重新 install lockfile**

```bash
pnpm install
```

- [ ] **Step 19.3：sanity check 所有 script 都能跑**

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Expected: 4 個全綠。

- [ ] **Step 19.4：commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): integrate SEO scripts and dependencies (prerender / sitemap / verify)"
```

---

### Task 20：`.github/workflows/deploy.yml` 改造

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 20.1：完整重寫 deploy.yml**

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
      - uses: actions/configure-pages@v5
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

      - name: Cache Playwright browsers
        id: playwright-cache
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Install Playwright Chromium
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: pnpm exec playwright install chromium --with-deps

      - run: pnpm build

      - name: Start preview server
        run: |
          pnpm preview --port 4173 &
          echo "PREVIEW_PID=$!" >> $GITHUB_ENV
      - name: Wait for preview server
        run: pnpm exec wait-on http://localhost:4173/ai-portrait-studio-site/ --timeout 30000

      - run: pnpm generate-video-poster
      - run: pnpm prerender
      - run: pnpm generate-sitemap
      - run: pnpm verify-prerender

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

- [ ] **Step 20.2：local 模擬 CI 跑全流程**

```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test
pnpm exec playwright install chromium
pnpm build
pnpm preview --port 4173 &
PREVIEW_PID=$!
sleep 5
pnpm exec wait-on http://localhost:4173/ai-portrait-studio-site/
pnpm generate-video-poster
pnpm prerender
pnpm generate-sitemap
pnpm verify-prerender
kill $PREVIEW_PID 2>/dev/null
```

Expected: 全程無 error、最後 verify-prerender `✅ all rules passed`。

- [ ] **Step 20.3：commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci(pages): integrate prerender + sitemap + verify into deploy pipeline (with Playwright cache + preview cleanup)"
```

---

### Task 21：Push 到 main + 上線驗證 + Search Console / Bing Webmaster 提交

**Files:** 無（純驗證 / 外部操作）

- [ ] **Step 21.1：push 觸發 GH Actions**

```bash
git push origin main
```

監看 GitHub Actions：開 `https://github.com/<user>/ai-portrait-studio-site/actions`、等 build + deploy job 都綠。

- [ ] **Step 21.2：上線後抽查三條 URL 拿到完整 HTML**

```bash
# 三條 URL 都該回 200 + 含完整 prerender 內容
curl -sL https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/ | grep -E "Mini Launch|<title>" | head -3
curl -sL https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hans/ | grep -E "Mini Launch|<title>" | head -3
curl -sL https://leadingtw273.github.io/ai-portrait-studio-site/en/ | grep -E "Mini Launch|<title>" | head -3
```

Expected: 三條都看到該語言 title + Mini Launch 文字。

- [ ] **Step 21.3：Schema.org Validator 驗證 JSON-LD**

開瀏覽器：
- https://validator.schema.org/
- 貼入 `https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/`
- 確認 ProfessionalService + 2 個 VideoObject 都 0 error

對三條語言都跑一次。

- [ ] **Step 21.4：IM 分享預覽抽查**

實際操作：
- TG 群組貼三條語言 URL、確認 preview 顯示對應語言 title + description + og:image
- LINE 私訊貼三條語言 URL、同上
- FB sharer debug：https://developers.facebook.com/tools/debug/ 對三條 URL 各跑一次

placeholder 階段：三條 og:image 都長一樣（zh-Hant placeholder），title / description 應該各語言不同。

- [ ] **Step 21.5：PageSpeed Insights LCP**

開 https://pagespeed.web.dev/、跑 mobile + desktop：
- https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/
- LCP 目標 < 2.5s

- [ ] **Step 21.6：Search Console 提交 sitemap（leadi 手動）**

1. 開 https://search.google.com/search-console/
2. 加 URL prefix property：`https://leadingtw273.github.io/ai-portrait-studio-site/`
3. 用 HTML meta tag / DNS / file 任一方式驗證 ownership
4. 左側 Sitemaps → 新增 sitemap：輸入 `sitemap.xml`、submit
5. 上線後 1-2 週回來看「Coverage / Indexing」是否三條 URL 都被 index

- [ ] **Step 21.7：Bing Webmaster Tools 提交 sitemap（leadi 手動）**

1. 開 https://www.bing.com/webmasters/
2. 加站台：`https://leadingtw273.github.io/ai-portrait-studio-site/`
3. 驗證 ownership（可從 Search Console 一鍵 import）
4. Sitemaps → 提交 `https://leadingtw273.github.io/ai-portrait-studio-site/sitemap.xml`

- [ ] **Step 21.8：完成 Infrastructure Deploy 驗收（§1.3.1 8 項全綠）**

對照 spec `docs/superpowers/specs/2026-05-26-seo-improvement-design.md` §1.3.1 驗收清單：
- ☐ 1. 三語 URL 含完整 hero / pricing / footer 文字
- ☐ 2. 三語 `<html lang>` 正確
- ☐ 3. hreflang 在 HTML + sitemap 互相交叉指向
- ☐ 4. 所有 crawler-facing URL absolute
- ☐ 5. Schema.org Validator 無語法錯誤
- ☐ 6. VideoObject 通過 Google 必填；ProfessionalService 不保證 rich result（語意輔助）
- ☐ 7. LCP < 2.5s (mobile)
- ☐ 8. Search Console / Bing Webmaster sitemap 提交完成

全綠後本 plan 視為完成。Final Launch 等 leadi 換完三語素材 + 真實 SEO 文字後跑 `pnpm verify-launch` 即可（§1.3.2）。

- [ ] **Step 21.9：commit 完成標記（可選）**

```bash
# 在 docs/superpowers/plans/ 加完成標記
echo "" >> docs/superpowers/plans/2026-05-26-seo-improvement-plan.md
echo "## 完成記錄" >> docs/superpowers/plans/2026-05-26-seo-improvement-plan.md
echo "" >> docs/superpowers/plans/2026-05-26-seo-improvement-plan.md
echo "- $(date +%Y-%m-%d)：Infrastructure Deploy 驗收 8 項全綠、Step 21 完成" >> docs/superpowers/plans/2026-05-26-seo-improvement-plan.md
git add docs/superpowers/plans/2026-05-26-seo-improvement-plan.md
git commit -m "docs(plan): mark SEO improvement plan as completed (Infrastructure Deploy verified)"
git push origin main
```

---

### Task 22：GoatCounter analytics 整合（Phase 5 收尾）

**Files:**
- Modify: `scripts/inject-seo-meta.ts`（newHead 加 GoatCounter script tag）
- Modify: `scripts/verify-prerender.ts`（規則 9：驗證三條 HTML 都有 GoatCounter script）
- 外部動作：leadi 在 [goatcounter.com](https://www.goatcounter.com/) 註冊 site 拿 subdomain

**設計選擇**（採納 leadi 2026-05-28 裁決）：

- 工具：GoatCounter（完全免費、無 cookie、~1.5KB async JS、自動過濾 bot、自帶 referrer/國家/瀏覽器 dashboard）
- 從 spec §11 Out of scope 移除「不接 analytics」、加入 spec §13 鎖定前提
- 並入 SEO plan v2 Step 5（不另開 plan）
- 三語 URL 用同一個 GoatCounter site code、依 URL path 自動分流（`/zh-Hant/` `/zh-Hans/` `/en/` 各成獨立路線）
- root redirect 頁**不**注入（瞬間 navigate 走、不算 PV、避免 inflate 數據）
- script tag async 載入、不影響 LCP / 不影響 prerender HTML 與 client 第一幀一致性

- [ ] **Step 22.1：leadi 在 goatcounter.com 註冊 site**

外部動作（subagent 跳過此步、若 subdomain 已知則繼續）：

1. 開 https://www.goatcounter.com/signup
2. 註冊 free account（email + password）
3. 建立 site：subdomain 命名建議 `ai-portrait-studio`（最終 URL: `https://ai-portrait-studio.goatcounter.com`）
4. 在 Settings → Sites 確認 site code，記下 tracking URL：`https://ai-portrait-studio.goatcounter.com/count`
5. 提供給 plan 執行者：tracking URL（執行 Step 22.2 時填進去）

- [ ] **Step 22.2：寫 failing test（inject-seo-meta.ts 新增 GoatCounter script 注入）**

```ts
// tests/scripts/inject-seo-meta.test.ts（在現有 inject-seo-meta unit test 加新 describe）
import { describe, it, expect } from 'vitest'
import { injectSeoMeta } from '../../scripts/inject-seo-meta'

describe('inject-seo-meta — GoatCounter script (Task 22)', () => {
  const sampleHtml = '<!doctype html><html lang="zh-Hant"><head></head><body><div id="root">x</div></body></html>'

  it('injects GoatCounter script tag in zh-Hant HTML', () => {
    const out = injectSeoMeta(sampleHtml, 'zh-Hant')
    expect(out).toMatch(/data-goatcounter="https:\/\/ai-portrait-studio\.goatcounter\.com\/count"/)
    expect(out).toMatch(/src="\/\/gc\.zgo\.at\/count\.js"/)
    expect(out).toContain('async')
  })

  it('same GoatCounter script in zh-Hans HTML (single site code, lang分流靠 URL path)', () => {
    const out = injectSeoMeta(sampleHtml, 'zh-Hans')
    expect(out).toMatch(/data-goatcounter="https:\/\/ai-portrait-studio\.goatcounter\.com\/count"/)
  })

  it('GoatCounter script in en HTML', () => {
    const out = injectSeoMeta(sampleHtml, 'en')
    expect(out).toMatch(/data-goatcounter="https:\/\/ai-portrait-studio\.goatcounter\.com\/count"/)
  })
})
```

- [ ] **Step 22.3：跑 test 確認 fail**

```bash
pnpm test tests/scripts/inject-seo-meta.test.ts -t "GoatCounter"
```

Expected: FAIL（inject-seo-meta.ts 還沒注入 GoatCounter script）

- [ ] **Step 22.4：改 `scripts/inject-seo-meta.ts` newHead 末段加 GoatCounter script tag**

```ts
// scripts/inject-seo-meta.ts — newHead 字串末段（在 JSON-LD VideoObject 之後）加：
const GOATCOUNTER_TRACKING_URL = 'https://ai-portrait-studio.goatcounter.com/count'
// ↑ 替換成 Step 22.1 拿到的實際 URL；建議改用 env 注入：process.env.GOATCOUNTER_URL ?? '...'

const newHead = `
  ${/* ... 既有 SEO meta + JSON-LD ... */}
  <script data-goatcounter="${GOATCOUNTER_TRACKING_URL}" async src="//gc.zgo.at/count.js"></script>
`
```

**注意**：
- 三條語言 HTML 用**同一個** tracking URL（GoatCounter 自動依 referer/URL path 分流）
- script tag 加 `async` 確保不阻塞 render（不影響 LCP）
- root redirect 頁的 `scripts/__fixtures__/root-redirect-template.html` **不**注入（避免 redirect 瞬間 inflate 數據）

- [ ] **Step 22.5：跑 test 確認 pass**

```bash
pnpm test tests/scripts/inject-seo-meta.test.ts
```

Expected: PASS（含原有 case + 新增 GoatCounter case）

- [ ] **Step 22.6：擴充 `scripts/verify-prerender.ts` 規則 9**

在 verify-prerender.ts 的「逐 lang 跑」loop 內加：

```ts
// 規則 9：GoatCounter analytics script 注入
const gcScript = root.querySelector('script[data-goatcounter]')
assert(gcScript, `${lang}: missing GoatCounter script tag`)
const gcUrl = gcScript.getAttribute('data-goatcounter')
assert(gcUrl?.startsWith('https://') && gcUrl.endsWith('/count'),
       `${lang}: GoatCounter URL "${gcUrl}" malformed`)
const gcSrc = gcScript.getAttribute('src')
assert(gcSrc === '//gc.zgo.at/count.js',
       `${lang}: GoatCounter script src is "${gcSrc}", expected "//gc.zgo.at/count.js"`)
assert(gcScript.getAttribute('async') !== null,
       `${lang}: GoatCounter script must be async (avoid LCP regression)`)
console.log(`✓ ${lang}: 規則 9 GoatCounter script 注入`)
```

- [ ] **Step 22.7：完整 local 驗證**

```bash
pnpm build
pnpm preview --port 4173 &
PREVIEW_PID=$!
sleep 3
pnpm tsx scripts/prerender.ts
pnpm tsx scripts/verify-prerender.ts
grep -c "data-goatcounter" dist/zh-Hant/index.html dist/zh-Hans/index.html dist/en/index.html
grep -c "data-goatcounter" dist/index.html || echo "✓ root redirect 頁正確不含 GoatCounter"
kill $PREVIEW_PID 2>/dev/null
```

Expected:
- verify-prerender 全 ✓（含規則 9）
- 三條語言 HTML 各印 `1`（含 1 個 GoatCounter script）
- root index.html 印 `0` 或上面 echo 訊息（**不**含 GoatCounter）

- [ ] **Step 22.8：上線後驗證 GoatCounter 收到 PV（leadi 動作）**

push 後等 GH Actions 跑完、開 https://leadingtw273.github.io/ai-portrait-studio-site/zh-Hant/ 一次。然後：

1. 開 https://ai-portrait-studio.goatcounter.com/
2. 等 1-2 分鐘（GoatCounter ingestion 有延遲）
3. 確認 dashboard 看到 1 條 PV、path 為 `/ai-portrait-studio-site/zh-Hant/`
4. 對 zh-Hans / en 兩條 URL 各開一次、確認各路徑都收到

- [ ] **Step 22.9：commit**

```bash
git add scripts/inject-seo-meta.ts scripts/verify-prerender.ts tests/scripts/inject-seo-meta.test.ts
git commit -m "feat(analytics): GoatCounter integration (no-cookie, async, ~1.5KB, single site code 3-lang分流)

- inject-seo-meta.ts: GoatCounter script tag 注入三條 prerender HTML（root redirect 頁不注入）
- verify-prerender.ts: 規則 9 驗證 data-goatcounter URL + src + async
- Spec §11 移除「不接 analytics」、§13 鎖定前提加 GoatCounter

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
"
```

**驗收（補進 §1.3.1）**：
- ☐ verify-prerender 規則 9 ✓
- ☐ GoatCounter dashboard 收到三語各自 PV（上線後 1-2 min）

---

## 附錄 A：Task 依賴順序

```
Task 1 (canonicalUrl helper)  ← 所有後續 task 共用
  │
  ├─ Task 2 (index.html meta)
  ├─ Task 3 (sitemap + robots)
  └─ Task 4 (og placeholder)        ─┐
                                      │
Task 5 (LanguageProvider URL)        │
  │                                   │
  ├─ Task 6 (Nav 跳 URL)              │
  ├─ Task 7 (Vite 三語 entry HTML)    │
  └─ Task 8 (root redirect)           │
                                      ├── Phase 4 起所有 task 依賴 Phase 1-3 完成
Task 9 (currencyNote i18n)           │
  ├─ Task 10 (seo/meta + jsonld)     │
  └─ Task 11 (og 三語 placeholder)   │
                                      │
Task 12 (hydrateRoot)                 │
Task 13 (AddOnsCarousel CSS-only)     │
Task 14 (useCurrency SSR-safe)        │
Task 15 (generate-video-poster)       │
Task 16 (prerender + inject-meta)    ←┘
Task 17 (generate-sitemap)
Task 18 (verify-prerender)

Task 19 (package.json)  ← 把所有 script 整合
Task 20 (deploy.yml)
Task 21 (上線 + Search Console)
Task 22 (GoatCounter analytics — 並入 Step 5、依賴 Task 16a inject-seo-meta + Task 18 verify)
```

**禁止平行**：本 plan 為線性 task、每個 task 都依賴前面所有的 commit；不要 parallel execute。

## 附錄 B：Rollback 策略（codex review 採納、改 phase-level）

**關鍵原則**：Phase 4 起 build pipeline 已依賴 `copy-html-entries` / `prerender` / `verify-prerender` 等 script + `package.json` scripts + `deploy.yml` 改造。**不可單 task revert**（會留下 CI / package scripts 指向不存在或不相容的 script）。Rollback 以 **phase-level commit set** 為單位。

| 失敗位置 | Rollback 範圍（一起 revert 的 task set） | Production 狀態 |
|---|---|---|
| **Phase 1（Task 1-4）** | 可單 task revert（彼此獨立、backward compatible） | 不受影響 |
| **Phase 2（Task 5-8）** | 整個 Phase 2 一起 revert（Task 7 copy-html-entries 改了 build script、Task 8 依賴 Task 7）；保留 Phase 1 | SEO meta（Phase 1）仍在 |
| **Phase 3（Task 9-11）** | 可單 task revert（純加 i18n / og / jsonld 檔、不動 build pipeline） | Phase 1-2 成果仍在 |
| **Phase 4（Task 12-18）** | **整個 Phase 4 + Task 19/20 一起 revert**（prerender / verify script 與 package.json scripts + deploy.yml 綁定、不可單 task）；revert 後 build script 要同步退回 Task 7 版本（只 copy-html-entries、無 prerender） | Phase 1-3 成果仍在（三語有 meta、但無 prerender） |
| **Phase 5（Task 19-21）** | deploy.yml + package.json 一起退回前一版；Pages 仍 serving 上一次成功 build | 上次成功 build 仍 live |
| **災難級** | `git revert` 全部 SEO commit（Task 1 起）；production 回到 SEO 改造前 | site 仍 functional、只是 SEO 不佳 |

**操作提示**：revert phase set 時用 `git revert --no-commit <oldest>..<newest>` 把整段 revert 成單一 commit、再手動確認 `package.json` build script + `deploy.yml` 與 revert 後的 scripts/ 狀態一致（最容易遺漏的是 build script 仍 call 已 revert 的 `prerender`）。

## 附錄 D：Performance 順手改善（spec §8、可選優化）

spec §8 三項 Performance 改善、Task 12 已完成 (a) 砍 Inter 400；剩餘 (b) hero-bg preload + (c) video preload="metadata" 列為可選優化。執行時機：Phase 4 結束後（Task 18 完成）、Phase 5 開始前、或 Final Launch 階段補做。

### Optional Task B：Image compression（上線後實測發現、P2 backlog）

**2026-05-28 上線後 Playwright lab 量測**：

- Desktop LCP 536ms / Mobile LCP 948ms — Core Web Vitals 全綠
- 但 **Mobile initial transfer 17.6 MB**（排除 mp4）— 不影響 LCP / CLS、但浪費流量
- 主要肥肉：
  - `src/assets/hero-bg.jpg` **2.7 MB**（fixed background、3840×2160 級別）
  - `src/assets/lora-before.jpg` / `lora-after.png` 各約 1-2 MB
  - @fontsource subset（已較難壓）

**目標**：mobile initial transfer 從 17.6 MB → < 5 MB（不犧牲視覺品質）。

**做法（按優先序）**：
1. `hero-bg.jpg` 用 sharp 壓 jpg quality 75 + resize 1920×1080（或 2560×1440）→ 預期 < 500 KB
2. `lora-before.jpg` / `lora-after.png` 同樣處理（或改 WebP）
3. 考慮加 `<picture>` + WebP/AVIF 多版本（modern browser 享受小檔、舊瀏覽器 fallback jpg）
4. 影片 poster 順帶確認 < 200 KB（目前 27 KB / 83 KB OK）

**做不做的判斷**：
- SEO 觀點：**Web Vitals 全綠就不必修**（Google ranking 不會因 transfer size 扣分）
- UX 觀點：**值得做**（mobile 流量 18 MB 用戶實感體驗差、特別是中國用戶 4G / 收訊不好）
- 商業觀點：**接案門面 + 客戶可能在手機看連結 → 值得做**

預估工程量：0.5 天（sharp + npm script + 一次壓縮 + commit）。

---

### Optional Task A：Hero background preload + video preload="metadata"

**Files:**
- Modify: `scripts/inject-seo-meta.ts`（注入 hero-bg preload link）
- Modify: `src/sections/Demo.tsx`（兩支 video 標籤加 preload="metadata"）

- [ ] **Step A.1：找 Vite build 後 hero-bg 的 hash 檔名**

```bash
ls dist/assets/hero-bg-*.jpg
# 預期：dist/assets/hero-bg-abc123.jpg
```

- [ ] **Step A.2：改 inject-seo-meta.ts 在 head 末段加 preload**

```ts
// inject-seo-meta.ts inject function 末段加：
// 從 dist/assets 找 hero-bg 檔名（每次 build 不同 hash）
import { readdirSync } from 'node:fs'

function findHeroBgFileName(): string | null {
  try {
    const files = readdirSync(path.join('dist', 'assets'))
    return files.find((f) => /^hero-bg-.*\.(jpg|jpeg|png|webp)$/.test(f)) ?? null
  } catch {
    return null
  }
}

// 在 newHead 字串內加：
const heroBg = findHeroBgFileName()
const preloadLine = heroBg
  ? `<link rel="preload" as="image" fetchpriority="high" href="${asset(`assets/${heroBg}`)}" />`
  : ''
// preloadLine 串進 newHead
```

- [ ] **Step A.3：改 Demo.tsx 兩支 `<video>` 加 preload="metadata"**

```tsx
// 找到既有 video 元素、確認屬性：
<video preload="metadata" poster={...} ...>
```

若已是 `preload="metadata"`、跳過。若是 `preload="auto"` 或缺 attribute、改成 `preload="metadata"`。

- [ ] **Step A.4：build 驗證 preload link 出現在三條 HTML**

```bash
pnpm build && pnpm preview --port 4173 &
sleep 3
pnpm tsx scripts/prerender.ts
grep 'preload.*hero-bg' dist/zh-Hant/index.html
kill %1
```

Expected: 三條 HTML head 都有 `<link rel="preload" ... hero-bg ...>` 行。

- [ ] **Step A.5：PageSpeed Insights 重新測 LCP**

對比 Task 21 Step 21.5 的 LCP 數字、預期改善 0.3-0.8s。

- [ ] **Step A.6：commit**

```bash
git add scripts/inject-seo-meta.ts src/sections/Demo.tsx
git commit -m "perf(seo): preload hero-bg + video preload=metadata (spec §8 optional)"
```

---

## 附錄 C：給 subagent 執行的注意事項

1. **每個 task 都是 fresh subagent**（per superpowers:subagent-driven-development）— 看不到主對話歷史、所有 context 都在 plan 內
2. **每個 commit 必含 Co-Authored-By trailer**（與既有 commit 風格一致）：
   ```
   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   ```
3. **Task 完成判定**：所有 step checkbox ✓ + commit 完成 + `pnpm test && pnpm typecheck && pnpm lint` 全綠
4. **與 spec 對照**：本 plan 對應 spec `docs/superpowers/specs/2026-05-26-seo-improvement-design.md`、若 plan 內細節與 spec 衝突、回報主對話、不自行決定
5. **失敗回報**：若 codex exec 兩次失敗、回報主對話、不嘗試 hack workaround
6. **★ 執行前必讀附錄 E**：plan v1 的部分 test code 憑 spec 假設撰寫、與現有 component 真實 API 不符（codex plan review 抓到）。附錄 E 列出每個受影響 task 的修正指引 + 真實 API。**執行任何 task 前先看附錄 E 對應條目**、每個 task 的 Step 1 一律先 `cat` 現有 component 確認真實 API 再寫 test。

---

## 附錄 E：Codex plan review 採納紀錄 + 修正指引（2026-05-26）

Codex（gpt-5.5）對 plan v1 review、共約 30 條意見（19 P1 + 11 P2），使用者依前次 spec review「全採納」裁決、本批同屬事實性技術補強、全部採納。codex **去讀了現有 component 真實 API**、抓到 plan v1 test code 的假設與現實不符。

### E.0 現有 component 真實 API（plan v1 寫錯的根源、執行時以此為準）

```ts
// src/components/PlanCard.tsx — props（無 tier！上層算好 price 傳入、不用 useCurrency）
type PlanCardProps = {
  name: string; icon?: ReactNode; tagline?: string
  price: number; priceLabel?: string; priceFractionDigits?: number
  deliverables: ReadonlyArray<string>
  ctaLabel: string; ctaHref: string
  highlighted?: boolean
  badge?: { label: string; variant?: 'brand' | 'gold' }
  className?: string
}

// src/lib/useCurrency.ts — return（是 format 不是 formatPrice！rate 初始 null）
function useCurrency(): {
  currency: 'TWD' | 'CNY' | 'USD'
  symbol: string
  rate: number | null          // 非 TWD 時初始 null、fetch 後才有值
  format: (twd: number) => string  // rate===null 時 fallback 回 "NT$ 原價"
}

// src/components/AddOnCard.tsx — 最外層是 <div className="addon-card-cq h-full">、無 article role

// src/components/AddOnsCarousel.tsx — 用 translateX(%) + visibleCount JS state（getVisibleCount(window.innerWidth)）
//   + autoplay setInterval + dots indicator + handleNav(±1)；const { format } = useCurrency()
```

### E.1 P1 important（19 條、執行前必處理）

| codex 意見 | 修正指引 | 影響 task |
|---|---|---|
| **Task 3**：Phase 1 sitemap 列三語 URL 但 Task 7 前 404、與「phase 獨立 deploy」衝突 | Task 3 Step 3.1 的 `public/sitemap.xml` **只放 root URL**（Phase 1 唯一存在的）；三語 sitemap 由 Task 17 build-time 生成覆寫 `dist/sitemap.xml` | Task 3 / 17 |
| **Task 6**：`vi.spyOn(window.location,'href','set')` jsdom 不可用（Location.href 不可配置、spy throw） | 把 navigation 抽成純函式 `export function navigateToLang(targetLang, hash)` 放 `src/lib/seo/langNav.ts`、test 純函式回傳的 URL 字串（不碰 location）；Nav.tsx onClick 呼叫該 helper | Task 6 |
| **Task 8**：`curl -L` 不執行 JS redirect / meta refresh、expected「Mini Launch」不成立 | 改驗：(a) `grep noindex dist/index.html`、(b) `grep 'http-equiv="refresh"' dist/index.html`、(c) `grep 'location.replace' dist/index.html`、(d) 直接 `curl dist 三條語言 URL`（不靠 redirect） | Task 8 |
| **Task 9**：`<PlanCard tier="pro" />` 與真實 API 不符（PlanCard 無 tier、不用 useCurrency） | currencyNote 加在 **Pricing section（`src/sections/Pricing.tsx`）**、不是 PlanCard；test 改測 Pricing section 渲染 currencyNote；PlanCard API 完全不動。pricePrefix「約」也在 Pricing 算好後傳給 PlanCard 的 `priceLabel` 或在 Pricing 自己 render 註解 | Task 9 |
| **Task 10 / 16**：`mp4FileName` hardcode `tea-product-promo.mp4`、Vite asset import 會 hash → contentUrl 404 | `inject-seo-meta.ts` build 後 `readdirSync('dist/assets')` 用 regex 找 hash 後的 mp4 檔名（`/tea-product-promo-.*\.mp4$/`）；找不到則 throw（fail build） | Task 10 / 16 |
| **Task 12**：`vi.importMock('react-dom/client')` 不保證攔到 `await import('@/main')` | main.tsx export `mountApp(container: HTMLElement)` 純函式（內部判 hasChildNodes → hydrateRoot / createRoot）；main.tsx 底部 call `mountApp(document.getElementById('root')!)`；test 直接 test `mountApp` 傳 mock container | Task 12 |
| **Task 13**：test `getAllByRole('article')` 但 AddOnCard 無 article role | AddOnCard 最外層 `<div>` 加 `role="article"`（或 test 改用 `screen.getByTestId`）；**保留**現有 translateX + autoplay + dots UX；移除的只是 `getVisibleCount(window.innerWidth)` → 改 CSS（卡寬用 Tailwind responsive class、track 用 transform 仍可、但 visibleCount 改由 CSS 決定可視數）；若 refactor 風險高、最小改法 = 保留 JS visibleCount 但設 SSR-safe 初始值（見 E.3 註） | Task 13 |
| **Task 14**：新 hook return `{rate, formatPrice}` 與現有 `{currency,symbol,rate,format}` 不符、會 break AddOnsCarousel/Pricing | **保留現有 API 簽章**（currency/symbol/rate/format）；**移除 plan v1 的 FALLBACK_RATES 方案**（現有設計已有 rate===null → TWD 原價 fallback）；hydration 一致性改靠「Task 16 prerender 時 route block 外部匯率 fetch」、讓 rate 停 null → prerender HTML 顯示 TWD 原價、與 client 第一幀（rate 也 null）一致 | Task 14 / 16 |
| **Task 15**：ffmpeg 不存在時 execSync 直接失敗、無 fallback | `generate-video-poster.ts` 開頭 `try { execSync('ffmpeg -version') } catch { 若 public/video-posters/*.jpg 已 commit 存在則 skip、否則 throw 明確錯誤 }`；poster 一旦生成就 **commit 進 repo**、CI 不硬依賴每次重生 | Task 15 / 20 |
| **Task 16 networkidle**：頁面發 open.er-api.com fetch + Unsplash 圖 + 影片、任一慢吃滿 30s timeout | prerender 用 Playwright `page.route('**/*', ...)` **block 外部 domain**（open.er-api.com / images.unsplash.com 等非 localhost）、改 `waitUntil: 'domcontentloaded'` + `waitForSelector('section#pricing')`；block 外部 fetch 同時達成 currency hydration 一致（rate 停 null） | Task 16 |
| **Task 16 selector**：node-html-parser prefix selector（`meta[property^="og:"]`）要實測、無 unit test | inject-seo-meta.ts 加獨立 unit test（`tests/scripts/inject-seo-meta.test.ts`）、餵一段 sample HTML 驗證舊 meta 清乾淨 + 新 meta 注入；若 prefix selector 不支援、改 `querySelectorAll('meta').filter(el => el.getAttribute('property')?.startsWith('og:'))` | Task 16 |
| **Task 16 拆分**：單 task 太大（Playwright + meta inject + JSON-LD + asset URL + CI coupling） | 拆三：**16a** `inject-seo-meta.ts` + unit test、**16b** `prerender.ts` Playwright artifact（route block 外部）、**16c** asset/video URL resolution（readdir dist/assets 找 hash 檔名）。三者 failure mode 不同、分開 debug | Task 16 |
| **Task 18 規則 4**：只檢查 canonical/og:url/og:image/twitter:image、漏 hreflang href + JSON-LD url/image/contentUrl/thumbnailUrl | verify-prerender 規則 4 擴充：(a) 所有 `link[rel=alternate][hreflang]` 的 href 為 absolute 含 base path；(b) parse JSON-LD 後遞迴檢查 url/image/contentUrl/thumbnailUrl 欄位都 `startsWith('https://')` 且含 base path | Task 18 |
| **Task 18 poster 存在**：verify 只查 thumbnailUrl startsWith https、沒查對應 jpg 檔案存在 | verify-prerender 加規則：解析 thumbnailUrl 取檔名、`fs.access(dist/video-posters/<name>.jpg)`、不存在則 fail | Task 18 |
| **Task 20 順序**：generate-video-poster 在 build 後跑、但 Vite build 已複製 public/ 進 dist、新 poster 不會進 dist | 二選一：(a) generate-video-poster **移到 `pnpm build` 之前**（讓 Vite 複製）、或 (b) 輸出直接寫 `dist/video-posters/`。建議 (a) + poster commit 進 repo（CI 不依賴生成） | Task 20 |
| **Task 20 Playwright deps**：cache hit 跳過 `playwright install --with-deps`、但 Linux system deps 不在 browser cache | 拆兩步：`playwright install-deps chromium`（每次都跑、裝 system deps）+ `playwright install chromium`（cache miss 才跑、裝 browser binary） | Task 20 |
| **Task 21 robots 措辭**：subpath sitemap 不「解決」GH Pages root robots 限制、Google 只看 host root robots | 改措辭：sitemap 提交是「補 URL discovery」、不是 robots 限制的解法；robots 限制本身在無 custom domain 下無解、但因 `leadingtw273.github.io/robots.txt` 未必擋爬、實務影響小 | Task 21 / spec §6.2 |
| **Task 21 ownership**：Search Console ownership 不能假設 DNS（非自有 domain） | 明確推薦 **HTML meta tag verification**：Google 給的 `<meta name="google-site-verification">` 放進 root redirect page（`scripts/__fixtures__/root-redirect-template.html` 的 head）；Bing 從 Search Console 一鍵 import | Task 21 |
| **附錄 B rollback**：太粗、Phase 4 後 build pipeline 已依賴 copy-html-entries/prerender/verify、單 revert 一個 task 會留下 CI 指向不存在 script | 改 **phase-level rollback**：列出每個 phase 需「一起 revert 的 task commit set」；Phase 4/5 不可單 task revert（package.json scripts + deploy.yml 與 scripts/ 綁定） | 附錄 B |

### E.2 P2 nice-to-have（11 條、可選但建議）

| codex 意見 | 修正指引 | 影響 task |
|---|---|---|
| Task 5 fallback test `toContain(['zh-Hant','en'])` 太寬 | mock `navigator.language`（`vi.stubGlobal('navigator', { language: 'en-US' })`）後精確 assert | Task 5 |
| Task 6 `window.location.href=` jsdom navigation not implemented | 用 `window.location.assign(url)` 或抽 helper（已在 E.1 Task 6 解決） | Task 6 |
| Task 10 priceRange / SEO title 價格 placeholder | 列入 Final Launch 人工核對清單（spec §1.3.2）、避免 structured data 與可見價格不同步 | Task 10 |
| Task 12 排序 | Task 12 應排在 Task 13/14 之後執行、最後驗一次 console hydration warning | Task 12 順序 |
| Task 13 jsdom clientWidth=0 | 若測 scroll 行為需 mock layout；本 plan 只測 button/track/卡數存在、不測 scroll 距離、避開此坑 | Task 13 |
| Task 14 FALLBACK_RATES 無來源/更新流程 | 已移除 FALLBACK_RATES（E.1 Task 14）；SEO title 價格數字改 Final Launch 人工核對、不依賴動態匯率 | Task 14 |
| Task 16 `kill %1` 依賴 interactive shell job control | local 驗證統一改用 PID（`PID=$!; ...; kill $PID`）、與 CI 一致 | Task 16 / 各 preview step |
| Task 17 lastmod 語意粗（整站共用 git HEAD date） | 可接受；單頁站、無 per-page lastmod 需求 | Task 17 |
| Task 20 PREVIEW_PID export timing | 可接受（$GITHUB_ENV 寫入後後續 step 可讀）；風險僅 preview 啟動失敗時 wait-on 會 fail、可接受 | Task 20 |
| 工期 Task 16 過大 | 已拆三（E.1 Task 16 拆分）、Phase 4 估 2.5-3 天維持 | Task 16 |
| 規模 Task 2+3 可合併 | 可選；本 plan 保留分開（Task 2 是 meta、Task 3 是 crawler files、責任不同）、Task 11 維持獨立（素材 task） | Task 2/3/11 |

### E.3 Task 13 最小改法註（降低 refactor 風險）

codex 指出 Task 13 是真 refactor、應獨立保留。若全面改 CSS scroll-snap 風險高（會動 autoplay / dots / translateX 整套），**最小可行改法**：

- 保留現有 translateX + visibleCount + autoplay + dots 全部 UX
- 只把 `useState(3)` 初始值 + `getVisibleCount(window.innerWidth)` 的 hydration 風險解掉：
  - `visibleCount` 初始值固定 `3`（與 prerender desktop 1280 viewport 一致）
  - prerender 在 desktop viewport 跑 → prerender HTML 是 visibleCount=3 的 DOM
  - client hydrate 第一幀 visibleCount 也是初始 3 → **與 prerender 一致、無 mismatch**
  - mount 後 useEffect 的 `compute()` 才依實際 innerWidth 調整（mobile 改 1）→ 這是 mount-after、不影響 hydration 第一幀
- AddOnCard 加 `role="article"` 供 test 抓
- **結論**：Task 13 不需大 refactor、只需「visibleCount 初始值固定 3（SSR-safe）+ AddOnCard role」即可解 hydration；CSS-only 全改列為 P2 可選優化（spec §5.4 原寫 CSS-only、但最小改法已足夠解 mismatch、降低風險）

**此註修正 spec §5.4 / §13 對 AddOnsCarousel「必須改 CSS-only」的要求** → 放寬為「visibleCount 初始值 SSR-safe（固定 3）即可、CSS-only 為可選」。執行時若 leadi / reviewer 偏好徹底 CSS-only、再升級。
