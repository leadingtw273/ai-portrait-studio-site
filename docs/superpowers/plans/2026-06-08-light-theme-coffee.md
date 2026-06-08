# 亮色系 × 咖啡色 簡約專業改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **本專案規範**：實作由 Agent subagent 內 `codex exec --sandbox workspace-write`（**前景同步**）撰寫，主對話 orchestration / 驗證。

**Goal:** 整站視覺從深紫科技風改為亮色暖白 + 咖啡 primary + 襯線大標 + 極淺紋理背景的簡約專業風，並建立 CSS 變數 design token 架構（預留暗色）。

**Architecture:** 引入 RGB channel CSS 變數 token（`:root`）+ Tailwind `rgb(var(--x)/<alpha-value>)` 語義色，先在 Task 1 一次換掉 token 基礎（含字體/陰影/body/index.html），再逐組把 ~12 個元件的 literal class 換成語義 class。每個 commit `typecheck/lint/test` 全綠（遷移中途視覺暫時不一致屬正常，分支未部署）。

**Tech Stack:** React 19 + TS + Vite + Tailwind 3（JIT、`<alpha-value>` 語法）+ @fontsource + Vitest。

**參考 spec：** `docs/superpowers/specs/2026-06-08-light-theme-coffee-design.md`（v2，codex review 完）

---

## File Structure

| 檔案 | 動作 | Task |
|---|---|---|
| `tailwind.config.ts` | colors→channel語義 / boxShadow soft / serif / 移除紫 | 1 |
| `src/styles/globals.css` | channel token / body / focus / ::selection / glass·glow-border 重定義 | 1 |
| `package.json` | + `@fontsource/noto-serif-tc` | 1 |
| `src/main.tsx` | import serif css | 1 |
| `tests/main.test.tsx` | + serif mock | 1 |
| `index.html` | body class 亮色 | 1 |
| `src/assets/bg-texture.png` | 新增（複製使用者圖） | 2 |
| `src/App.tsx` | 移除 overlay / 換背景圖 / 外層色 | 2 |
| `src/sections/Hero.tsx` | 移除紫 radial / serif 大標 / 語義色 | 2 |
| `src/sections/Nav.tsx` | 亮色 nav / 語義色 | 2 |
| `src/components/SectionHeader.tsx` | serif 標題 / 語義色 | 3 |
| `src/components/Badge.tsx` | 咖啡 badge | 3 |
| `src/sections/Demo.tsx` | tech banner / 箭頭 / AI tag | 3 |
| `src/components/DemoCard.tsx` | 卡框 / 媒體例外 / 內文色 | 3 |
| `src/components/TabSegment.tsx` | glass / 指示器 / tab 色 | 3 |
| `src/components/AudienceCard.tsx` | 全卡語義色 | 4 |
| `src/sections/FinalCTA.tsx` | 咖啡細框 / serif / button | 4 |
| `src/sections/Footer.tsx` | 語義色 / TG 按鈕咖啡化 / QR 白底保留 | 4 |
| `src/sections/ScrollToTop.tsx` | 咖啡浮鈕 | 4 |

> **TDD 說明**：本案為純視覺/CSS 主題改版，無新增邏輯可單元測試。每個 task 的「測試」= 跑既有測試套件 + build 確認全綠（既有測試多為文字/role/href 斷言，守住不破壞）；視覺正確性由 Task 5 的 gemini review 把關。唯一測試連動是 Task 1 的 serif mock。

---

## Task 1：Token 基礎（config + globals + 字體 + index.html + main.test）

**Files:**
- Modify: `tailwind.config.ts`、`src/styles/globals.css`、`package.json`、`src/main.tsx`、`tests/main.test.tsx`、`index.html`

> 本 task 後：語義 class 可用、body 變亮、serif 載入。舊 literal class（`bg-brand-500` 等）此時在 config 已移除 → 未重構的元件該些 class 不產生樣式（視覺暫時破，但 build/test 仍綠，Tailwind 對未知 utility 不報錯）。Task 2-4 逐步補回。

- [ ] **Step 1：安裝 serif 字體**

Run: `pnpm add @fontsource/noto-serif-tc`
Expected：`package.json` dependencies 出現 `@fontsource/noto-serif-tc`。

- [ ] **Step 2：`tailwind.config.ts` 全檔換為**

```ts
import type { Config } from 'tailwindcss'
import containerQueries from '@tailwindcss/container-queries'

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
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          hover:   'rgb(var(--color-surface-hover) / <alpha-value>)',
        },
        content: {
          DEFAULT: 'rgb(var(--color-content) / <alpha-value>)',
          muted:   'rgb(var(--color-content-muted) / <alpha-value>)',
          subtle:  'rgb(var(--color-content-subtle) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover:   'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
        focus:       'rgb(var(--color-focus) / <alpha-value>)',
      },
      boxShadow: {
        'soft':    '0 1px 2px rgba(43,36,32,0.06), 0 8px 24px -12px rgba(43,36,32,0.12)',
        'soft-lg': '0 2px 4px rgba(43,36,32,0.06), 0 16px 40px -16px rgba(43,36,32,0.16)',
      },
      backdropBlur: { card: '12px' },
      fontFamily: {
        sans:  ['Inter', 'Noto Sans TC', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [containerQueries],
} satisfies Config
```

- [ ] **Step 3：`src/styles/globals.css` 全檔換為**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg:             245 241 235;  /* #F5F1EB */
    --color-surface:        252 250 246;  /* #FCFAF6 */
    --color-surface-hover:  240 234 225;  /* #F0EAE1 */
    --color-content:         43  36  32;  /* #2B2420 */
    --color-content-muted:  107  95  87;  /* #6B5F57 */
    --color-content-subtle: 116 103  93;  /* #74675D */
    --color-primary:        111  78  55;  /* #6F4E37 */
    --color-primary-hover:   92  63  44;  /* #5C3F2C */
    --color-on-primary:     255 255 255;
    --color-focus:          111  78  55;
  }
  /* 預留：補一組 channel 值即啟用暗色主題（本次不填、不啟用） */
  [data-theme="dark"] {
    /* TODO(dark): --color-* channel 值 */
  }

  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
  body {
    font-family: 'Inter', 'Noto Sans TC', system-ui, -apple-system, sans-serif;
    background-color: rgb(var(--color-bg));
    color: rgb(var(--color-content));
  }
  :focus-visible {
    outline: 2px solid rgb(var(--color-focus));
    outline-offset: 2px;
  }
  ::selection {
    background: rgb(var(--color-primary) / 0.16);
    color: rgb(var(--color-content));
  }
}

@layer utilities {
  /* 亮色 legacy alias：sticky / tab 等沿用 .glass 不必一次大改 */
  .glass {
    background-color: rgb(var(--color-surface) / 0.78);
    backdrop-filter: blur(12px);
    border: 1px solid rgb(var(--color-content) / 0.1);
  }
  /* 咖啡細框卡（FinalCTA 用）：外層咖啡描邊 + 內層暖白面 */
  .glow-border-gradient {
    background: rgb(var(--color-primary) / 0.25);
    padding: 1px;
    border-radius: 14px;
  }
  .glow-border-gradient > * {
    background: rgb(var(--color-surface));
    border-radius: 13px;
  }

  /* LoRA 箭頭顏色流動 */
  @keyframes chevron-pulse-step-1 {
    0%, 100% { opacity: 0.25; }
    25%      { opacity: 1; }
    50%, 75% { opacity: 0.25; }
  }
  @keyframes chevron-pulse-step-2 {
    0%, 100% { opacity: 0.25; }
    25%      { opacity: 0.25; }
    50%      { opacity: 1; }
    75%      { opacity: 0.25; }
  }
  .animate-chev-step-1 { animation: chevron-pulse-step-1 1.4s ease-in-out infinite; }
  .animate-chev-step-2 { animation: chevron-pulse-step-2 1.4s ease-in-out infinite; }

  @keyframes fade-in-slide {
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-slide { animation: fade-in-slide 0.35s ease-out both; }

  @media (prefers-reduced-motion: reduce) {
    .animate-chev-step-1,
    .animate-chev-step-2 { animation: none; opacity: 1; }
    .animate-fade-in-slide { animation: none; }
  }
}
```

- [ ] **Step 4：`src/main.tsx` 在既有 fontsource import 後新增三行**（接在 `@fontsource/noto-sans-tc/700.css` import 之後）

```ts
import '@fontsource/noto-serif-tc/400.css'
import '@fontsource/noto-serif-tc/600.css'
import '@fontsource/noto-serif-tc/700.css'
```

- [ ] **Step 5：`tests/main.test.tsx` 在既有 mock 後新增三行**（接在 `vi.mock('@fontsource/noto-sans-tc/700.css', () => ({}))` 之後）

```ts
vi.mock('@fontsource/noto-serif-tc/400.css', () => ({}))
vi.mock('@fontsource/noto-serif-tc/600.css', () => ({}))
vi.mock('@fontsource/noto-serif-tc/700.css', () => ({}))
```

- [ ] **Step 6：`index.html` body class**（第 34 行）

`<body class="bg-bg-base text-white antialiased">` → `<body class="bg-bg text-content antialiased">`

- [ ] **Step 7：驗證 + commit**

```bash
pnpm typecheck && pnpm lint && pnpm test
git add -A
git commit -m "feat(theme): light/coffee design tokens — channel CSS vars, semantic Tailwind colors, serif font, soft shadows"
```
Expected：全綠（測試含 main.test serif mock）。視覺此時為過渡態（未重構元件無色），屬正常。

---

## Task 2：App（背景/overlay）+ Hero + Nav

**Files:**
- Create: `src/assets/bg-texture.png`
- Modify: `src/App.tsx`、`src/sections/Hero.tsx`、`src/sections/Nav.tsx`

- [ ] **Step 1：複製背景圖進 assets**

Run: `cp "/mnt/c/Users/markchou/Downloads/下載.png" src/assets/bg-texture.png`
Expected：`src/assets/bg-texture.png` 存在（~4.7MB PNG）。

- [ ] **Step 2：`src/App.tsx` 全檔換為**（移除 scroll blur/overlay 機制與 `heroBg`，改 fixed 極淺紋理背景；保留 SNAP_RULES 與 hash-scroll useEffect；外層改亮色）

```tsx
import { useEffect } from 'react'
import bgTexture from '@/assets/bg-texture.png'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Demo } from './sections/Demo'
import { Audiences } from './sections/Audiences'
import { FinalCTA } from './sections/FinalCTA'
import { Footer } from './sections/Footer'
import { ScrollToTop } from './sections/ScrollToTop'

// Section dead-zone snap 規則：使用者下滑停在 fromId section 末端時自動 snap 到 toId。
const SNAP_RULES = [
  { fromId: 'top', toId: 'demo', threshold: 0.7 },
  { fromId: 'demo', toId: 'pricing', threshold: 0.9 },
] as const

export function App() {
  // SPA 初始載入時 URL 含 #hash：mount 後手動 scroll 到 target。
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [])

  // Section dead-zone snap（只在下滑時觸發；prefers-reduced-motion 不觸發）
  useEffect(() => {
    if (typeof window.matchMedia === 'function') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    }

    let endTimer: ReturnType<typeof setTimeout> | undefined
    let isAutoScrolling = false
    let releaseTimer: ReturnType<typeof setTimeout> | undefined
    let lastY = window.scrollY
    let lastDirection: 'up' | 'down' = 'down'

    const onScroll = () => {
      if (isAutoScrolling) return
      const currentY = window.scrollY
      if (currentY !== lastY) {
        lastDirection = currentY > lastY ? 'down' : 'up'
        lastY = currentY
      }
      if (endTimer) clearTimeout(endTimer)
      endTimer = setTimeout(() => {
        if (lastDirection !== 'down') return
        const y = window.scrollY
        for (const rule of SNAP_RULES) {
          const fromEl = document.getElementById(rule.fromId)
          const toEl = document.getElementById(rule.toId)
          if (!fromEl || !toEl) continue
          const rect = fromEl.getBoundingClientRect()
          const sectionTop = rect.top + y
          const sectionHeight = rect.height
          const sectionBottom = sectionTop + sectionHeight
          if (y > sectionTop + sectionHeight * rule.threshold && y < sectionBottom) {
            isAutoScrolling = true
            toEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
            releaseTimer = setTimeout(() => { isAutoScrolling = false }, 800)
            return
          }
        }
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (endTimer) clearTimeout(endTimer)
      if (releaseTimer) clearTimeout(releaseTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg text-content">
      {/* 固定極淺紋理背景（中央大留白、不搶文字） */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${bgTexture})` }}
      />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Demo />
          <Audiences />
          <FinalCTA />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  )
}
```

- [ ] **Step 3：`src/sections/Hero.tsx` 改動**（逐項）
  - **移除**整段紫色 radial glow `<div>`（`aria-hidden` + `style={{background:'radial-gradient(ellipse at top, rgba(168,85,247,0.25), ...)'}}`，約原 13-20 行）。
  - `<h1>` class：`text-5xl tablet:text-7xl desktop:text-8xl font-bold text-white mb-6` → `text-5xl tablet:text-7xl desktop:text-8xl font-bold font-serif text-content mb-6`
  - subtitle `<p>`：`text-lg tablet:text-xl text-gray-300 mb-4` → `text-lg tablet:text-xl text-content-muted mb-4`
  - description `<p>`：`text-base tablet:text-lg text-gray-400 mb-12 max-w-2xl mx-auto` → `text-base tablet:text-lg text-content-muted mb-12 max-w-2xl mx-auto`
  - 主 CTA `<a href="#demo">` 內 cn：`bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg` `transition-colors shadow-glow-md min-h-[44px]` → `bg-primary hover:bg-primary-hover text-on-primary font-semibold text-lg` `transition-colors shadow-soft min-h-[44px]`
  - 次 CTA `<a href="#pricing">` 內 cn：`border border-border-subtle text-white hover:bg-surface-hover text-lg` → `border border-content/15 text-content hover:bg-surface-hover text-lg`
  - scroll svg：`<rect ... className="stroke-gray-400/60" />` → `stroke-content/40`；`<path ... className="stroke-brand-300" />` → `stroke-primary`

- [ ] **Step 4：`src/sections/Nav.tsx` 改動**（逐項）
  - `<header>` cn：`bg-bg-base/50 backdrop-blur-card border-b border-border-subtle` → `bg-bg/80 backdrop-blur-card border-b border-content/10`
  - logo `<a href="#top">`：`text-white font-semibold` → `text-content font-semibold`；其內 `<Sparkles className="w-4 h-4 text-brand-300" .../>` → `text-primary`
  - desktop `<nav>`：`text-gray-300 text-base` → `text-content-muted text-base`；三個連結的 `hover:text-white` → `hover:text-content`
  - 語言鈕 active 態：`text-white bg-brand-500/25 border border-border-brand` → `text-content bg-primary/10 border border-primary/25`；inactive 態：`text-gray-400 hover:text-white hover:bg-surface` → `text-content-muted hover:text-content hover:bg-surface-hover`
  - 漢堡 `<button>`：`text-gray-300 hover:text-white` → `text-content-muted hover:text-content`
  - mobile drawer `<nav id="nav-drawer">`：`border-t border-border-subtle bg-bg-elevated` → `border-t border-content/10 bg-surface`；其內三連結的 `hover:text-white border-b border-border-subtle` → `hover:text-content border-b border-content/10`（最後一個無 border-b 的同樣 `hover:text-white` → `hover:text-content`）；drawer 容器文字 `text-gray-300` → `text-content-muted`

- [ ] **Step 5：驗證 + commit**

```bash
pnpm typecheck && pnpm lint && pnpm test
git add -A
git commit -m "feat(theme): light App background (texture, no dark overlay) + Hero serif/coffee + light Nav"
```
Expected：全綠。

---

## Task 3：SectionHeader + Badge + Demo + DemoCard + TabSegment

**Files:** `src/components/SectionHeader.tsx`、`src/components/Badge.tsx`、`src/sections/Demo.tsx`、`src/components/DemoCard.tsx`、`src/components/TabSegment.tsx`

- [ ] **Step 1：`SectionHeader.tsx`**
  - `<h2>`：`text-4xl tablet:text-5xl desktop:text-6xl font-bold text-white mb-3` → `text-4xl tablet:text-5xl desktop:text-6xl font-bold font-serif text-content mb-3`
  - 副標 `<p>`：`text-gray-300 text-lg tablet:text-xl max-w-2xl mx-auto` → `text-content-muted text-lg tablet:text-xl max-w-2xl mx-auto`

- [ ] **Step 2：`Badge.tsx`**
  - `<span>` cn：`border border-border-brand bg-white/[0.04] backdrop-blur-sm text-purple-200` `shadow-glow-md` → `border border-primary/25 bg-primary/8 backdrop-blur-sm text-primary` `shadow-soft`
  - `<Sparkles className="w-4 h-4 text-brand-300" />` → `text-primary`

- [ ] **Step 3：`Demo.tsx`**
  - tech banner `<div>`：`border border-border-brand bg-brand-500/10 shadow-glow-md` → `border border-primary/25 bg-primary/8 shadow-soft`
  - banner 標題行 `<div className="... text-white font-medium ...">` → `text-content`；其內 `<Sparkles ... text-brand-300>` 與 `<VideoIcon ... text-brand-300>` → `text-primary`
  - banner 說明 `<p className="text-gray-400 ...">` → `text-content-muted`
  - LoRA 箭頭容器 `<div className="... text-brand-300" role="img">` → `text-primary`
  - **AI 生成 tag（壓在圖上、媒體例外）** `<span>`：`bg-bg-base/80 backdrop-blur-sm border border-border-brand text-purple-200 shadow-glow-md` → `bg-black/55 backdrop-blur-sm border border-white/15 text-white shadow-soft`；其內 `<Zap ... text-brand-300>` → `text-on-primary`

- [ ] **Step 4：`DemoCard.tsx`**
  - image variant 外層：`rounded-xl overflow-hidden border border-border-subtle` → `... border border-content/10`
  - video card 外層：`rounded-xl overflow-hidden border border-border-subtle bg-bg-elevated` → `... border border-content/10 bg-surface`
  - **媒體例外保留不改**：`aspect-video bg-black`、duration `<span className="... bg-black/60 text-white ...">`、Play `<Play className="w-6 h-6 text-white" />` 維持
  - play 圓鈕 `<span className="w-14 h-14 rounded-full bg-brand-500 ... shadow-glow-lg ...">` → `bg-primary ... shadow-soft-lg`；其內 Play icon `text-white` → `text-on-primary`
  - 影片標題（卡面內文）`<div className="text-white font-medium mb-1 text-lg">` → `text-content`
  - desc `<div className="text-gray-400 text-base">` → `text-content-muted`

- [ ] **Step 5：`TabSegment.tsx`**
  - 容器 `<div role="tablist" className="... glass shadow-glow-md">` → `... glass shadow-soft`
  - 指示器 `<span ... className="... bg-brand-500 shadow-glow-md ...">` → `bg-primary shadow-soft`
  - active `text-white` → `text-on-primary`；inactive `text-gray-300 hover:text-white` → `text-content-muted hover:text-content`

- [ ] **Step 6：驗證 + commit**

```bash
pnpm typecheck && pnpm lint && pnpm test
git add -A
git commit -m "feat(theme): coffee/light restyle for SectionHeader, Badge, Demo, DemoCard, TabSegment (media scrims kept)"
```
Expected：全綠。

---

## Task 4：AudienceCard + FinalCTA + Footer + ScrollToTop

**Files:** `src/components/AudienceCard.tsx`、`src/sections/FinalCTA.tsx`、`src/sections/Footer.tsx`、`src/sections/ScrollToTop.tsx`

- [ ] **Step 1：`AudienceCard.tsx`**
  - 卡外層 cn：highlighted 分支 `border border-brand-500 bg-gradient-to-b from-brand-500/15 to-brand-500/5 shadow-glow-lg` → `border border-primary bg-primary/8 shadow-soft-lg`；非 highlighted 分支 `border border-border-subtle bg-surface` → `border border-content/10 bg-surface shadow-soft`
  - badge 變體 cn：`badgeVariant === 'gold' ? 'bg-[#D4AF37] text-black' : 'bg-brand-500 text-white'` → 非 gold 改 `'bg-primary text-on-primary'`（gold 分支為死碼、維持不變）
  - icon 圓底 `<span className="... bg-brand-500/20 border border-border-brand">` → `bg-primary/10 border border-primary/25`
  - name `<div className="text-gray-200 text-xl font-medium">` → `text-content text-xl font-medium`
  - tagline `<div className="text-gray-400 text-base mb-5">` → `text-content-muted text-base mb-5`
  - 痛點面板 `<div className="rounded-xl bg-bg-base/40 border border-border-subtle p-4 mb-5">` → `rounded-xl bg-primary/8 border border-content/10 p-4 mb-5`
  - 痛點標題 `<div className="text-amber-200/90 text-sm font-semibold mb-3">` → `text-content-muted text-sm font-semibold mb-3`
  - 痛點 marker `<Minus className="w-4 h-4 mt-0.5 flex-none text-amber-300/70" />` → `text-content-muted`；痛點 li `<li className="... text-gray-300 text-sm">` → `text-content-muted text-sm`
  - 解法標題 `<div className="text-brand-300 text-sm font-semibold mb-3">` → `text-primary text-sm font-semibold mb-3`
  - 解法 li `<li className="... text-gray-200 text-base">` → `text-content text-base`；解法 check `<Check className="... text-brand-300" />` → `text-primary`
  - CTA `<a>` cn：highlighted `bg-brand-500 text-white hover:bg-brand-400` → `bg-primary text-on-primary hover:bg-primary-hover`；非 highlighted `border border-border-brand text-gray-200 hover:bg-surface-hover` → `border border-primary/25 text-content hover:bg-surface-hover`

- [ ] **Step 2：`FinalCTA.tsx`**
  - 外層 `<div className="glow-border-gradient shadow-glow-xl">` → `glow-border-gradient shadow-soft-lg`
  - `<h3 className="text-3xl tablet:text-4xl font-bold text-white mb-3">` → `text-3xl tablet:text-4xl font-bold font-serif text-content mb-3`
  - `<p className="text-gray-300 mb-6 text-lg">` → `text-content-muted mb-6 text-lg`
  - button `<a>`：`bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg transition-colors shadow-glow-md` → `bg-primary hover:bg-primary-hover text-on-primary font-semibold text-lg transition-colors shadow-soft`

- [ ] **Step 3：`Footer.tsx`**
  - `<footer className="... border-t border-border-subtle">` → `border-t border-content/10`
  - 標題行 `<div className="... text-white font-semibold ...">` → `text-content`；其 `<Sparkles ... text-brand-300>` → `text-primary`
  - tagline `<p className="text-gray-400 ...">` → `text-content-muted`
  - contactTitle `<div className="text-gray-300 text-base mb-3">` → `text-content-muted text-base mb-3`
  - **TG 按鈕咖啡化**（原 sky 藍 → 與全站咖啡 CTA 一致）：`border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20` → `border border-primary/40 bg-primary/8 text-primary hover:bg-primary/15`
  - responseTime `<div className="text-gray-500 text-sm mt-3">` → `text-content-subtle text-sm mt-3`
  - **QR 白底保留**（功能性、QR 需白底 quiet zone）：兩處 `<div className="p-2 rounded-lg bg-white">` / `p-3 rounded-lg bg-white` 維持 `bg-white`
  - qrCaption `<div className="text-gray-500 text-xs">` → `text-content-subtle text-xs`
  - copyright `<div className="pt-6 border-t border-border-subtle text-gray-500 text-sm">` → `pt-6 border-t border-content/10 text-content-subtle text-sm`

- [ ] **Step 4：`ScrollToTop.tsx`**
  - `<button>` cn：`bg-brand-500 hover:bg-brand-400` → `bg-primary hover:bg-primary-hover`；`shadow-glow-lg` → `shadow-soft-lg`
  - `<ChevronUp className="w-6 h-6 text-white" />` → `text-on-primary`

- [ ] **Step 5：驗證 + commit**

```bash
pnpm typecheck && pnpm lint && pnpm test
git add -A
git commit -m "feat(theme): coffee/light restyle for AudienceCard, FinalCTA, Footer (TG btn coffee, QR white kept), ScrollToTop"
```
Expected：全綠。

---

## Task 5：殘留驗收 + build/prerender + gemini 視覺 review

**Files:** 視 gemini 意見可能微調

- [ ] **Step 1：殘留 grep（應收斂到 0，扣除允許例外）**

Run:
```bash
grep -rEn "text-brand-|stroke-brand-|border-brand-|bg-brand-|from-brand-|to-brand-|brand-(300|400|500|accent)|purple-|text-amber-|rgba\(168,85,247|#A855F7|#7C3AED|#8B5CF6|#0E0B1F|#1A0F2F|gradient-brand|shadow-glow|bg-bg-base|bg-bg-elevated|border-border-subtle|border-border-brand|text-gray-|sky-" \
  src index.html tailwind.config.ts src/styles/globals.css
```
Expected：無輸出（`gradient-brand`/`glow-border-gradient` 名稱已不在 config；`.glow-border-gradient` util 名保留但不含 `shadow-glow`）。
**允許例外**（若命中需逐筆確認屬下列才放行）：
- `src/data/content.ts` 的 audience key `'brand'`、型別 `AudienceKey`（非 class）
- i18n / SEO 文案中的英文 "brand"
- `DemoCard.tsx` 媒體 scrim：`bg-black`、`bg-black/60`、`text-white`（duration / play / video chrome）
- `Demo.tsx` AI tag：`bg-black/55`、`border-white/15`、`text-white`（媒體例外）
- `Footer.tsx` QR：`bg-white`（功能白底）
- `AudienceCard.tsx` 死碼 gold `bg-[#D4AF37]`（不在 grep pattern、不會命中）

> 另跑一次 `text-white|bg-black` 確認剩餘命中**全部**落在上述媒體/功能例外清單，無遺漏的內文白字。

- [ ] **Step 2：全綠 + build + prerender**

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
# preview + prerender + verify（CI 同款流程）
pnpm preview --port 4173 & sleep 2 && pnpm exec wait-on http://localhost:4173/ai-portrait-studio-site/ --timeout 30000
pnpm prerender && pnpm verify-prerender
```
Expected：全綠、build 成功、verify-prerender all rules passed。完成後關掉 preview（用 PID）。

- [ ] **Step 3：dev server + 截圖**

啟 `pnpm dev`，用 playwright-cli 截 **桌面（1280）+ 手機（390）** 的 hero / demo / audiences / footer（至少繁中；建議 EN 桌面驗長文字），存 cwd 下暫存夾。

- [ ] **Step 4：gemini 視覺 review（強制流程）**

把截圖 + 變動重點（深紫科技風 → 暖白咖啡簡約、襯線大標、極淺紋理背景、去 glow）交 gemini，請從：① 整體亮色簡約專業質感是否到位、② 咖啡色運用是否一致協調、③ 文字對比 a11y（暖白底上近黑棕、咖啡按鈕白字、次要文字）、④ 背景紋理是否不搶文字、⑤ 襯線大標效果、⑥ RWD 破版。只回意見。

- [ ] **Step 5：處理意見 + 收斂**：套 `receiving-code-review` 精神逐條評估；有改則重截圖再 review，直到收斂或使用者同意。

- [ ] **Step 6：回報使用者**：變更檔案清單 + 最終截圖 + gemini review 摘要（採納/略過與原因）。

---

## Self-Review（plan 對 spec 覆蓋）

- **spec 成功標準 1（全站亮色）** → Task 1（body/index.html）+ Task 2-4（各區塊）✅
- **2（咖啡 primary）** → Task 2-4 所有 brand→primary ✅
- **3（去科技化：glow/glass/glow-border/App overlay/radial）** → Task 1（shadow soft、glass/glow-border 重定義）+ Task 2（App overlay、Hero radial 移除）✅
- **4（CSS 變數 token 架構 + dark 預留）** → Task 1 ✅
- **5（襯線大標）** → Task 1（serif 字體）+ Hero/SectionHeader/FinalCTA 加 font-serif ✅
- **6（背景紋理圖）** → Task 2 ✅
- **7（a11y 對比 / subtle 加深 / 關鍵小字用 muted）** → Task 1 token 值（subtle #74675D）；Footer responseTime/qrCaption/copyright 用 subtle 屬非關鍵；Task 5 gemini 把關 ✅
- **8（全綠 + build + prerender）** → 各 task gate + Task 5 ✅
- **9（gemini 視覺）** → Task 5 ✅
- **媒體 overlay 例外** → Task 3（DemoCard/Demo AI tag）+ Task 5 grep 例外清單 ✅
- **main.test serif mock** → Task 1 Step 5 ✅
- **index.html** → Task 1 Step 6 ✅
- **Footer TG sky→coffee、QR bg-white 保留** → Task 4 Step 3（spec 未明列 sky，plan 補上並標註；QR 列功能例外）✅

**Placeholder scan**：無 TBD/TODO（唯一 TODO 是 globals 內刻意預留的 dark 區塊註解）；每個 code step 均含完整內容或精確 old→new class。
**Type consistency**：token 名（`--color-*`）↔ tailwind colors key ↔ class 名（`bg-bg`/`text-content`/`bg-primary`/`text-on-primary`/`focus`）三處一致；`<alpha-value>` 格式一致；`shadow-soft`/`soft-lg`、`font-serif` 名稱一致。

**已知過渡態**：Task 1 後、Task 4 完成前，未重構元件因舊 class 已從 config 移除而暫時無色（視覺破但 build/test 綠），屬分支內正常遷移態，Task 4 完成即收斂。
