# AI 人像工作室 — 形象 Landing Site 設計規格

- **日期**：2026-05-21
- **狀態**：Design approved by user，待 plan
- **撰寫**：Claude Code (Opus 4.7) + 使用者 leadi + Gemini 視覺檢閱（5 張參考截圖）
- **下一步**：writing-plans skill 產出 implementation plan

---

## 1. 目的與成功標準

### 1.1 目的

為 leadi 經營的「AI 人像工作室」建立一頁式形象網站，作為**短期推廣與 B2B 商家評估入口**。網站本身不做業務轉換（沒有結帳 / 預約系統），唯一轉換出口是 **Telegram 聯絡**。

### 1.2 元前提（自檢產出，鎖定）

| 維度 | 值 | 影響 |
|---|---|---|
| **目標使用者** | 混雜（B2B 商家 / 個人客戶 / 既有粉絲），**本版本以 B2B 商家評估為主**設計 hierarchy；個人 / 粉絲是次要受眾 | hero 文案、方案區結構偏 B2B 評估動線；個人客戶仍能看懂方案分級 |
| **類比參考** | Midjourney / Krea / Runway 風的 AI 公司官網（深色 + 大圖 hero + 高對比 + 現代感）；使用者另提供 5 張具體參考截圖作為視覺基準 | 配色、字級、紫色 accent、glass / glow 效果均對齊參考圖 |
| **Identity** | 個人推廣門面（非商業產品官網） | 不需要客服系統 / 多帳號 / 後台；可接受手動更新內容 |
| **動機** | 累積觀眾、把流量導到 Telegram；長期可能擴展到收費合作 | landing 是 funnel 入口，主 CTA 與 final CTA 都指向 TG |

### 1.3 成功標準

形象站本身**沒有量化 KPI**（不會接 GA / 分析）—— 成功標準是質性的：

1. 主管 / 朋友 / 潛在合作對象第一次打開能在 **5 秒內知道**「這是做什麼的」（hero）
2. **15 秒內**能看到代表作品（demo grid 在 first scroll 內進場）
3. **30 秒內**能找到聯絡方式（footer / final CTA / hero CTA 三處冗餘）
4. 視覺品質達到「能拿去 TG / IG 貼連結不覺得難看」的程度（深色 SaaS 風品質基線）
5. 中英雙語切換無體感延遲、字串一致性 100%（TS 型別強制）

---

## 2. 技術棧與部署

### 2.1 棧

- **框架**：React 19 + TypeScript ~5.6
- **建構**：Vite 6+
- **樣式**：Tailwind CSS 3.4+（custom theme）
- **i18n**：自寫 `LanguageProvider` Context + TS object 字典（不用 i18n 框架）
- **測試**：Vitest + @testing-library/react + jsdom
- **Lint**：ESLint flat config（沿用 prompt-tool 設定模板）

### 2.2 不用的東西（YAGNI）

- ~~react-router-dom~~：純單頁 + anchor scroll、不需要
- ~~react-i18next / i18next~~：兩語言 + 一頁站、自寫 Context 約 50 行就夠
- ~~Framer Motion / GSAP~~：動效強度低（只 fade in / hover transition）、Tailwind transition + `IntersectionObserver` 就夠
- ~~CSS-in-JS（styled / emotion）~~：Tailwind 已足
- ~~分析（GA / Plausible）~~：個人推廣門面、本版不需要

### 2.3 部署架構

**獨立 GitHub repo `ai-portrait-studio-site` → GitHub Pages**

- 與既有 `ai-influencers` monorepo **完全解耦**（不同 repo、不同 git remote、不同 deploy pipeline）
- 原因：`ai-influencers` 含 character 業務資料 seed、不適合 publish；landing 需要 public hosting
- URL：`https://<github-user>.github.io/ai-portrait-studio-site/`（後期可換 custom domain）
- Vite `base: '/ai-portrait-studio-site/'` 設定
- 透過 GitHub Actions build + `actions/deploy-pages@v4` 自動部署

### 2.4 素材策略

**Repo 只裝 code，所有圖片 / 影片素材放外部 hosting**

- 圖片：可選 Cloudflare Images / imgur / 自架 S3 + CloudFront；URL 寫進 `src/data/content.ts` 常數
- 影片：YouTube embed（最簡）或 Cloudflare Stream（控制更好）；不用 `<video src=local>`
- Repo 大小目標：< 5 MB（純 code + favicon + 一點 placeholder）
- 上線前再換真實素材；spec 撰寫時 demo 區可放 placeholder URL

---

## 3. 頁面結構（區塊清單）

一頁式 SPA、由上而下 8 個區塊 + 1 個浮動元素：

| # | 區塊 | 內容要點 |
|---|---|---|
| 1 | **Nav**（sticky top） | logo「✦ AI 人像工作室」+ 三個 anchor 連結（方案 / Demo / 聯絡）+ 中/EN 語言切換 |
| 2 | **Hero** | sparkle badge「AI 智能 ・ 創新 ・ 專業 ・ 服務」+ 大標「AI 人像工作室」+ 雙副標（定位 + 詳細說明）+ 雙 CTA（紫色主 fill「查看作品展示」+ ghost outline「立即諮詢」）+ scroll hint mouse icon |
| 3 | **Demo（tab 切換）** | 上 badge「✦ 作品展示」+ 標題「AI 生成作品範例」+ 副標 + tab segment「🖼 圖片人像生成 / 🎬 影片人像生成」（**預設 active = 圖片**）+ 2-3 卡 grid + 下方紫色 outline tech explainer banner（補 B2B 文案密度） |
| 4 | **Pricing** | badge「✦ 服務方案」+ 標題「選擇適合您的方案」+ 副標 + 三卡橫排（基礎 / 專業 / 企業）；中卡「專業方案」突出方式：紫色描邊 + 底部 glow + 右上「最熱門」桃紫色標籤 + 紫色 fill CTA；左右卡 ghost outline CTA |
| 5 | **加購服務** | 標題「加購服務」+ 副標 + 三卡（額外影片 / 加速交付 / 額外訓練照片），每卡：項目名 + 短描述 + 紫色單價 + 計量單位 |
| 6 | **Final CTA** | **紫色漸層邊框框**（1px gradient border + 內發光） + 標題「不確定哪個方案適合您？」+ 說服文 + 紫色 fill「✦ 免費諮詢」按鈕 |
| 7 | **Footer** | logo + tagline + 「聯絡我們」標題 + Telegram CTA（藍色 outline 按鈕「✈ Telegram 諮詢」） + 「回覆時間：通常 24 小時內」+ 分隔線 + 版權「© 2026 AI 人像工作室. All rights reserved.」+ 服務條款 / 隱私政策 placeholder 連結 |
| 浮動 | **Scroll-to-top** | 圓形紫色按鈕、固定右下、scroll 超過 Hero 區後 fade in |

### 3.1 區塊邏輯

- **Hero → Demo → Pricing → AddOns → Final CTA** 是 B2B 評估動線：定位 → 看作品 → 看價位 → 看補強 → 推一把
- TG CTA 在頁面有 **4 個觸點**：Hero 次按鈕、Pricing 每卡按鈕、Final CTA 大按鈕、Footer 大按鈕（冗餘設計、不怕使用者錯過）

---

## 4. Design Tokens

寫進 `tailwind.config.ts` 的 `theme.extend` 與 `src/styles/globals.css`。

### 4.1 配色（從參考圖萃取）

```ts
colors: {
  bg: {
    base:     '#0E0B1F',  // 全站底（深紫紺）
    elevated: '#1A0F2F',  // 卡片底
  },
  brand: {
    500: '#7C3AED',  // primary（按鈕、tab active）
    400: '#8B5CF6',
    300: '#A855F7',  // 強調、glow
    accent: '#D946EF', // 桃紫（用在「最熱門」標籤）
  },
  surface: {
    DEFAULT: 'rgba(255,255,255,0.03)',  // 卡片背景透明層
    hover:   'rgba(255,255,255,0.06)',
  },
  border: {
    subtle: 'rgba(255,255,255,0.08)',   // 一般卡片 border
    brand:  'rgba(168,85,247,0.4)',     // badge / glass border
  },
}
```

文字色使用 Tailwind 預設：`text-white`（標題）/ `text-gray-300`（副標）/ `text-gray-400`（內文）。**禁用 gray-500 以下**（深色底會掉到 WCAG AA 對比門檻以下）。

### 4.2 陰影 / Glow

```ts
boxShadow: {
  'glow-md': '0 0 16px rgba(124,58,237,0.25)',
  'glow-lg': '0 8px 24px -4px rgba(124,58,237,0.4)',  // pricing 中卡底部 glow
  'glow-xl': '0 0 32px rgba(124,58,237,0.3)',         // final CTA 框外發光
}
```

### 4.3 字型

```ts
fontFamily: {
  sans: ['Inter', 'Noto Sans TC', 'system-ui', '-apple-system', 'sans-serif'],
}
```

- `Inter`：英文字體、SaaS 風標配；用 `npm:@fontsource/inter` 自托管避免 GFonts 隱私問題
- `Noto Sans TC`：中文字體；同 `@fontsource/noto-sans-tc`
- Fallback `system-ui` 是離線 / CDN 失敗的兜底

### 4.4 自訂 utility（`globals.css`）

```css
@layer utilities {
  .glass {
    @apply bg-surface backdrop-blur-md border border-border-subtle;
  }
  .glow-border-gradient {
    /* Final CTA 用：用 1px padding + gradient background 模擬 gradient border */
    background: linear-gradient(135deg, #A855F7, #7C3AED, #3F1A6F);
    padding: 1px;
    border-radius: 14px;
  }
}
```

---

## 5. RWD 策略

### 5.1 Tailwind breakpoint override

```ts
// tailwind.config.ts
theme: {
  screens: {
    'mobile':  '425px',
    'tablet':  '768px',
    'desktop': '1024px',
    '4k':      '2560px',
  },
}
```

**重要**：這會覆蓋 Tailwind 預設的 `sm / md / lg / xl / 2xl`，所有 class 都改用上面 4 個前綴。

### 5.2 每個斷點的佈局規則

| Breakpoint | 區塊行為 |
|---|---|
| **< 425（unsupported）** | 不設計，但盡力不破版（Tailwind default behavior） |
| **425px（mobile）** | 全 grid 堆疊單欄；Nav 變漢堡選單；Pricing 三卡 vertical stack，中卡「最熱門」標籤從**右上角**改**卡頂置中**避免撞圓角 padding；Demo grid 1 欄、卡片大圖；AddOns 1 欄 |
| **768px（tablet）** | Demo grid 2 欄；Pricing 仍單欄 stack（三卡塞 768 反而擠）；AddOns 2 欄；Nav 仍漢堡（不展開全文） |
| **1024px（desktop）** | Pricing 三卡橫排；Demo grid 2-3 欄；Nav 展開完整連結 + 語言切換 |
| **2560px（4k）** | 內容 `max-w-7xl mx-auto`（約 1280px 置中、不拉滿）；Hero 字級可放大一級；Pricing 卡之間 gap 加大 |

### 5.3 a11y / RWD 必殺 bug 預防

- 所有 button / link 點擊區 ≥ **44 × 44 px**（footer 連結特別注意）
- Pricing 中卡「最熱門」標籤的響應式位置切換（425 改卡頂）
- 影片：mobile 不自動播放、改 poster + click-to-play（省流量、省電）
- `<html lang>` 屬性跟著語言切換（screen reader / SEO）
- 所有圖片 `<img alt="">`，裝飾性圖片 `alt=""`、有意義圖片寫描述
- 鍵盤導航：Tab 順序符合視覺順序；focus ring 維持可見（紫色 outline）

---

## 6. 檔案結構

```
ai-portrait-studio-site/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                # 入口、掛 <LanguageProvider>
│   ├── App.tsx                 # 組合 8 個 section
│   ├── i18n/
│   │   ├── LanguageProvider.tsx
│   │   ├── useT.ts
│   │   ├── messages.zh.ts      # 中文字典（TS object）型別 source
│   │   └── messages.en.ts      # 英文字典，shape 必須與 zh 一致
│   ├── sections/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── Demo.tsx            # 含 tab 切換 useState
│   │   ├── Pricing.tsx
│   │   ├── AddOns.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── Footer.tsx
│   │   └── ScrollToTop.tsx
│   ├── components/             # 可重用小元件
│   │   ├── Badge.tsx           # ✦ 膠囊 badge
│   │   ├── SectionHeader.tsx   # badge + 標題 + 副標 三件套
│   │   ├── PlanCard.tsx        # Pricing 卡，props 控基礎 / 推薦 / 企業樣式
│   │   ├── AddOnCard.tsx
│   │   ├── DemoCard.tsx        # 右上時長 tag + 中央 play icon
│   │   └── TabSegment.tsx      # Demo tab 切換、純展示元件 + onChange callback
│   ├── data/
│   │   └── content.ts          # 圖片 / 影片 URL + 方案 / 加購資料常數
│   ├── styles/
│   │   └── globals.css
│   └── lib/
│       └── cn.ts               # clsx wrapper
├── tests/
│   ├── i18n.test.tsx
│   └── sections.test.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── .gitignore
├── README.md
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-21-landing-site-design.md   ← 本檔
```

### 6.1 模組邊界原則

- **`sections/*`**：每個 section 是獨立元件、可單獨 render；只能依賴 `components/`、`i18n/`、`data/`，**不互相依賴**
- **`components/*`**：純展示元件、props in / JSX out；不持有 i18n state（讓 section 抽 t 傳 props 進來）
- **`i18n/`**：唯一持有 lang state 的地方；其他模組透過 `useT()` 取
- **`data/content.ts`**：所有非翻譯文案（圖片 URL、方案 deliverables list、單價數字）；翻譯文字才放 i18n messages

---

## 7. i18n 設計

### 7.1 字典型別 source

```ts
// src/i18n/messages.zh.ts
export const zh = {
  nav: { plans: '方案', demo: 'Demo', contact: '聯絡' },
  hero: {
    badge: 'AI 智能 ・ 創新 ・ 專業 ・ 服務',
    title: 'AI 人像工作室',
    subtitle: '專業的 AI 人像生成與影片製作服務',
    description: '透過先進的 LoRA 訓練技術與 AI 影片生成，為您打造獨一無二的數位人像作品',
    ctaPrimary: '查看作品展示',
    ctaSecondary: '立即諮詢',
  },
  demo: { /* ... */ },
  pricing: { /* ... */ },
  addons: { /* ... */ },
  finalCta: { /* ... */ },
  footer: { /* ... */ },
} as const

export type Messages = typeof zh
```

```ts
// src/i18n/messages.en.ts
import type { Messages } from './messages.zh'
export const en: Messages = {
  nav: { plans: 'Plans', demo: 'Demo', contact: 'Contact' },
  hero: { /* ... 必須完全對應 zh shape */ },
  // ...
}
```

TS compile 階段就抓「en 缺 zh 有的 key」這種 bug。

### 7.2 Provider + hook

```tsx
// src/i18n/LanguageProvider.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { zh, type Messages } from './messages.zh'
import { en } from './messages.en'

type Lang = 'zh' | 'en'
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Messages }
const LanguageCtx = createContext<Ctx | null>(null)

const STORAGE_KEY = 'ai-portrait-studio-lang'

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh'
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
  if (stored === 'zh' || stored === 'en') return stored
  // first visit: navigator.language 開頭 zh → 'zh'，其他 → 'en'
  return navigator.language.startsWith('zh') ? 'zh' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectInitialLang)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en'
  }, [lang])
  const t = lang === 'zh' ? zh : en
  return <LanguageCtx.Provider value={{ lang, setLang, t }}>{children}</LanguageCtx.Provider>
}

export function useT() {
  const ctx = useContext(LanguageCtx)
  if (!ctx) throw new Error('useT must be used within <LanguageProvider>')
  return ctx
}
```

### 7.3 使用範例

```tsx
// src/sections/Hero.tsx
import { useT } from '@/i18n/useT'

export function Hero() {
  const { t } = useT()
  return (
    <section>
      <Badge>{t.hero.badge}</Badge>
      <h1>{t.hero.title}</h1>
      <p>{t.hero.subtitle}</p>
      {/* ... */}
    </section>
  )
}
```

### 7.4 不在 i18n 範圍內的東西

- 圖片 / 影片 URL（同一個跨語言）
- 方案數字（NT$ 1,200 / NT$ 2,800 / NT$ 5,800）
- 日期時間（暫時不顯示）

---

## 8. CI/CD — GitHub Pages 部署

### 8.1 Vite 設定

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ai-portrait-studio-site/',
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
})
```

### 8.2 GitHub Actions

```yaml
# .github/workflows/deploy.yml
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
      - run: pnpm test
      - run: pnpm build
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

### 8.3 GitHub repo 設定（建 repo 後手動做一次）

- Settings → Pages → Source: `GitHub Actions`
- Settings → Pages → Custom domain: 暫不設
- Settings → Actions → General → Workflow permissions: `Read and write permissions`

---

## 9. 測試策略

### 9.1 範圍

不追求高覆蓋率（純展示站、logic 極少）。重點 3 類：

1. **i18n 切換**：
   - `LanguageProvider` 預設 lang 從 `localStorage` 取、缺值 fallback navigator.language
   - `setLang('en')` 後 `useT()` 回傳的字典變 en
   - `<html lang>` attribute 同步更新
   - 缺 key 場景（en 字典缺項）TS compile 階段就擋住 → 不寫 runtime test
2. **Tab 切換**：
   - `Demo` section 點「影片人像生成」tab 後 grid 內容換、active 樣式正確
   - 鍵盤 Tab + Enter 可切換
3. **Section smoke render**：
   - 每個 section 用 `<LanguageProvider>` wrap 後 render 不爆
   - Pricing 中卡有 "最熱門" 標籤、其他卡無

### 9.2 工具

- `vitest` + `@testing-library/react` + `@testing-library/user-event` + `jsdom`
- 對齊 `prompt-tool` 既有設定

### 9.3 不寫的東西

- ~~Visual regression / snapshot~~：一頁式站、不值得維護 snapshot
- ~~E2E（Playwright）~~：等真實素材上線後再考慮人工 smoke
- ~~Lighthouse CI~~：本版不追求分數、上線後 manual 抽查

---

## 10. Out of scope（明確排除）

| 項目 | 為什麼不做 | 何時可能做 |
|---|---|---|
| 後台 / CMS | 個人推廣門面、內容更新頻率低、直接改 code commit | 客戶量大到內容每週更新 |
| 表單 / contact form | 動機是導 TG，多一個表單分流轉換 | 收費合作開始後 |
| 分析（GA / Plausible / Umami） | 本版不追蹤、看的是質性 | 開始 A/B 不同 hero copy 時 |
| 暗色 / 亮色切換 | 視覺定位就是深色 | N/A（不會做） |
| 多於 2 語言 | 兩語言 + 自寫 Context 足夠；多語言才升 i18next | 加日 / 韓時 |
| Blog / Case Study 頁 | 一頁式 scope；要寫文章另外接 | 需要 SEO 內容行銷時 |
| 客戶評價 / Testimonial 區 | 剛起步、沒累積 | 累積 5+ 案例後加 |
| 影片自動播放 / Hero 動態背景 | 動效強度低、手機流量 / 電池友善 | 不會做 |

---

## 11. 開放問題（writing-plans 階段可解）

1. **GitHub username 是什麼**？影響 `base` path 與 GitHub Pages URL。
2. **Telegram handle** 實際是什麼？需要寫進 `data/content.ts`，所有 TG CTA 用同一個常數。
3. **5 張參考截圖** 的實際素材（demo 區圖片 / 影片）來源是什麼？需要使用者提供初版 URL（可先 placeholder Unsplash + YouTube embed 公開影片）。
4. **方案資料**（基礎 / 專業 / 企業 / 加購）的細項數字 / deliverables 是否確定？spec 沿用參考圖文案，需確認是最終版還是 placeholder。
5. **服務條款 / 隱私政策** 連結要不要實際寫？還是先放 `#` 死連結 / 直接隱藏？個人推廣門面通常不需要正式法律文件。

---

## 12. 鎖定前提（決策依據、不再回頭）

以下決策已確認、後續 plan / implementation 不再 revisit：

- ✅ 獨立 repo `ai-portrait-studio-site`（不放 ai-influencers monorepo）
- ✅ React 19 + TS + Vite + Tailwind 3，**不用** i18next / Framer Motion / styled-components
- ✅ i18n 自寫 Context + TS object 字典
- ✅ GitHub Pages 部署、Vite `base: '/ai-portrait-studio-site/'`
- ✅ 素材全部外部 hosting（repo 不裝 image / video）
- ✅ 動效低強度（fade in + hover transition only）
- ✅ Tailwind breakpoint 改 `425 / 768 / 1024 / 2560`
- ✅ Demo 區用 tab 切換、預設 active = 圖片
- ✅ 加購服務區獨立區塊（介於 Pricing 與 Final CTA 之間）
- ✅ Hero badge + Scroll-to-top 都加
- ✅ Footer TG = CTA 按鈕 + hyperlink
- ✅ 不接 GA / 不寫 visual regression / 不做表單

---

## 附錄 A：參考截圖

5 張使用者提供的參考截圖（Windows path）：
- `C:\Users\markchou\Pictures\Screenshots\螢幕擷取畫面 2026-05-21 122431.png`（Hero 區）
- `C:\Users\markchou\Pictures\Screenshots\螢幕擷取畫面 2026-05-21 122445.png`（Hero 結尾 + 作品展示開頭）
- `C:\Users\markchou\Pictures\Screenshots\螢幕擷取畫面 2026-05-21 122459.png`（影片 demo grid + 紫框 banner）
- `C:\Users\markchou\Pictures\Screenshots\螢幕擷取畫面 2026-05-21 122512.png`（方案 pricing 三卡 + 加購頂部）
- `C:\Users\markchou\Pictures\Screenshots\螢幕擷取畫面 2026-05-21 122521.png`（加購服務 + Final CTA + Footer）

Gemini 視覺檢閱結論已整合進 §3-§5 的具體細節（Hero badge sparkle icon、影片時長 tag 黑底膠囊、Pricing 中卡底部 glow、Final CTA 紫色漸層邊框等）。

## 附錄 B：腦力激盪過程記錄

- 視覺對齊：使用 brainstorming visual-companion 推送 2 版 wireframe（`section-order.html` → `section-order-v2.html`）給使用者 confirm
- 元前提自檢結果（揭露新維度）：
  - 「混雜使用者 → 本版以 B2B 為主」與「Identity = 個人推廣門面」之間有張力，最終解讀為「個人 brand 起家但這版 hierarchy 偏 B2B 評估動線」
  - 「初期放 GH Pages」答案揭露獨立 repo / 解耦 ai-influencers 的必要
- 三條 i18n 路線比較後使用者選路線 A（自寫 Context）
- 工程設計（檔案結構 / Tailwind tokens / CI/CD / 測試）一段過、無爭議
