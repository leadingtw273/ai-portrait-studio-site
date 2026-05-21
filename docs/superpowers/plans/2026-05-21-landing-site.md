# AI 人像工作室 — Landing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建一個一頁式形象 landing site（深色 SaaS 風、6 section + Nav + ScrollToTop、3 套字典 i18n、Tailwind 4 個 custom breakpoint），部署到 GitHub Pages。

**Architecture:** React 19 SPA、Vite build、Tailwind 3 custom theme（紫色 accent + glass + glow）；自寫 LanguageProvider Context + 3 套 TS object 字典（zh-Hant 為型別 source、zh-Hans / en 對應 shape）；anchor scroll 取代 router；素材 URL 集中放 `src/data/content.ts`、本版上線時用 placeholder URL（Unsplash + YouTube）；GH Actions deploy → `gh-pages`。

**Tech Stack:** React 19.2 / TypeScript 5.6 / Vite 8 / Tailwind CSS 3.4 / Vitest 4 / @testing-library/react / lucide-react / @fontsource/inter + noto-sans-tc / pnpm 9 / Node 20

**Spec:** `docs/superpowers/specs/2026-05-21-landing-site-design.md`

**工作目錄**：所有路徑相對於 `/home/markchou/project/ai-portrait-studio-site/`，每個 step 在這個 repo 內執行。

---

## Phase 1 — 專案基底（Task 1-3）

### Task 1：Scaffold Vite + React + TS + Tailwind + ESLint

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/globals.css`
- Create: `public/favicon.svg`

- [ ] **Step 1.1：建立 package.json**

```json
{
  "name": "ai-portrait-studio-site",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit -p tsconfig.app.json"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "lucide-react": "^0.460.0",
    "@fontsource/inter": "^5.1.0",
    "@fontsource/noto-sans-tc": "^5.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
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
    "postcss": "^8.5.10",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.6.3",
    "typescript-eslint": "^8.58.0",
    "vite": "^8.0.4",
    "vitest": "^4.1.4"
  }
}
```

- [ ] **Step 1.2：建立 tsconfig 三件套**

`tsconfig.json`：
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"]
}
```

`tsconfig.node.json`：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts", "postcss.config.js", "eslint.config.js"]
}
```

- [ ] **Step 1.3：建立 vite.config.ts**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/ai-portrait-studio-site/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
```

> 用 `vitest/config` 的 `defineConfig` 才認得 `test` field、避免 typecheck error。Vite plugin 在 dev / build 時自動 ignore `test` field。

- [ ] **Step 1.4：建立 tailwind.config.ts（先放 minimal、設計 token 在 Task 2 補完）**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      mobile:  '425px',
      tablet:  '768px',
      desktop: '1024px',
      '4k':    '2560px',
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 1.5：建立 postcss.config.js**

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
```

- [ ] **Step 1.6：建立 eslint.config.js**

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
```

- [ ] **Step 1.7：建立 index.html**

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/ai-portrait-studio-site/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="description" content="AI 人像工作室 — 專業的 AI 人像生成與影片製作服務" />
    <meta property="og:title" content="AI 人像工作室" />
    <meta property="og:description" content="專業的 AI 人像生成與影片製作服務" />
    <meta property="og:type" content="website" />
    <title>AI 人像工作室 — AI Portrait Studio</title>
  </head>
  <body class="bg-bg-base text-white antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 1.8：建立 public/favicon.svg（紫色 sparkle icon）**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5z"/>
  <path d="M5 3v2M5 21v-2M3 5h2M21 5h-2M3 19h2M21 19h-2"/>
</svg>
```

- [ ] **Step 1.9：建立 src/main.tsx 與 src/App.tsx 骨架**

`src/main.tsx`：
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/noto-sans-tc/400.css'
import '@fontsource/noto-sans-tc/600.css'
import '@fontsource/noto-sans-tc/700.css'
import './styles/globals.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`src/App.tsx`（先 placeholder、Phase 5 才組裝 sections）：
```tsx
export function App() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl">AI 人像工作室 — Scaffolding</h1>
    </main>
  )
}
```

- [ ] **Step 1.10：建立 src/styles/globals.css（先 minimal）**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', 'Noto Sans TC', system-ui, -apple-system, sans-serif;
  }
}
```

- [ ] **Step 1.11：安裝依賴、執行 dev 驗證**

```bash
pnpm install
pnpm dev
```

Expected：dev server 起在 `http://localhost:5173/ai-portrait-studio-site/`，可看到「AI 人像工作室 — Scaffolding」標題；Ctrl-C 關閉。

- [ ] **Step 1.12：執行 typecheck + lint 驗證**

```bash
pnpm typecheck
pnpm lint
```

Expected：兩個都 pass、無 error。

- [ ] **Step 1.13：建立 vitest.setup.ts 並驗證測試環境**

`vitest.setup.ts`：
```ts
import '@testing-library/jest-dom/vitest'
```

`tests/scaffold.test.tsx`（一個煙霧測試）：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from '../src/App'

describe('App scaffold', () => {
  it('renders the studio title', () => {
    render(<App />)
    expect(screen.getByText(/AI 人像工作室/)).toBeInTheDocument()
  })
})
```

```bash
pnpm test
```

Expected：1 test pass。

- [ ] **Step 1.14：Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React 19 + TS + Tailwind + Vitest"
```

---

### Task 2：Tailwind theme（design tokens）+ globals.css utility

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/styles/globals.css`
- Create: `tests/theme.test.tsx`

- [ ] **Step 2.1：擴充 tailwind.config.ts theme**

（Theme token 不寫 vitest test — jsdom 無法 compute style、寫 className 存在的 assert 無實質意義；改用 Task 18.2 dev server 手動視覺驗證）

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      mobile:  '425px',
      tablet:  '768px',
      desktop: '1024px',
      '4k':    '2560px',
    },
    extend: {
      colors: {
        bg: {
          base:     '#0E0B1F',
          elevated: '#1A0F2F',
        },
        brand: {
          500: '#7C3AED',
          400: '#8B5CF6',
          300: '#A855F7',
          accent: '#D946EF',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          hover:   'rgba(255,255,255,0.06)',
        },
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-brand':  'rgba(168,85,247,0.4)',
      },
      boxShadow: {
        'glow-md': '0 0 16px rgba(124,58,237,0.25)',
        'glow-lg': '0 8px 24px -4px rgba(124,58,237,0.4)',
        'glow-xl': '0 0 32px rgba(124,58,237,0.3)',
      },
      backdropBlur: { card: '12px' },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #A855F7, #7C3AED, #3F1A6F)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 2.3：擴充 src/styles/globals.css 加 utility**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', 'Noto Sans TC', system-ui, -apple-system, sans-serif;
    background-color: #0E0B1F;
    color: white;
  }
  :focus-visible {
    outline: 2px solid #A855F7;
    outline-offset: 2px;
  }
}

@layer utilities {
  .glass {
    background-color: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .glow-border-gradient {
    background: linear-gradient(135deg, #A855F7, #7C3AED, #3F1A6F);
    padding: 1px;
    border-radius: 14px;
  }
  .glow-border-gradient > * {
    background: linear-gradient(135deg, #1A0F2F, #100820);
    border-radius: 13px;
  }
}
```

- [ ] **Step 2.4：dev server 手動視覺驗證**

```bash
pnpm dev
```

Expected：打開瀏覽器看到深紫色背景（`#0E0B1F`）、白字標題；Ctrl-C 關閉。

- [ ] **Step 2.5：跑 typecheck 確認 Tailwind config TS 對**

```bash
pnpm typecheck
```

Expected：no error。

- [ ] **Step 2.6：Commit**

```bash
git add tailwind.config.ts src/styles/globals.css
git commit -m "feat: tailwind theme — bg / brand colors / glow shadows / glass utility"
```

---

### Task 3：data/content.ts placeholder + lib/cn util

**Files:**
- Create: `src/lib/cn.ts`
- Create: `src/data/content.ts`
- Create: `tests/cn.test.ts`

- [ ] **Step 3.1：寫 cn util 測試**

`tests/cn.test.ts`：
```ts
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('merges class names with space separator', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('skips falsy values', () => {
    expect(cn('foo', false, undefined, null, 0, 'bar')).toBe('foo bar')
  })

  it('flattens conditional class objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })
})
```

```bash
pnpm test cn.test
```

Expected：FAIL — `cn` 還不存在。

- [ ] **Step 3.2：實作 src/lib/cn.ts**

```ts
type ClassValue = string | number | boolean | null | undefined | { [key: string]: boolean }

export function cn(...values: ClassValue[]): string {
  const out: string[] = []
  for (const v of values) {
    if (!v) continue
    if (typeof v === 'string' || typeof v === 'number') {
      out.push(String(v))
    } else if (typeof v === 'object') {
      for (const [key, enabled] of Object.entries(v)) {
        if (enabled) out.push(key)
      }
    }
  }
  return out.join(' ')
}
```

```bash
pnpm test cn.test
```

Expected：3 test pass。

- [ ] **Step 3.3：建立 src/data/content.ts（placeholder URL、可上線前換）**

```ts
// 集中所有「非翻譯」資料：URL、價格、deliverable list 結構
// 翻譯文字（標題 / 描述）放在 i18n messages

// TG 聯絡（plan 階段是 placeholder、上線前 leadi 提供真實 handle 後替換）
export const TELEGRAM_HANDLE = '@ai_portrait_studio'  // TODO: leadi 上線前提供真實 handle
export const TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE.slice(1)}`

// Demo 區素材（placeholder 使用 Unsplash 公開圖 + YouTube 公開示範影片，上線前 leadi 換真實素材）
export type DemoImage = { src: string; alt: string }
export type DemoVideo = { youtubeId: string; posterUrl: string; durationSec: string }

// 注意：3 張 image（spec §3 寫 2-3 卡）
export const DEMO_IMAGES: DemoImage[] = [
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', alt: 'AI portrait sample 1' },
  { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', alt: 'AI portrait sample 2' },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', alt: 'AI portrait sample 3' },
]

// 注意：YouTube placeholder 用 YouTube Developers 官方頻道「YouTube API Intro」(M7lc1UVf-VE)
// 避免 Rickroll 風險、上線前 leadi 替換為真實影片 ID
export const DEMO_VIDEOS: DemoVideo[] = [
  {
    youtubeId: 'M7lc1UVf-VE',
    posterUrl: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
    durationSec: '3-5',
  },
  {
    youtubeId: 'M7lc1UVf-VE',
    posterUrl: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
    durationSec: '2-4',
  },
]

// 方案資料（結構性、文案描述放 i18n、這裡只放數字 + 視覺 flag）
export type PlanTier = 'basic' | 'pro' | 'enterprise'
export const PLAN_PRICES: Record<PlanTier, number> = {
  basic:      1200,
  pro:        2800,
  enterprise: 5800,
}
export const PLAN_HIGHLIGHTED: PlanTier = 'pro'  // 中卡突出「最熱門」

// 加購服務
export type AddOnKey = 'extraVideo' | 'rushDelivery' | 'extraTrainingPhotos'
export type AddOn = { key: AddOnKey; price: number; unit: 'video' | 'order' | 'photo' }
export const ADDONS: AddOn[] = [
  { key: 'extraVideo',           price: 500, unit: 'video' },
  { key: 'rushDelivery',         price: 800, unit: 'order' },
  { key: 'extraTrainingPhotos',  price: 15,  unit: 'photo' },
]
```

- [ ] **Step 3.4：Commit**

```bash
git add src/lib/cn.ts src/data/content.ts tests/cn.test.ts
git commit -m "feat: cn util + data/content.ts placeholder URLs and plan data"
```

---

## Phase 2 — i18n 三語字典與 Provider（Task 4-6）

### Task 4：messages.zh-hant.ts（型別 source、完整字串）

**Files:**
- Create: `src/i18n/messages.zh-hant.ts`

- [ ] **Step 4.1：建立 src/i18n/messages.zh-hant.ts**

```ts
export const zhHant = {
  nav: {
    plans:   '方案',
    demo:    'Demo',
    contact: '聯絡',
  },
  hero: {
    badge:        'AI 智能 ・ 創新 ・ 專業 ・ 服務',
    title:        'AI 人像工作室',
    subtitle:     '專業的 AI 人像生成與影片製作服務',
    description:  '透過先進的 LoRA 訓練技術與 AI 影片生成，為您打造獨一無二的數位人像作品',
    ctaPrimary:   '查看作品展示',
    ctaSecondary: '立即諮詢',
    scrollHint:   '向下滾動探索',
  },
  demo: {
    badge:    '作品展示',
    title:    'AI 生成作品範例',
    subtitle: '透過先進的 AI 技術，為您打造專業級的人像作品',
    tabs: {
      image: '圖片人像生成',
      video: '影片人像生成',
    },
    imageCardAlt: 'AI 生成人像示意圖',
    videoCard: {
      title1: '電影級人像動態',
      desc1:  '流暢自然的人像動態影片',
      title2: '動態表情生成',
      desc2:  '逼真的微笑與表情變化',
      playLabel: '點擊播放影片',
    },
    techBanner: {
      title:      'AI 影片人像生成',
      description: '透過先進的 AI 影片生成技術，我們可以將靜態人像轉換為流暢自然的動態影片。無論是微笑、眨眼、轉頭等動作，都能以電影級的品質呈現，適合用於社群媒體、數位分身、虛擬主播等多場景應用。',
    },
    pricingCta: '精選方案',
  },
  pricing: {
    badge:    '服務方案',
    title:    '選擇適合您的方案',
    subtitle: '專業的 AI 人像服務，滿足不同需求與預算',
    hottest:  '最熱門',
    ctaInquiry: '立即諮詢',
    basic: {
      name:        '基礎方案',
      tagline:     '適合個人嘗試體驗',
      deliverables: [
        '10 張 LoRA 訓練人像',
        '基礎風格選擇 (3 種)',
        '標準解析度輸出',
        '48 小時交付',
        '基礎修圖調整',
      ],
    },
    pro: {
      name:        '專業方案',
      tagline:     '最受歡迎的選擇',
      deliverables: [
        '30 張 LoRA 訓練人像',
        '專屬風格選擇 (10 種)',
        '高解析度輸出',
        '2 支 AI 動態影片 (3-5 秒)',
        '24 小時快速交付',
        '專業修圖調整',
        '專屬訓練模型保留',
      ],
    },
    enterprise: {
      name:        '企業方案',
      tagline:     '完整的專業服務',
      deliverables: [
        '100 張 LoRA 訓練人像',
        '全風格自由選擇 (無限制)',
        '超高解析度輸出',
        '5 支 AI 動態影片 (3-5 秒)',
        '12 小時極速交付',
        '頂級專業修圖',
        '永久模型保留',
        '商業授權使用',
        '一對一專屬服務',
      ],
    },
    priceLabel: 'NT$',
  },
  addons: {
    title:    '加購服務',
    subtitle: '根據您的需求，靈活地增加額外服務',
    extraVideo: {
      name: '額外 AI 影片',
      desc: '3-5 秒高品質人像動態影片',
      unit: '/ 支',
    },
    rushDelivery: {
      name: '加速交付',
      desc: '縮短至 6 小時內完成',
      unit: '/ 次',
    },
    extraTrainingPhotos: {
      name: '額外訓練照片',
      desc: '在現有方案基礎上增加照片數量',
      unit: '/ 張',
    },
  },
  finalCta: {
    title:       '不確定哪個方案適合您？',
    description: '歡迎透過 Telegram 與我們聯繫，我們將根據您的需求提供專業建議',
    button:      '免費諮詢',
  },
  footer: {
    tagline:        '專業的 AI 人像生成與影片製作服務，為您打造獨一無二的數位形象',
    contactTitle:   '聯絡我們',
    telegramButton: 'Telegram 諮詢',
    responseTime:   '回覆時間：通常 24 小時內',
    copyright:      '© 2026 AI 人像工作室. All rights reserved.',
  },
  scrollToTop: {
    label: '回到頂部',
  },
  languageSwitcher: {
    'zh-Hant': '繁中',
    'zh-Hans': '简中',
    'en':      'EN',
  },
} as const

export type Messages = typeof zhHant
```

- [ ] **Step 4.2：跑 typecheck 確認字典 shape 正確**

```bash
pnpm typecheck
```

Expected：no error。

- [ ] **Step 4.3：Commit**

```bash
git add src/i18n/messages.zh-hant.ts
git commit -m "feat: i18n zh-Hant dictionary (type source)"
```

---

### Task 5：LanguageProvider + useT hook + zh-Hans 與 en 字典

**Files:**
- Create: `src/i18n/messages.zh-hans.ts`
- Create: `src/i18n/messages.en.ts`
- Create: `src/i18n/LanguageProvider.tsx`
- Create: `src/i18n/useT.ts`
- Create: `tests/i18n.test.tsx`

- [ ] **Step 5.1：寫 i18n 測試先（TDD）**

`tests/i18n.test.tsx`：
```tsx
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { useT } from '@/i18n/useT'

const STORAGE_KEY = 'ai-portrait-studio-lang'

function Probe() {
  const { t, lang, setLang } = useT()
  return (
    <div>
      <span data-testid="title">{t.hero.title}</span>
      <span data-testid="lang">{lang}</span>
      <button data-testid="to-en" onClick={() => setLang('en')}>en</button>
      <button data-testid="to-hans" onClick={() => setLang('zh-Hans')}>hans</button>
    </div>
  )
}

describe('i18n', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = ''
  })

  it('defaults to zh-Hant title on first visit when navigator.language is zh-TW', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('title').textContent).toBe('AI 人像工作室')
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hant')
    expect(document.documentElement.lang).toBe('zh-Hant')
  })

  it('detects zh-Hans for navigator.language zh-CN', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hans')
  })

  it('detects en for navigator.language en-US', () => {
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('falls back to zh-Hant for unrecognized language', () => {
    Object.defineProperty(navigator, 'language', { value: 'ja-JP', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hant')
  })

  it('setLang switches dictionary and updates localStorage + html lang', async () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('title').textContent).toBe('AI 人像工作室')

    act(() => { screen.getByTestId('to-en').click() })
    expect(screen.getByTestId('title').textContent).toBe('AI Portrait Studio')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')

    act(() => { screen.getByTestId('to-hans').click() })
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hans')
    expect(document.documentElement.lang).toBe('zh-Hans')
  })

  it('reads from localStorage on next mount', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    localStorage.setItem(STORAGE_KEY, 'en')
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('useT outside provider throws', () => {
    expect(() => render(<Probe />)).toThrow(/LanguageProvider/)
  })
})
```

```bash
pnpm test i18n.test
```

Expected：FAIL（檔案還沒建立）。

- [ ] **Step 5.2：建立 src/i18n/LanguageProvider.tsx**

```tsx
import { createContext, useEffect, useState, type ReactNode } from 'react'
import { zhHant, type Messages } from './messages.zh-hant'
import { zhHans } from './messages.zh-hans'
import { en } from './messages.en'

export type Lang = 'zh-Hant' | 'zh-Hans' | 'en'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Messages }
export const LanguageCtx = createContext<Ctx | null>(null)

const STORAGE_KEY = 'ai-portrait-studio-lang'

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh-Hant'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'zh-Hant' || stored === 'zh-Hans' || stored === 'en') return stored
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
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])
  const t = DICTIONARY[lang]
  return <LanguageCtx.Provider value={{ lang, setLang, t }}>{children}</LanguageCtx.Provider>
}
```

- [ ] **Step 5.3：建立 src/i18n/useT.ts**

```ts
import { useContext } from 'react'
import { LanguageCtx } from './LanguageProvider'

export function useT() {
  const ctx = useContext(LanguageCtx)
  if (!ctx) throw new Error('useT must be used within <LanguageProvider>')
  return ctx
}
```

- [ ] **Step 5.4：建立 src/i18n/messages.zh-hans.ts**

```ts
import type { Messages } from './messages.zh-hant'

export const zhHans: Messages = {
  nav: {
    plans:   '方案',
    demo:    'Demo',
    contact: '联络',
  },
  hero: {
    badge:        'AI 智能 ・ 创新 ・ 专业 ・ 服务',
    title:        'AI 人像工作室',
    subtitle:     '专业的 AI 人像生成与视频制作服务',
    description:  '透过先进的 LoRA 训练技术与 AI 视频生成，为您打造独一无二的数位人像作品',
    ctaPrimary:   '查看作品展示',
    ctaSecondary: '立即咨询',
    scrollHint:   '向下滚动探索',
  },
  demo: {
    badge:    '作品展示',
    title:    'AI 生成作品范例',
    subtitle: '透过先进的 AI 技术，为您打造专业级的人像作品',
    tabs: {
      image: '图片人像生成',
      video: '视频人像生成',
    },
    imageCardAlt: 'AI 生成人像示意图',
    videoCard: {
      title1: '电影级人像动态',
      desc1:  '流畅自然的人像动态视频',
      title2: '动态表情生成',
      desc2:  '逼真的微笑与表情变化',
      playLabel: '点击播放视频',
    },
    techBanner: {
      title:      'AI 视频人像生成',
      description: '透过先进的 AI 视频生成技术，我们可以将静态人像转换为流畅自然的动态视频。无论是微笑、眨眼、转头等动作，都能以电影级的品质呈现，适合用于社群媒体、数位分身、虚拟主播等多场景应用。',
    },
    pricingCta: '精选方案',
  },
  pricing: {
    badge:    '服务方案',
    title:    '选择适合您的方案',
    subtitle: '专业的 AI 人像服务，满足不同需求与预算',
    hottest:  '最热门',
    ctaInquiry: '立即咨询',
    basic: {
      name:        '基础方案',
      tagline:     '适合个人尝试体验',
      deliverables: [
        '10 张 LoRA 训练人像',
        '基础风格选择 (3 种)',
        '标准解析度输出',
        '48 小时交付',
        '基础修图调整',
      ],
    },
    pro: {
      name:        '专业方案',
      tagline:     '最受欢迎的选择',
      deliverables: [
        '30 张 LoRA 训练人像',
        '专属风格选择 (10 种)',
        '高解析度输出',
        '2 支 AI 动态视频 (3-5 秒)',
        '24 小时快速交付',
        '专业修图调整',
        '专属训练模型保留',
      ],
    },
    enterprise: {
      name:        '企业方案',
      tagline:     '完整的专业服务',
      deliverables: [
        '100 张 LoRA 训练人像',
        '全风格自由选择 (无限制)',
        '超高解析度输出',
        '5 支 AI 动态视频 (3-5 秒)',
        '12 小时极速交付',
        '顶级专业修图',
        '永久模型保留',
        '商业授权使用',
        '一对一专属服务',
      ],
    },
    priceLabel: 'NT$',
  },
  addons: {
    title:    '加购服务',
    subtitle: '根据您的需求，灵活地增加额外服务',
    extraVideo: {
      name: '额外 AI 视频',
      desc: '3-5 秒高品质人像动态视频',
      unit: '/ 支',
    },
    rushDelivery: {
      name: '加速交付',
      desc: '缩短至 6 小时内完成',
      unit: '/ 次',
    },
    extraTrainingPhotos: {
      name: '额外训练照片',
      desc: '在现有方案基础上增加照片数量',
      unit: '/ 张',
    },
  },
  finalCta: {
    title:       '不确定哪个方案适合您？',
    description: '欢迎透过 Telegram 与我们联系，我们将根据您的需求提供专业建议',
    button:      '免费咨询',
  },
  footer: {
    tagline:        '专业的 AI 人像生成与视频制作服务，为您打造独一无二的数位形象',
    contactTitle:   '联络我们',
    telegramButton: 'Telegram 咨询',
    responseTime:   '回复时间：通常 24 小时内',
    copyright:      '© 2026 AI 人像工作室. All rights reserved.',
  },
  scrollToTop: {
    label: '回到顶部',
  },
  languageSwitcher: {
    'zh-Hant': '繁中',
    'zh-Hans': '简中',
    'en':      'EN',
  },
}
```

- [ ] **Step 5.5：建立 src/i18n/messages.en.ts**

```ts
import type { Messages } from './messages.zh-hant'

export const en: Messages = {
  nav: {
    plans:   'Plans',
    demo:    'Demo',
    contact: 'Contact',
  },
  hero: {
    badge:        'AI ・ Innovation ・ Professional ・ Service',
    title:        'AI Portrait Studio',
    subtitle:     'Professional AI portrait generation & video production',
    description:  'Custom LoRA training and AI video generation, crafted to create a one-of-a-kind digital persona for you',
    ctaPrimary:   'View Showcase',
    ctaSecondary: 'Contact Us',
    scrollHint:   'Scroll to explore',
  },
  demo: {
    badge:    'Showcase',
    title:    'AI Portrait Showcase',
    subtitle: 'Cutting-edge AI delivering professional-grade portraits',
    tabs: {
      image: 'Image Portraits',
      video: 'Video Portraits',
    },
    imageCardAlt: 'AI-generated portrait sample',
    videoCard: {
      title1: 'Cinematic Portrait Motion',
      desc1:  'Smooth, natural motion for portrait video',
      title2: 'Dynamic Expression',
      desc2:  'Realistic smiles and facial expressions',
      playLabel: 'Click to play',
    },
    techBanner: {
      title:      'AI Video Portrait Generation',
      description: 'With advanced AI video generation, we transform static portraits into smooth, natural motion video. Smile, blink, head turn — delivered with cinematic quality, ideal for social media, digital avatars, virtual hosts, and more.',
    },
    pricingCta: 'See Plans',
  },
  pricing: {
    badge:    'Plans',
    title:    'Choose the plan that fits',
    subtitle: 'Professional AI portrait services, tailored to your budget',
    hottest:  'Most Popular',
    ctaInquiry: 'Contact Us',
    basic: {
      name:        'Basic',
      tagline:     'Perfect for individuals',
      deliverables: [
        '10 LoRA-trained portraits',
        'Basic style selection (3 styles)',
        'Standard resolution output',
        '48-hour delivery',
        'Basic retouching',
      ],
    },
    pro: {
      name:        'Pro',
      tagline:     'Most popular choice',
      deliverables: [
        '30 LoRA-trained portraits',
        'Premium style selection (10 styles)',
        'High-resolution output',
        '2 AI motion videos (3-5 sec)',
        '24-hour fast delivery',
        'Professional retouching',
        'Dedicated trained model retained',
      ],
    },
    enterprise: {
      name:        'Enterprise',
      tagline:     'Complete professional service',
      deliverables: [
        '100 LoRA-trained portraits',
        'Unlimited style selection',
        'Ultra-high resolution output',
        '5 AI motion videos (3-5 sec)',
        '12-hour express delivery',
        'Top-tier retouching',
        'Permanent model retention',
        'Commercial license',
        'Dedicated 1-on-1 service',
      ],
    },
    priceLabel: 'NT$',
  },
  addons: {
    title:    'Add-ons',
    subtitle: 'Flexibly add extra services based on your needs',
    extraVideo: {
      name: 'Extra AI Video',
      desc: '3-5 sec high-quality portrait motion video',
      unit: '/ video',
    },
    rushDelivery: {
      name: 'Rush Delivery',
      desc: 'Shortened to 6-hour turnaround',
      unit: '/ order',
    },
    extraTrainingPhotos: {
      name: 'Extra Training Photos',
      desc: 'Add more photos to your existing plan',
      unit: '/ photo',
    },
  },
  finalCta: {
    title:       'Not sure which plan suits you?',
    description: 'Reach out on Telegram — we will provide tailored recommendations based on your needs',
    button:      'Free Consultation',
  },
  footer: {
    tagline:        'Professional AI portrait generation & video production. Building one-of-a-kind digital personas for you.',
    contactTitle:   'Contact Us',
    telegramButton: 'Telegram',
    responseTime:   'Response time: usually within 24 hours',
    copyright:      '© 2026 AI Portrait Studio. All rights reserved.',
  },
  scrollToTop: {
    label: 'Back to top',
  },
  languageSwitcher: {
    'zh-Hant': '繁中',
    'zh-Hans': '简中',
    'en':      'EN',
  },
}
```

- [ ] **Step 5.6：跑測試**

```bash
pnpm typecheck
pnpm test i18n.test
```

Expected：typecheck pass；7 個 i18n test pass。

- [ ] **Step 5.7：把 App.tsx 包進 LanguageProvider 確認 dev 可用**

`src/main.tsx` 修改：
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/noto-sans-tc/400.css'
import '@fontsource/noto-sans-tc/600.css'
import '@fontsource/noto-sans-tc/700.css'
import './styles/globals.css'
import { App } from './App'
import { LanguageProvider } from './i18n/LanguageProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
```

- [ ] **Step 5.8：Commit**

```bash
git add src/i18n/ src/main.tsx tests/i18n.test.tsx
git commit -m "feat: i18n LanguageProvider + zh-Hans / en dictionaries + 7 tests"
```

---

## Phase 3 — 共用元件（Task 6-9）

### Task 6：Badge + SectionHeader

**Files:**
- Create: `src/components/Badge.tsx`
- Create: `src/components/SectionHeader.tsx`
- Create: `tests/components/Badge.test.tsx`
- Create: `tests/components/SectionHeader.test.tsx`

- [ ] **Step 6.1：寫 Badge 測試**

`tests/components/Badge.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '@/components/Badge'

describe('Badge', () => {
  it('renders children with sparkle icon prefix', () => {
    const { container } = render(<Badge>AI 服務</Badge>)
    expect(screen.getByText(/AI 服務/)).toBeInTheDocument()
    // lucide-react Sparkles renders as <svg>
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
```

```bash
pnpm test Badge.test
```

Expected：FAIL。

- [ ] **Step 6.2：實作 src/components/Badge.tsx**

```tsx
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs',
        'border border-border-brand bg-brand-500/10 text-brand-300',
        'shadow-glow-md',
        className,
      )}
    >
      <Sparkles className="w-3 h-3" aria-hidden="true" />
      {children}
    </span>
  )
}
```

- [ ] **Step 6.3：跑 Badge 測試**

```bash
pnpm test Badge.test
```

Expected：2 test pass。

- [ ] **Step 6.4：寫 SectionHeader 測試**

`tests/components/SectionHeader.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionHeader } from '@/components/SectionHeader'

describe('SectionHeader', () => {
  it('renders badge, title, subtitle when all provided', () => {
    render(<SectionHeader badge="服務" title="選擇方案" subtitle="符合需求" />)
    expect(screen.getByText(/服務/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '選擇方案' })).toBeInTheDocument()
    expect(screen.getByText('符合需求')).toBeInTheDocument()
  })

  it('renders without badge when omitted', () => {
    render(<SectionHeader title="加購服務" subtitle="額外" />)
    expect(screen.getByRole('heading', { name: '加購服務' })).toBeInTheDocument()
  })
})
```

```bash
pnpm test SectionHeader.test
```

Expected：FAIL。

- [ ] **Step 6.5：實作 src/components/SectionHeader.tsx**

```tsx
import { Badge } from './Badge'

type Props = {
  badge?: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ badge, title, subtitle, className }: Props) {
  return (
    <div className={`text-center ${className ?? ''}`.trim()}>
      {badge && (
        <div className="mb-4">
          <Badge>{badge}</Badge>
        </div>
      )}
      <h2 className="text-3xl tablet:text-4xl desktop:text-5xl font-bold text-white mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-300 text-base tablet:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 6.6：跑測試 + commit**

```bash
pnpm test
git add src/components/Badge.tsx src/components/SectionHeader.tsx tests/components/
git commit -m "feat: Badge + SectionHeader components with tests"
```

---

### Task 7：TabSegment（含鍵盤 a11y）

**Files:**
- Create: `src/components/TabSegment.tsx`
- Create: `tests/components/TabSegment.test.tsx`

- [ ] **Step 7.1：寫 TabSegment 測試**

`tests/components/TabSegment.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TabSegment } from '@/components/TabSegment'
import { Image, Video } from 'lucide-react'

describe('TabSegment', () => {
  const tabs = [
    { id: 'image', label: '圖片', icon: <Image data-testid="i-image" /> },
    { id: 'video', label: '影片', icon: <Video data-testid="i-video" /> },
  ]

  it('renders both tabs with active state on selected', () => {
    render(<TabSegment tabs={tabs} value="image" onChange={() => {}} />)
    const imgBtn = screen.getByRole('tab', { name: /圖片/ })
    const vidBtn = screen.getByRole('tab', { name: /影片/ })
    expect(imgBtn).toHaveAttribute('aria-selected', 'true')
    expect(vidBtn).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange when clicking another tab', async () => {
    const onChange = vi.fn()
    render(<TabSegment tabs={tabs} value="image" onChange={onChange} />)
    await userEvent.click(screen.getByRole('tab', { name: /影片/ }))
    expect(onChange).toHaveBeenCalledWith('video')
  })

  it('supports keyboard navigation: ArrowRight / ArrowLeft', async () => {
    const onChange = vi.fn()
    render(<TabSegment tabs={tabs} value="image" onChange={onChange} />)
    const imgBtn = screen.getByRole('tab', { name: /圖片/ })
    imgBtn.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('video')
  })
})
```

```bash
pnpm test TabSegment.test
```

Expected：FAIL。

- [ ] **Step 7.2：實作 src/components/TabSegment.tsx**

```tsx
import { type ReactNode, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

export type Tab<T extends string> = { id: T; label: string; icon?: ReactNode }

type Props<T extends string> = {
  tabs: ReadonlyArray<Tab<T>>
  value: T
  onChange: (id: T) => void
  className?: string
}

export function TabSegment<T extends string>({ tabs, value, onChange, className }: Props<T>) {
  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      onChange(tabs[(currentIdx + 1) % tabs.length].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      onChange(tabs[(currentIdx - 1 + tabs.length) % tabs.length].id)
    }
  }

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex p-1 rounded-full glass shadow-glow-md',
        className,
      )}
    >
      {tabs.map((tab, idx) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKey(e, idx)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors',
              'min-h-[44px]',
              active
                ? 'bg-brand-500 text-white shadow-glow-md'
                : 'text-gray-300 hover:text-white hover:bg-surface-hover',
            )}
          >
            {tab.icon && <span className="w-4 h-4 inline-flex items-center">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 7.3：跑測試 + commit**

```bash
pnpm test TabSegment.test
git add src/components/TabSegment.tsx tests/components/TabSegment.test.tsx
git commit -m "feat: TabSegment with keyboard a11y + 3 tests"
```

---

### Task 8：PlanCard + AddOnCard

**Files:**
- Create: `src/components/PlanCard.tsx`
- Create: `src/components/AddOnCard.tsx`
- Create: `tests/components/PlanCard.test.tsx`

- [ ] **Step 8.1：寫 PlanCard 測試**

`tests/components/PlanCard.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PlanCard } from '@/components/PlanCard'

describe('PlanCard', () => {
  const base = {
    name: '專業方案',
    tagline: '最受歡迎的選擇',
    price: 2800,
    deliverables: ['A', 'B', 'C'],
    ctaLabel: '立即諮詢',
    ctaHref: 'https://t.me/test',
  }

  it('renders name, price, deliverables, cta', () => {
    render(<PlanCard {...base} />)
    expect(screen.getByText('專業方案')).toBeInTheDocument()
    expect(screen.getByText(/2,800/)).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '立即諮詢' })).toHaveAttribute('href', 'https://t.me/test')
  })

  it('shows "最熱門" badge when highlighted', () => {
    render(<PlanCard {...base} highlighted hottestLabel="最熱門" />)
    expect(screen.getByText('最熱門')).toBeInTheDocument()
  })

  it('does not show badge when not highlighted', () => {
    render(<PlanCard {...base} hottestLabel="最熱門" />)
    expect(screen.queryByText('最熱門')).not.toBeInTheDocument()
  })

  it('opens TG link in new tab with noopener', () => {
    render(<PlanCard {...base} />)
    const link = screen.getByRole('link', { name: '立即諮詢' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
```

```bash
pnpm test PlanCard.test
```

Expected：FAIL。

- [ ] **Step 8.2：實作 src/components/PlanCard.tsx**

```tsx
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = {
  name: string
  tagline?: string
  price: number
  priceLabel?: string         // 'NT$' 等
  deliverables: ReadonlyArray<string>
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  hottestLabel?: string       // '最熱門' / 'Most Popular'
  className?: string
}

export function PlanCard({
  name, tagline, price, priceLabel = 'NT$',
  deliverables, ctaLabel, ctaHref,
  highlighted, hottestLabel,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 flex flex-col h-full',
        highlighted
          ? 'border border-brand-500 bg-gradient-to-b from-brand-500/15 to-brand-500/5 shadow-glow-lg'
          : 'border border-border-subtle bg-surface',
        className,
      )}
    >
      {highlighted && hottestLabel && (
        <span
          className={cn(
            'absolute px-3 py-1 rounded-full text-xs font-semibold',
            'bg-brand-accent text-white shadow-glow-md',
            // desktop：右上角；mobile：卡頂置中
            'top-3 right-3 desktop:top-3 desktop:right-3',
            'mobile:top-[-12px] mobile:left-1/2 mobile:-translate-x-1/2 mobile:right-auto desktop:translate-x-0',
          )}
        >
          {hottestLabel}
        </span>
      )}
      <div className="text-gray-300 text-sm mb-1">{name}</div>
      {tagline && <div className="text-gray-400 text-xs mb-3">{tagline}</div>}
      <div className="text-3xl font-bold text-white mb-5">
        {priceLabel} {price.toLocaleString()}
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {deliverables.map((d) => (
          <li key={d} className="flex items-start gap-2 text-gray-300 text-sm">
            <Check className="w-4 h-4 text-brand-300 mt-0.5 flex-none" aria-hidden="true" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center justify-center w-full py-3 rounded-lg text-sm font-semibold min-h-[44px]',
          'transition-colors',
          highlighted
            ? 'bg-brand-500 text-white hover:bg-brand-400'
            : 'border border-border-subtle text-gray-200 hover:bg-surface-hover',
        )}
      >
        {ctaLabel}
      </a>
    </div>
  )
}
```

- [ ] **Step 8.3：實作 src/components/AddOnCard.tsx（純展示、無測試）**

```tsx
import { cn } from '@/lib/cn'

type Props = {
  name: string
  desc: string
  price: number
  unit: string
  priceLabel?: string
  className?: string
}

export function AddOnCard({ name, desc, price, unit, priceLabel = 'NT$', className }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 border border-border-subtle bg-surface',
        className,
      )}
    >
      <div className="text-white text-base font-medium mb-1">{name}</div>
      <div className="text-gray-400 text-xs mb-3">{desc}</div>
      <div className="text-brand-300 text-xl font-bold">
        {priceLabel} {price.toLocaleString()}{' '}
        <span className="text-gray-500 text-sm font-normal">{unit}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 8.4：跑測試 + commit**

```bash
pnpm test PlanCard.test
git add src/components/PlanCard.tsx src/components/AddOnCard.tsx tests/components/PlanCard.test.tsx
git commit -m "feat: PlanCard + AddOnCard with PlanCard tests"
```

---

### Task 9：DemoCard（影片卡含 poster + click-to-play）

**Files:**
- Create: `src/components/DemoCard.tsx`
- Create: `tests/components/DemoCard.test.tsx`

- [ ] **Step 9.1：寫測試**

`tests/components/DemoCard.test.tsx`：
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DemoCard } from '@/components/DemoCard'

describe('DemoCard', () => {
  describe('image variant', () => {
    it('renders an img with given src and alt', () => {
      render(<DemoCard variant="image" src="https://test.com/a.jpg" alt="人像 A" />)
      const img = screen.getByRole('img', { name: '人像 A' })
      expect(img).toHaveAttribute('src', 'https://test.com/a.jpg')
    })
  })

  describe('video variant', () => {
    it('renders poster image initially, no iframe', () => {
      render(
        <DemoCard
          variant="video"
          posterUrl="https://i.ytimg.com/vi/xxx/hqdefault.jpg"
          youtubeId="xxx"
          durationSec="3-5"
          title="電影級人像動態"
          desc="流暢自然"
          playLabel="點擊播放"
        />,
      )
      expect(screen.getByAltText(/電影級/)).toBeInTheDocument()
      expect(screen.queryByTitle(/youtube/i)).not.toBeInTheDocument()
      expect(screen.getByText('3-5 秒')).toBeInTheDocument()
    })

    it('clicking poster swaps in youtube nocookie iframe', () => {
      render(
        <DemoCard
          variant="video"
          posterUrl="https://i.ytimg.com/vi/xxx/hqdefault.jpg"
          youtubeId="xxx"
          durationSec="3-5"
          title="電影級人像動態"
          desc="流暢自然"
          playLabel="點擊播放"
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /點擊播放/ }))
      const iframe = screen.getByTitle(/電影級人像動態/) as HTMLIFrameElement
      expect(iframe.src).toMatch(/youtube-nocookie\.com\/embed\/xxx/)
    })
  })
})
```

```bash
pnpm test DemoCard.test
```

Expected：FAIL。

- [ ] **Step 9.2：實作 src/components/DemoCard.tsx**

```tsx
import { useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/cn'

type ImageProps = {
  variant: 'image'
  src: string
  alt: string
  className?: string
}

type VideoProps = {
  variant: 'video'
  posterUrl: string
  youtubeId: string
  durationSec: string
  title: string
  desc: string
  playLabel: string
  className?: string
}

type Props = ImageProps | VideoProps

export function DemoCard(props: Props) {
  if (props.variant === 'image') {
    const { src, alt, className } = props
    return (
      <div className={cn('rounded-xl overflow-hidden border border-border-subtle', className)}>
        <img src={src} alt={alt} className="w-full h-auto block aspect-square object-cover" loading="lazy" />
      </div>
    )
  }
  return <VideoDemoCard {...props} />
}

function VideoDemoCard({
  posterUrl, youtubeId, durationSec, title, desc, playLabel, className,
}: VideoProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={cn('rounded-xl overflow-hidden border border-border-subtle bg-bg-elevated', className)}>
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerated-2d-canvas; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={posterUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px]">
              {durationSec} 秒
            </span>
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={playLabel}
              className={cn(
                'absolute inset-0 flex items-center justify-center group',
                'min-h-[44px]',
              )}
            >
              <span className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center shadow-glow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white" fill="currentColor" />
              </span>
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="text-white font-medium mb-1">{title}</div>
        <div className="text-gray-400 text-sm">{desc}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 9.3：跑測試 + commit**

```bash
pnpm test DemoCard.test
git add src/components/DemoCard.tsx tests/components/DemoCard.test.tsx
git commit -m "feat: DemoCard image / video variants with poster + click-to-play"
```

---

## Phase 4 — Sections（Task 10-16）

### Task 10：Nav section（sticky + 三語切換 + desktop 直接 anchor / mobile + tablet 漢堡 drawer）

**Files:**
- Create: `src/sections/Nav.tsx`
- Create: `tests/sections/Nav.test.tsx`

- [ ] **Step 10.1：寫測試**

`tests/sections/Nav.test.tsx`：
```tsx
import { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { Nav } from '@/sections/Nav'
import { LanguageProvider } from '@/i18n/LanguageProvider'

function withProvider(node: ReactNode) {
  return <LanguageProvider>{node}</LanguageProvider>
}

describe('Nav', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders logo and language switcher always', () => {
    render(withProvider(<Nav />))
    expect(screen.getByText(/AI 人像工作室/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '繁中' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '简中' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
  })

  it('renders hamburger toggle button with proper aria', () => {
    render(withProvider(<Nav />))
    const toggle = screen.getByRole('button', { name: /開啟選單/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'nav-drawer')
  })

  it('drawer is collapsed by default (anchor links not in document)', () => {
    render(withProvider(<Nav />))
    expect(screen.queryByRole('link', { name: '方案' })).not.toBeInTheDocument()
  })

  it('opening hamburger reveals three anchor links', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: /開啟選單/ }))
    expect(screen.getByRole('link', { name: '方案' })).toHaveAttribute('href', '#pricing')
    expect(screen.getByRole('link', { name: 'Demo' })).toHaveAttribute('href', '#demo')
    expect(screen.getByRole('link', { name: '聯絡' })).toHaveAttribute('href', '#contact')
  })

  it('clicking an anchor closes the drawer', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: /開啟選單/ }))
    await userEvent.click(screen.getByRole('link', { name: '方案' }))
    expect(screen.queryByRole('link', { name: '方案' })).not.toBeInTheDocument()
  })

  it('switching language updates header text', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByText(/AI Portrait Studio/)).toBeInTheDocument()
  })
})
```

```bash
pnpm test Nav.test
```

Expected：FAIL。

- [ ] **Step 10.2：實作 src/sections/Nav.tsx**

```tsx
import { useState } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'
import { useT } from '@/i18n/useT'
import type { Lang } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/cn'

const LANGS: Lang[] = ['zh-Hant', 'zh-Hans', 'en']

export function Nav() {
  const { t, lang, setLang } = useT()
  const [open, setOpen] = useState(false)

  // 中文使用者「開啟選單」/ 英文「Open menu」— i18n 預設我們先寫死 aria label，使用者很少改 nav lang
  // 實際在 hamburger 上掛 aria-label 是 nav 控制按鈕；t 字典沒分專屬 key、用個簡單 fallback
  const openMenuLabel = lang === 'en' ? 'Open menu' : '開啟選單'
  const closeMenuLabel = lang === 'en' ? 'Close menu' : '關閉選單'

  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full',
        'bg-bg-base/80 backdrop-blur-card border-b border-border-subtle',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8 h-14 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 text-white font-semibold">
          <Sparkles className="w-4 h-4 text-brand-300" aria-hidden="true" />
          <span className="text-sm tablet:text-base">{t.hero.title}</span>
        </a>

        {/* Desktop: anchor 直接展開 */}
        <nav className="hidden desktop:flex items-center gap-6 text-gray-300 text-sm">
          <a href="#pricing" className="hover:text-white">{t.nav.plans}</a>
          <a href="#demo" className="hover:text-white">{t.nav.demo}</a>
          <a href="#contact" className="hover:text-white">{t.nav.contact}</a>
        </nav>

        <div className="flex items-center gap-2">
          {/* 三語切換（所有斷點皆可見） */}
          <div className="flex items-center gap-1 text-xs">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={cn(
                  'px-2 py-1 rounded min-w-[44px] min-h-[32px]',
                  lang === l ? 'text-white bg-surface' : 'text-gray-400 hover:text-white',
                )}
              >
                {t.languageSwitcher[l]}
              </button>
            ))}
          </div>

          {/* Hamburger toggle：mobile / tablet 顯示、desktop 隱藏 */}
          <button
            type="button"
            aria-label={open ? closeMenuLabel : openMenuLabel}
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen((o) => !o)}
            className="desktop:hidden inline-flex items-center justify-center w-11 h-11 rounded text-gray-300 hover:text-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer（mobile / tablet only、open 時展開） */}
      {open && (
        <nav
          id="nav-drawer"
          className="desktop:hidden border-t border-border-subtle bg-bg-elevated"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col text-gray-300 text-sm">
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="py-3 px-3 min-h-[44px] flex items-center hover:text-white border-b border-border-subtle"
            >
              {t.nav.plans}
            </a>
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="py-3 px-3 min-h-[44px] flex items-center hover:text-white border-b border-border-subtle"
            >
              {t.nav.demo}
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="py-3 px-3 min-h-[44px] flex items-center hover:text-white"
            >
              {t.nav.contact}
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
```

- [ ] **Step 10.3：跑測試 + commit**

```bash
pnpm test Nav.test
git add src/sections/Nav.tsx tests/sections/Nav.test.tsx
git commit -m "feat: Nav sticky + hamburger drawer (mobile/tablet) + desktop inline anchors + 3-lang switcher"
```

---

### Task 11：Hero section

**Files:**
- Create: `src/sections/Hero.tsx`
- Create: `tests/sections/Hero.test.tsx`

- [ ] **Step 11.1：寫測試**

`tests/sections/Hero.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Hero } from '@/sections/Hero'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Hero', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders title, subtitle, both CTAs, badge', () => {
    render(<LanguageProvider><Hero /></LanguageProvider>)
    expect(screen.getByRole('heading', { name: 'AI 人像工作室' })).toBeInTheDocument()
    expect(screen.getByText(/AI 智能/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '查看作品展示' })).toHaveAttribute('href', '#demo')
    expect(screen.getByRole('link', { name: '立即諮詢' })).toHaveAttribute('href', expect.stringMatching(/t\.me/))
  })
})
```

```bash
pnpm test Hero.test
```

Expected：FAIL。

- [ ] **Step 11.2：實作 src/sections/Hero.tsx**

```tsx
import { Send, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/Badge'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL } from '@/data/content'
import { cn } from '@/lib/cn'

export function Hero() {
  const { t } = useT()
  return (
    <section id="top" className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 tablet:py-28">
      {/* 背景 — 低調 gradient + 微弱光暈 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-bg-base via-bg-elevated to-bg-base"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(168,85,247,0.25), transparent 60%)',
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <Badge className="mb-6">
          {t.hero.badge}
        </Badge>
        <h1 className="text-4xl tablet:text-6xl desktop:text-7xl font-bold text-white mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base tablet:text-xl text-gray-300 mb-2">{t.hero.subtitle}</p>
        <p className="text-sm tablet:text-base text-gray-400 mb-8 max-w-2xl mx-auto">
          {t.hero.description}
        </p>
        <div className="flex flex-col mobile:flex-row items-center justify-center gap-3">
          <a
            href="#demo"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'bg-brand-500 hover:bg-brand-400 text-white font-semibold',
              'transition-colors shadow-glow-md min-h-[44px]',
            )}
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'border border-border-subtle text-white hover:bg-surface-hover',
              'transition-colors min-h-[44px]',
            )}
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.hero.ctaSecondary}
          </a>
        </div>
        <ChevronDown className="w-6 h-6 text-gray-500 mx-auto mt-10 animate-bounce" aria-label={t.hero.scrollHint} />
      </div>
    </section>
  )
}
```

- [ ] **Step 11.3：跑測試 + commit**

```bash
pnpm test Hero.test
git add src/sections/Hero.tsx tests/sections/Hero.test.tsx
git commit -m "feat: Hero section with badge + dual CTA + scroll hint"
```

---

### Task 12：Demo section（tab 切換 + 圖片 / 影片 grid + tech banner）

**Files:**
- Create: `src/sections/Demo.tsx`
- Create: `tests/sections/Demo.test.tsx`

- [ ] **Step 12.1：寫測試**

`tests/sections/Demo.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { Demo } from '@/sections/Demo'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Demo', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('defaults to image tab — images visible, video grid hidden', () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    expect(screen.getByRole('tab', { name: /圖片人像生成/ })).toHaveAttribute('aria-selected', 'true')
    // 至少看到 4 張 image alt（zh-Hant: AI 生成人像示意圖）
    expect(screen.getAllByAltText(/AI 生成人像示意圖/).length).toBeGreaterThan(0)
  })

  it('clicking video tab switches grid', async () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    await userEvent.click(screen.getByRole('tab', { name: /影片人像生成/ }))
    expect(screen.getByRole('tab', { name: /影片人像生成/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('電影級人像動態')).toBeInTheDocument()
  })

  it('renders tech banner', () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    expect(screen.getByText('AI 影片人像生成')).toBeInTheDocument()
    expect(screen.getByText(/我們可以將靜態人像/)).toBeInTheDocument()
  })
})
```

```bash
pnpm test Demo.test
```

Expected：FAIL。

- [ ] **Step 12.2：實作 src/sections/Demo.tsx**

```tsx
import { useState } from 'react'
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { TabSegment } from '@/components/TabSegment'
import { DemoCard } from '@/components/DemoCard'
import { useT } from '@/i18n/useT'
import { DEMO_IMAGES, DEMO_VIDEOS } from '@/data/content'

type TabId = 'image' | 'video'

export function Demo() {
  const { t } = useT()
  const [tab, setTab] = useState<TabId>('image')

  const tabs = [
    { id: 'image' as const, label: t.demo.tabs.image, icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'video' as const, label: t.demo.tabs.video, icon: <VideoIcon className="w-4 h-4" /> },
  ]

  return (
    <section id="demo" className="px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto">
        <SectionHeader badge={t.demo.badge} title={t.demo.title} subtitle={t.demo.subtitle} />
        <div className="flex justify-center my-8">
          <TabSegment tabs={tabs} value={tab} onChange={setTab} />
        </div>

        {tab === 'image' ? (
          <div className="grid grid-cols-1 mobile:grid-cols-2 desktop:grid-cols-3 gap-4">
            {DEMO_IMAGES.map((img, i) => (
              <DemoCard key={i} variant="image" src={img.src} alt={t.demo.imageCardAlt} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
            <DemoCard
              variant="video"
              posterUrl={DEMO_VIDEOS[0].posterUrl}
              youtubeId={DEMO_VIDEOS[0].youtubeId}
              durationSec={DEMO_VIDEOS[0].durationSec}
              title={t.demo.videoCard.title1}
              desc={t.demo.videoCard.desc1}
              playLabel={t.demo.videoCard.playLabel}
            />
            <DemoCard
              variant="video"
              posterUrl={DEMO_VIDEOS[1].posterUrl}
              youtubeId={DEMO_VIDEOS[1].youtubeId}
              durationSec={DEMO_VIDEOS[1].durationSec}
              title={t.demo.videoCard.title2}
              desc={t.demo.videoCard.desc2}
              playLabel={t.demo.videoCard.playLabel}
            />
          </div>
        )}

        {/* Tech explainer banner */}
        <div className="mt-10 rounded-xl p-5 tablet:p-6 border border-border-brand bg-brand-500/10 shadow-glow-md">
          <div className="flex items-center gap-2 text-white font-medium mb-2">
            <VideoIcon className="w-4 h-4 text-brand-300" aria-hidden="true" />
            {t.demo.techBanner.title}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t.demo.techBanner.description}
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 12.3：跑測試 + commit**

```bash
pnpm test Demo.test
git add src/sections/Demo.tsx tests/sections/Demo.test.tsx
git commit -m "feat: Demo section with tab segment + image/video grid + tech banner"
```

---

### Task 13：Pricing section

**Files:**
- Create: `src/sections/Pricing.tsx`
- Create: `tests/sections/Pricing.test.tsx`

- [ ] **Step 13.1：寫測試**

`tests/sections/Pricing.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Pricing } from '@/sections/Pricing'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Pricing', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders three plans with names, prices, ctas', () => {
    render(<LanguageProvider><Pricing /></LanguageProvider>)
    expect(screen.getByText('基礎方案')).toBeInTheDocument()
    expect(screen.getByText('專業方案')).toBeInTheDocument()
    expect(screen.getByText('企業方案')).toBeInTheDocument()
    expect(screen.getByText(/1,200/)).toBeInTheDocument()
    expect(screen.getByText(/2,800/)).toBeInTheDocument()
    expect(screen.getByText(/5,800/)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: '立即諮詢' })).toHaveLength(3)
  })

  it('only the pro plan shows the hottest badge', () => {
    render(<LanguageProvider><Pricing /></LanguageProvider>)
    expect(screen.getAllByText('最熱門')).toHaveLength(1)
  })
})
```

```bash
pnpm test Pricing.test
```

Expected：FAIL。

- [ ] **Step 13.2：實作 src/sections/Pricing.tsx**

```tsx
import { SectionHeader } from '@/components/SectionHeader'
import { PlanCard } from '@/components/PlanCard'
import { useT } from '@/i18n/useT'
import { PLAN_PRICES, PLAN_HIGHLIGHTED, TELEGRAM_URL } from '@/data/content'

export function Pricing() {
  const { t } = useT()
  return (
    <section id="pricing" className="px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto">
        <SectionHeader badge={t.pricing.badge} title={t.pricing.title} subtitle={t.pricing.subtitle} />
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8 mt-10">
          <PlanCard
            name={t.pricing.basic.name}
            tagline={t.pricing.basic.tagline}
            price={PLAN_PRICES.basic}
            priceLabel={t.pricing.priceLabel}
            deliverables={t.pricing.basic.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'basic'}
            hottestLabel={t.pricing.hottest}
          />
          <PlanCard
            name={t.pricing.pro.name}
            tagline={t.pricing.pro.tagline}
            price={PLAN_PRICES.pro}
            priceLabel={t.pricing.priceLabel}
            deliverables={t.pricing.pro.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'pro'}
            hottestLabel={t.pricing.hottest}
          />
          <PlanCard
            name={t.pricing.enterprise.name}
            tagline={t.pricing.enterprise.tagline}
            price={PLAN_PRICES.enterprise}
            priceLabel={t.pricing.priceLabel}
            deliverables={t.pricing.enterprise.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'enterprise'}
            hottestLabel={t.pricing.hottest}
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 13.3：跑測試 + commit**

```bash
pnpm test Pricing.test
git add src/sections/Pricing.tsx tests/sections/Pricing.test.tsx
git commit -m "feat: Pricing section with 3 plan cards"
```

---

### Task 14：AddOns section

**Files:**
- Create: `src/sections/AddOns.tsx`

- [ ] **Step 14.1：實作 src/sections/AddOns.tsx（純展示、不寫獨立測試）**

```tsx
import { SectionHeader } from '@/components/SectionHeader'
import { AddOnCard } from '@/components/AddOnCard'
import { useT } from '@/i18n/useT'
import { ADDONS } from '@/data/content'

export function AddOns() {
  const { t } = useT()
  // map key → i18n bundle
  const i18nByKey = {
    extraVideo:           t.addons.extraVideo,
    rushDelivery:         t.addons.rushDelivery,
    extraTrainingPhotos:  t.addons.extraTrainingPhotos,
  } as const

  return (
    <section className="px-4 py-12 tablet:py-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={t.addons.title} subtitle={t.addons.subtitle} />
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 mt-8">
          {ADDONS.map((a) => {
            const i = i18nByKey[a.key]
            return (
              <AddOnCard
                key={a.key}
                name={i.name}
                desc={i.desc}
                price={a.price}
                unit={i.unit}
                priceLabel={t.pricing.priceLabel}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 14.2：Commit（沒有測試、smoke render 在 Task 19 整體驗證）**

```bash
git add src/sections/AddOns.tsx
git commit -m "feat: AddOns section with 3 add-on cards"
```

---

### Task 15：FinalCTA section（紫色漸層邊框框）

**Files:**
- Create: `src/sections/FinalCTA.tsx`
- Create: `tests/sections/FinalCTA.test.tsx`

- [ ] **Step 15.1：寫測試**

`tests/sections/FinalCTA.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { FinalCTA } from '@/sections/FinalCTA'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('FinalCTA', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders the persuasion title, description, telegram CTA', () => {
    render(<LanguageProvider><FinalCTA /></LanguageProvider>)
    expect(screen.getByText('不確定哪個方案適合您？')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /免費諮詢/ })
    expect(link).toHaveAttribute('href', expect.stringMatching(/t\.me/))
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
```

```bash
pnpm test FinalCTA.test
```

Expected：FAIL。

- [ ] **Step 15.2：實作 src/sections/FinalCTA.tsx**

```tsx
import { Sparkles } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL } from '@/data/content'

export function FinalCTA() {
  const { t } = useT()
  return (
    <section id="contact" className="px-4 py-12 tablet:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="glow-border-gradient shadow-glow-xl">
          <div className="p-8 tablet:p-10 text-center">
            <h3 className="text-2xl tablet:text-3xl font-bold text-white mb-3">
              {t.finalCta.title}
            </h3>
            <p className="text-gray-300 mb-6">
              {t.finalCta.description}
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors shadow-glow-md min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              {t.finalCta.button}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 15.3：跑測試 + commit**

```bash
pnpm test FinalCTA.test
git add src/sections/FinalCTA.tsx tests/sections/FinalCTA.test.tsx
git commit -m "feat: FinalCTA section with gradient border + TG button"
```

---

### Task 16：Footer section

**Files:**
- Create: `src/sections/Footer.tsx`
- Create: `tests/sections/Footer.test.tsx`

- [ ] **Step 16.1：寫測試**

`tests/sections/Footer.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Footer } from '@/sections/Footer'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Footer', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders logo, tagline, telegram cta, response time, copyright', () => {
    render(<LanguageProvider><Footer /></LanguageProvider>)
    expect(screen.getByText(/AI 人像工作室/)).toBeInTheDocument()
    expect(screen.getByText(/數位形象/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Telegram/ })).toHaveAttribute('href', expect.stringMatching(/t\.me/))
    expect(screen.getByText(/24 小時內/)).toBeInTheDocument()
    expect(screen.getByText(/© 2026/)).toBeInTheDocument()
  })

  it('does NOT render terms of service or privacy policy links', () => {
    render(<LanguageProvider><Footer /></LanguageProvider>)
    expect(screen.queryByText(/服務條款/)).not.toBeInTheDocument()
    expect(screen.queryByText(/隱私政策/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Privacy Policy/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Terms/)).not.toBeInTheDocument()
  })
})
```

```bash
pnpm test Footer.test
```

Expected：FAIL。

- [ ] **Step 16.2：實作 src/sections/Footer.tsx**

```tsx
import { Sparkles, Send } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL, TELEGRAM_HANDLE } from '@/data/content'

export function Footer() {
  const { t } = useT()
  return (
    <footer className="px-4 pt-12 pb-6 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-white font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-brand-300" aria-hidden="true" />
          {t.hero.title}
        </div>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">{t.footer.tagline}</p>

        <div className="mb-8">
          <div className="text-gray-300 text-sm mb-3">{t.footer.contactTitle}</div>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-colors min-h-[44px]"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.footer.telegramButton}
          </a>
          <div className="text-gray-500 text-xs mt-3">
            {t.footer.responseTime}
            <span className="ml-2 text-gray-600">{TELEGRAM_HANDLE}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-border-subtle text-gray-500 text-xs">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 16.3：跑測試 + commit**

```bash
pnpm test Footer.test
git add src/sections/Footer.tsx tests/sections/Footer.test.tsx
git commit -m "feat: Footer with TG CTA + response time, no legal links"
```

---

## Phase 5 — 整合（Task 17-19）

### Task 17：ScrollToTop（IntersectionObserver 控制顯示）

**Files:**
- Create: `src/sections/ScrollToTop.tsx`
- Create: `tests/sections/ScrollToTop.test.tsx`

- [ ] **Step 17.1：寫測試**

`tests/sections/ScrollToTop.test.tsx`：
```tsx
import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ScrollToTop } from '@/sections/ScrollToTop'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('ScrollToTop', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
  })

  it('hidden when scrollY is small', () => {
    render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    expect(screen.queryByRole('button', { name: '回到頂部' })).not.toBeInTheDocument()
  })

  it('visible when scrollY > 600 (past hero)', () => {
    render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 800, configurable: true, writable: true })
      fireEvent.scroll(window)
    })
    expect(screen.getByRole('button', { name: '回到頂部' })).toBeInTheDocument()
  })

  it('clicking scrolls to top', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })
    render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 800, configurable: true, writable: true })
      fireEvent.scroll(window)
    })
    fireEvent.click(screen.getByRole('button', { name: '回到頂部' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
```

```bash
pnpm test ScrollToTop.test
```

Expected：FAIL。

- [ ] **Step 17.2：實作 src/sections/ScrollToTop.tsx**

```tsx
import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { cn } from '@/lib/cn'

const SHOW_THRESHOLD_PX = 600

export function ScrollToTop() {
  const { t } = useT()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD_PX)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label={t.scrollToTop.label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed right-4 bottom-4 z-40',
        'w-11 h-11 rounded-full bg-brand-500 hover:bg-brand-400',
        'shadow-glow-lg transition-colors',
        'flex items-center justify-center',
      )}
    >
      <ChevronUp className="w-5 h-5 text-white" aria-hidden="true" />
    </button>
  )
}
```

- [ ] **Step 17.3：跑測試 + commit**

```bash
pnpm test ScrollToTop.test
git add src/sections/ScrollToTop.tsx tests/sections/ScrollToTop.test.tsx
git commit -m "feat: ScrollToTop floating button with scroll listener + 3 tests"
```

---

### Task 18：App.tsx 組裝所有 section

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 18.0：刪除 Task 1.13 的 scaffold smoke test（內容已過時）**

```bash
rm tests/scaffold.test.tsx
```

- [ ] **Step 18.1：更新 src/App.tsx**

```tsx
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Demo } from './sections/Demo'
import { Pricing } from './sections/Pricing'
import { AddOns } from './sections/AddOns'
import { FinalCTA } from './sections/FinalCTA'
import { Footer } from './sections/Footer'
import { ScrollToTop } from './sections/ScrollToTop'

export function App() {
  return (
    <div className="min-h-screen bg-bg-base text-white">
      <Nav />
      <main>
        <Hero />
        <Demo />
        <Pricing />
        <AddOns />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
```

- [ ] **Step 18.2：跑 dev server 手動驗證**

```bash
pnpm dev
```

打開瀏覽器 → 應該看到完整的 6 section + Nav + ScrollToTop 頁面：Nav → Hero → Demo → Pricing → AddOns → FinalCTA → Footer，scroll 過 hero 後右下角出現紫色 ↑ 按鈕。檢查：
- 三語切換 [繁中 / 简中 / EN] 點擊後內容變
- mobile / tablet 寬度（Chrome DevTools 切到 425 / 768）右上角漢堡按鈕點開展開三個 anchor、點 anchor 後 drawer 自動收起
- desktop 寬度（1024+）nav 直接顯示三個 anchor
- Demo tab 點圖片 / 影片切換 grid
- Pricing 中卡有「最熱門」標籤
- ScrollToTop scroll 過 hero 後出現、點擊回頂部

Ctrl-C 關閉。

- [ ] **Step 18.3：跑 typecheck + 全測試**

```bash
pnpm typecheck
pnpm test
pnpm lint
```

Expected：全 pass、無 error / no warning。

- [ ] **Step 18.4：Commit**

```bash
git add -A
git commit -m "feat: assemble all sections in App.tsx (remove obsolete scaffold smoke test)"
```

---

### Task 19：sections smoke render 整合測試 + a11y 抽查

**Files:**
- Create: `tests/sections.smoke.test.tsx`

- [ ] **Step 19.1：寫整合 smoke 測試**

`tests/sections.smoke.test.tsx`：
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { App } from '@/App'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('App smoke', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders all sections without crashing', () => {
    render(<LanguageProvider><App /></LanguageProvider>)
    expect(screen.getAllByRole('heading')).not.toHaveLength(0)
    // 各 section 標誌性文字
    expect(screen.getAllByText(/AI 人像工作室/).length).toBeGreaterThan(0)
    expect(screen.getByText('AI 生成作品範例')).toBeInTheDocument()
    expect(screen.getByText('選擇適合您的方案')).toBeInTheDocument()
    expect(screen.getByText('加購服務')).toBeInTheDocument()
    expect(screen.getByText('不確定哪個方案適合您？')).toBeInTheDocument()
    expect(screen.getByText(/© 2026/)).toBeInTheDocument()
  })

  it('renders with zh-Hans dictionary', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    render(<LanguageProvider><App /></LanguageProvider>)
    expect(screen.getByText('AI 生成作品范例')).toBeInTheDocument()
    expect(screen.getByText('选择适合您的方案')).toBeInTheDocument()
    expect(screen.getByText('加购服务')).toBeInTheDocument()
  })

  it('renders with en dictionary', () => {
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true })
    render(<LanguageProvider><App /></LanguageProvider>)
    expect(screen.getByText('AI Portrait Showcase')).toBeInTheDocument()
    expect(screen.getByText('Choose the plan that fits')).toBeInTheDocument()
    expect(screen.getByText('Add-ons')).toBeInTheDocument()
  })

  it('all TG links open in new tab with noopener', () => {
    render(<LanguageProvider><App /></LanguageProvider>)
    const tgLinks = screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.includes('t.me'))
    expect(tgLinks.length).toBeGreaterThanOrEqual(3)  // hero secondary CTA + pricing 3 + finalCTA + footer
    for (const link of tgLinks) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
```

- [ ] **Step 19.2：跑測試**

```bash
pnpm test
```

Expected：全 pass。如果 a11y 抽查失敗（例如某 CTA 漏了 target=\_blank），補回去後再跑。

- [ ] **Step 19.3：Commit**

```bash
git add tests/sections.smoke.test.tsx
git commit -m "test: app smoke tests covering all sections in 3 languages + TG link safety"
```

---

## Phase 6 — 部署（Task 20-21）

### Task 20：GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 20.1：建立 deploy workflow**

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

- [ ] **Step 20.2：本地 build 驗證**

```bash
pnpm build
```

Expected：產生 `dist/` 目錄、包含 `index.html` + assets；無錯誤。

```bash
pnpm preview
```

打開 `http://localhost:4173/ai-portrait-studio-site/`，視覺與 dev server 一致。Ctrl-C 關閉。

- [ ] **Step 20.3：Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: GitHub Pages deploy workflow with lint + typecheck + test"
```

---

### Task 21：README + 首次 push 到 GitHub Pages

**Files:**
- Create: `README.md`

- [ ] **Step 21.1：建立 README.md**

```markdown
# AI Portrait Studio Site

一頁式形象 landing site for AI 人像工作室。

## Tech

- React 19 + TypeScript + Vite + Tailwind 3
- 中英 / 簡繁體三語（自寫 LanguageProvider Context）
- Deploy: GitHub Pages

## Local

```bash
pnpm install
pnpm dev          # localhost:5173/ai-portrait-studio-site/
pnpm test         # vitest
pnpm typecheck
pnpm lint
pnpm build        # 產出 dist/
pnpm preview      # 預覽 dist/（與 prod 行為一致）
```

## Deploy

每次 push 到 `main` 自動觸發 `.github/workflows/deploy.yml`：lint → typecheck → test → build → upload artifact → deploy to GitHub Pages。

首次部署設定：
1. GitHub repo Settings → Pages → Source: `GitHub Actions`
2. Settings → Actions → General → Workflow permissions: `Read and write permissions`

## Tailwind breakpoints（custom）

本專案改了 Tailwind 預設 `sm/md/lg/2xl`：

| Token | Min width | 用途 |
|---|---|---|
| `mobile` | 425px | 手機 |
| `tablet` | 768px | 平板 |
| `desktop` | 1024px | 桌面 |
| `4k` | 2560px | 大螢幕 |

寫 class 一律用上面 4 個前綴、不用 `sm:`/`md:` 等預設名。

## 素材替換（上線前）

- `TELEGRAM_HANDLE`、`TELEGRAM_URL`：`src/data/content.ts`
- `DEMO_IMAGES` / `DEMO_VIDEOS`：同檔案
- 方案文案：`src/i18n/messages.{zh-hant,zh-hans,en}.ts`

## Spec

`docs/superpowers/specs/2026-05-21-landing-site-design.md`
```

- [ ] **Step 21.2：Commit README**

```bash
git add README.md
git commit -m "docs: README with local dev + deploy + asset replacement"
```

- [ ] **Step 21.3：建立 GitHub remote 並 push**

leadi 手動執行（plan 之外）：

```bash
# 1. 在 github.com 建立 public repo `ai-portrait-studio-site`（不要 init README / .gitignore）
# 2. 設定 remote
git remote add origin https://github.com/<leadi-username>/ai-portrait-studio-site.git
git push -u origin main
```

push 後 GH Actions 自動跑 deploy；完成後 site 在 `https://<leadi-username>.github.io/ai-portrait-studio-site/`。

- [ ] **Step 21.4：在 GitHub repo 設定 Pages source**

GitHub UI 操作：
- Settings → Pages → Source: 選 `GitHub Actions`
- Settings → Actions → General → Workflow permissions: 改 `Read and write permissions`

- [ ] **Step 21.5：訪問部署網址做最終 manual smoke test**

訪問 `https://<leadi-username>.github.io/ai-portrait-studio-site/`，檢查：

1. ✅ Hero badge / 大標 / 雙 CTA 都在
2. ✅ 三語切換點擊正常（[繁中 / 简中 / EN]）
3. ✅ Demo tab 切換正常、影片 click-to-play
4. ✅ Pricing 三卡正常 + 中卡「最熱門」標籤
5. ✅ AddOns 三卡正常
6. ✅ Final CTA 紫框 + Telegram 按鈕點擊開新 tab
7. ✅ Footer Telegram 按鈕點擊開新 tab、無服務條款 / 隱私連結
8. ✅ Scroll-to-top 按鈕 scroll 過 hero 後出現
9. ✅ Mobile (Chrome DevTools 425 寬度) 不破版：Nav 漢堡按鈕 + drawer 可開合、Pricing 卡 vertical stack、中卡「最熱門」標籤改卡頂置中
10. ✅ Tablet (768)、Desktop (1024)、4K (2560 用瀏覽器 zoom 模擬) 各斷點佈局正常

任一失敗 → 開 fix issue 後續處理。

- [ ] **Step 21.6：Commit deploy 驗收筆記（可選）**

如果 Task 21.5 有發現需要修的小 bug，補 commit 後 push、自動觸發新一輪 deploy。

---

## 驗收標準

整個 plan 完成後，以下全部 pass：

1. `pnpm lint` ✓ 0 error / 0 warning
2. `pnpm typecheck` ✓ 0 error
3. `pnpm test` ✓ 全部 test pass（i18n / theme / cn / 8 個 components+sections / smoke）
4. `pnpm build` ✓ 0 error / dist/ 完整
5. GH Actions deploy ✓ workflow 跑完無 error
6. Manual smoke test（Task 21.5）✓ 10 點全 pass

---

## Open questions（plan 結束時若仍未解、由 leadi 上線前處理）

1. **GitHub username** — Task 21.3 需要
2. **Telegram handle 真實值** — `src/data/content.ts` 的 `TELEGRAM_HANDLE` 替換
3. **demo 素材** — 真實圖片 URL（CF Images / imgur）+ 真實影片 YouTube ID
4. **方案數字 / deliverables** — `src/i18n/messages.{zh-hant,zh-hans,en}.ts` 是 placeholder 還是最終版本？需要 leadi 確認

這 4 點在 plan 執行階段都用 placeholder 完成；上線前 leadi 替換真實值後 push 自動 redeploy。

---

## 附錄：Codex review v2 採納紀錄（2026-05-21）

Codex 對 plan v1 review，使用者裁決後採納項目：

| Codex 意見 | 處理 |
|---|---|
| §1.2.1 Hero 視覺承諾 | **駁回**（使用者裁決保持現狀、參考圖 Hero 也只 gradient + 文案） |
| §3 Demo image 4 卡 vs spec 2-3 | 採納、改 3 卡 |
| §5 Nav mobile/tablet 漢堡 | **採納、Task 10 大改**（漢堡 + drawer + aria-expanded + 點 anchor 自動 close） |
| §5 AddOns tablet 3 欄 vs spec 2 欄 | 採納、改 `tablet:grid-cols-2 desktop:grid-cols-3` |
| Task 1 vite.config.ts test 認不到 | 採納、改用 `vitest/config` 的 `defineConfig` |
| Task 10 test 用 React.ReactNode 漏 import | 採納、改 `import { type ReactNode } from 'react'` |
| Task 1.13 scaffold test 在 Task 18 整合後過時 | 採納、Task 18.0 加 step 刪 scaffold.test.tsx |
| Plan 序言 Vite 版本口徑 | 採納、序言改 Vite 8 |
| Task 3 YouTube `dQw4w9WgXcQ`（Rickroll）placeholder 風險 | 採納、改 `M7lc1UVf-VE`（YouTube Developers 公開教學） |
| Task 2 theme test 不會 fail | 採納、刪 theme test、改 Task 18.2 dev server 手動驗證 |
| Task 10 Nav test multiple match | 採納漢堡後自動消失（只一組 anchor、不再 desktop + mobile 雙存在） |
| Task 12 `bg-brand-500/8` 不是 Tailwind 內建 opacity | 採納、改 `bg-brand-500/10` |
| Task 20 workflow 缺 configure-pages step | 採納、加 `actions/configure-pages@v5` |
| Badge / SectionHeader 測試 YAGNI | 部分採納、刪減低價值 assert |
| Manual smoke list 漏 ScrollToTop | 採納、Task 18.2 補進 smoke checklist |
| cn 物件 flatten 過度 | 駁回（5 行不算重、未來性夠） |

