# 「服務對象」區塊改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **本專案規範**：實作步驟一律由 Agent tool subagent 內 `codex exec` 撰寫，主對話僅 orchestration / 驗證。

**Goal:** 把 `#pricing` 區塊從「以價格為主軸」改為「以客群痛點為主軸」的三張服務對象卡，撤除所有價格並同步 head meta / JSON-LD，三語一致。

**Architecture:** 分階段提交、每個 commit 維持 `pnpm typecheck/lint/test` 全綠 — 先「只加新（i18n audiences 區塊 + AUDIENCES 資料 + AudienceCard 元件）」，再「換 section + App import」，再「連動文案 + 連動測試」，再「SEO 撤價」，最後「刪死碼（舊 i18n/資料/元件/currency/CSS）」。`id="pricing"` 全程不變，錨點 / snap / sitemap 零影響。

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind 3 + 強型別三語 i18n（`Messages` DeepString shape）+ Vitest + Testing Library + Playwright prerender。

**參考 spec：** `docs/superpowers/specs/2026-06-08-audiences-section-design.md`

**版本：** plan v2（codex review 完，採納 5 條：Task 2 不單獨 commit / section 測試補 4 痛點4解法 / jsonld deep guard / 負向 grep 補具體價格數字 / og 刻意保留例外）。codex 已確認 LucideIcon、`a.cards[aud.key]` 索引、ReadonlyArray、itemOffered、`'in'` 運算子、pricingCta dead key、i18n.test 不需改、prerender 不需改 — 型別與相依假設全部成立。

---

## File Structure

| 檔案 | 責任 | 動作 |
|---|---|---|
| `src/i18n/messages.zh-hant.ts` | i18n source shape（定義 `Messages` 型別） | 加 `audiences`、改連動文案、（Task 5）刪 `pricing`/`addons`/`pricingCta` |
| `src/i18n/messages.zh-hans.ts` / `messages.en.ts` | 簡中 / EN 字典（`Messages` 型別） | 同步上述 |
| `src/data/content.ts` | 非翻譯資料（URL / 結構 flag） | 加 `AUDIENCES`、（Task 5）刪價格資料 |
| `src/components/AudienceCard.tsx` | 單張服務對象卡（痛點 / 解法 / CTA） | **新增** |
| `src/sections/Audiences.tsx` | 服務對象區塊（取代 `Pricing.tsx`） | **新增**（刪 `Pricing.tsx`） |
| `src/App.tsx` | 組合各 section | import `Audiences` 取代 `Pricing` |
| `src/lib/seo/jsonld.ts` | structured data | OfferCatalog 改不帶價 + `itemOffered: Service` |
| `src/lib/seo/meta.ts` | 三語 SEO_META | title/description 撤價 |
| `index.html` | 靜態 head 預設值 | title/description 撤價 |
| `src/styles/globals.css` | 全域 CSS | 刪 `.addon-card-cq*` |
| 死碼 | — | 刪 `PlanCard`/`AddOnCard`/`AddOnsCarousel`/`useCurrency`/`currency.ts` + 各自 test |

---

## Task 1：i18n 加 `audiences` 區塊 + content `AUDIENCES` + AudienceCard 元件（純新增，舊內容暫留）

**Files:**
- Modify: `src/i18n/messages.zh-hant.ts`、`src/i18n/messages.zh-hans.ts`、`src/i18n/messages.en.ts`
- Modify: `src/data/content.ts`
- Create: `src/components/AudienceCard.tsx`
- Create: `tests/components/AudienceCard.test.tsx`

> 本 task 不動 `Pricing.tsx`、不刪任何東西，故 tree 維持全綠（純加法）。`audiences` 加在三語的 `pricing` 之後、`addons` 之前皆可。

- [ ] **Step 1：三語 i18n 各新增 `audiences` 區塊**

`messages.zh-hant.ts`（加在 `pricing: {...}` 區塊後）：

```ts
  audiences: {
    badge:         '服務對象',
    title:         '我們服務這三類客戶',
    subtitle:      '以上這些專業能力，會依不同客群的需求，組成完全不同的解決方案',
    painTitle:     '你是不是遇到——',
    solutionTitle: '我們怎麼幫你——',
    specialBadge:  '特殊服務',
    cards: {
      brand: {
        name:    '品牌・廣告主',
        tagline: '需要形象與廣告素材的企業主、電商與在地商家',
        pains: [
          '找模特兒、租攝影棚、外拍一次就燒掉大筆預算',
          '想換季、換檔期就得重拍，素材更新永遠跟不上',
          '商品想要代言形象，卻請不起長期代言人',
          '投廣告需要大量不同版本素材做 A/B 測試',
        ],
        solutions: [
          '打造專屬品牌形象人物，一次訓練、長期沿用',
          '同一張臉產出無限場景與服裝，換檔期不必重拍',
          '商品形象寫真 + 代言視覺，成本僅傳統外拍的一小部分',
          '批量產出多版本廣告素材，加速投放與測試',
        ],
        ctaLabel: '聊聊我的需求',
      },
      creator: {
        name:    '網紅・經紀・自媒體',
        tagline: '想靠影音內容變現的創作者、經紀公司與 MCN',
        pains: [
          '內容產量永遠追不上平台演算法的胃口',
          '真人出鏡有檔期、肖像與隱私的層層限制',
          '想經營虛擬人設，卻缺技術與穩定產線',
          '跨平台要做差異化內容，人力根本做不完',
        ],
        solutions: [
          '建立專屬虛擬人物與 LoRA，內容產量直接拉滿',
          '人像 + 影片一條龍，短影音與貼文素材穩定供應',
          '從人設、風格表到發布策略，幫你把虛擬 IP 養起來',
          '跨平台差異化內容批量產出，一人也能做出團隊的量',
        ],
        ctaLabel: '聊聊我的需求',
      },
      operator: {
        name:    '專業操盤手・多帳號矩陣',
        tagline: '需要同時經營多組虛擬人設與品牌帳號的專業團隊',
        pains: [
          '要同時養多組人設，產製量級遠超一般工作室',
          '每組人設都要長相一致、風格各自獨立、不能撞臉',
          '素材需求是持續性的，產線一停內容就斷',
          '一般外包無法配合保密與專屬產製的需求',
        ],
        solutions: [
          '為每組人設訓練獨立 LoRA，角色一致、互不混淆',
          '規模化人像 + 影片產線，支援高頻、大批量交付',
          '人設、風格與場景可系統化區隔與管理',
          '專屬保密合作模式，依產量級距客製專案',
        ],
        ctaLabel: '洽談專屬產線',
      },
    },
  },
```

`messages.zh-hans.ts`（同位置）：

```ts
  audiences: {
    badge:         '服务对象',
    title:         '我们服务这三类客户',
    subtitle:      '以上这些专业能力，会依不同客群的需求，组成完全不同的解决方案',
    painTitle:     '你是不是遇到——',
    solutionTitle: '我们怎么帮你——',
    specialBadge:  '特殊服务',
    cards: {
      brand: {
        name:    '品牌・广告主',
        tagline: '需要形象与广告素材的企业主、电商与本地商家',
        pains: [
          '找模特儿、租摄影棚、外拍一次就烧掉大笔预算',
          '想换季、换档期就得重拍，素材更新永远跟不上',
          '商品想要代言形象，却请不起长期代言人',
          '投广告需要大量不同版本素材做 A/B 测试',
        ],
        solutions: [
          '打造专属品牌形象人物，一次训练、长期沿用',
          '同一张脸产出无限场景与服装，换档期不必重拍',
          '商品形象写真 + 代言视觉，成本仅传统外拍的一小部分',
          '批量产出多版本广告素材，加速投放与测试',
        ],
        ctaLabel: '聊聊我的需求',
      },
      creator: {
        name:    '网红・经纪・自媒体',
        tagline: '想靠影音内容变现的创作者、经纪公司与 MCN',
        pains: [
          '内容产量永远追不上平台算法的胃口',
          '真人出镜有档期、肖像与隐私的层层限制',
          '想经营虚拟人设，却缺技术与稳定产线',
          '跨平台要做差异化内容，人力根本做不完',
        ],
        solutions: [
          '建立专属虚拟人物与 LoRA，内容产量直接拉满',
          '人像 + 视频一条龙，短视频与贴文素材稳定供应',
          '从人设、风格表到发布策略，帮你把虚拟 IP 养起来',
          '跨平台差异化内容批量产出，一人也能做出团队的量',
        ],
        ctaLabel: '聊聊我的需求',
      },
      operator: {
        name:    '专业操盘手・多账号矩阵',
        tagline: '需要同时经营多组虚拟人设与品牌账号的专业团队',
        pains: [
          '要同时养多组人设，产制量级远超一般工作室',
          '每组人设都要长相一致、风格各自独立、不能撞脸',
          '素材需求是持续性的，产线一停内容就断',
          '一般外包无法配合保密与专属产制的需求',
        ],
        solutions: [
          '为每组人设训练独立 LoRA，角色一致、互不混淆',
          '规模化人像 + 视频产线，支持高频、大批量交付',
          '人设、风格与场景可系统化区隔与管理',
          '专属保密合作模式，依产量级距定制专案',
        ],
        ctaLabel: '洽谈专属产线',
      },
    },
  },
```

`messages.en.ts`（同位置）：

```ts
  audiences: {
    badge:         'Who We Serve',
    title:         'We serve these three types of clients',
    subtitle:      'These capabilities combine into entirely different solutions, tailored to each audience\'s needs.',
    painTitle:     'Sound familiar?',
    solutionTitle: 'How we help',
    specialBadge:  'Special Service',
    cards: {
      brand: {
        name:    'Brands & Advertisers',
        tagline: 'Business owners, e-commerce, and local shops needing brand imagery and ad creatives',
        pains: [
          'Models, studio rentals, and shoots burn through your budget in one go',
          'Every new season or campaign means reshooting — content updates never keep up',
          'You want a spokesperson image for products but can\'t afford a long-term one',
          'Running ads means producing many creative variants for A/B testing',
        ],
        solutions: [
          'Build a dedicated brand persona — train once, use long-term',
          'One face, unlimited scenes and outfits — no reshoots between campaigns',
          'Product imagery + spokesperson visuals at a fraction of traditional shoot costs',
          'Batch-produce multiple ad variants to speed up delivery and testing',
        ],
        ctaLabel: 'Let\'s Talk',
      },
      creator: {
        name:    'Creators, Agencies & Self-media',
        tagline: 'Creators, talent agencies, and MCNs monetizing through video content',
        pains: [
          'Content output can never keep up with the platform algorithm\'s appetite',
          'Real-person filming is limited by scheduling, likeness rights, and privacy',
          'You want to run a virtual persona but lack the tech and a stable pipeline',
          'Cross-platform differentiated content is simply too much for your team',
        ],
        solutions: [
          'Build a dedicated virtual persona and LoRA — max out your content output',
          'Portraits + video in one pipeline — a steady supply of shorts and post assets',
          'From persona and style sheets to publishing strategy, we grow your virtual IP',
          'Batch cross-platform differentiated content — one person, a team\'s output',
        ],
        ctaLabel: 'Let\'s Talk',
      },
      operator: {
        name:    'Pro Operators & Multi-account Networks',
        tagline: 'Professional teams running multiple virtual personas and brand accounts at once',
        pains: [
          'Running many personas at once — output volume far beyond a regular studio',
          'Every persona must stay visually consistent, distinct, and never look alike',
          'Content demand is continuous — the moment the pipeline stops, content dries up',
          'Regular outsourcing can\'t meet confidentiality and dedicated-production needs',
        ],
        solutions: [
          'Train a separate LoRA per persona — consistent characters, never mixed up',
          'Scaled portrait + video pipeline supporting high-frequency, high-volume delivery',
          'Personas, styles, and scenes managed and separated systematically',
          'A dedicated, confidential partnership with custom projects scaled to your volume',
        ],
        ctaLabel: 'Discuss a Dedicated Line',
      },
    },
  },
```

- [ ] **Step 2：`src/data/content.ts` 新增 AUDIENCES 結構**（加在 `ADDON_CARDS` 後、不刪舊資料）

```ts
// 服務對象 — 三類客群（文案在 i18n.audiences、這裡只放 key + 視覺 flag）
export type AudienceKey = 'brand' | 'creator' | 'operator'

export type AudienceMeta = {
  key: AudienceKey
  highlighted?: boolean       // 是否套用 highlighted 邊框（第三卡）
  special?: boolean           // 是否顯示金色「特殊服務」badge（第三卡）
}

export const AUDIENCES: AudienceMeta[] = [
  { key: 'brand' },
  { key: 'creator' },
  { key: 'operator', highlighted: true, special: true },
]
```

- [ ] **Step 3：寫 AudienceCard 失敗測試** `tests/components/AudienceCard.test.tsx`

```tsx
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Megaphone } from 'lucide-react'
import { AudienceCard } from '@/components/AudienceCard'

const baseProps = {
  name: '品牌・廣告主',
  icon: <Megaphone className="w-4 h-4" aria-hidden="true" />,
  tagline: '需要形象與廣告素材的企業主、電商與在地商家',
  painTitle: '你是不是遇到——',
  pains: ['痛點一', '痛點二', '痛點三', '痛點四'],
  solutionTitle: '我們怎麼幫你——',
  solutions: ['解法一', '解法二', '解法三', '解法四'],
  ctaLabel: '聊聊我的需求',
  ctaHref: 'https://t.me/+test',
}

describe('AudienceCard', () => {
  it('renders name, tagline, 4 pains, 4 solutions, and section titles', () => {
    render(<AudienceCard {...baseProps} />)
    expect(screen.getByText('品牌・廣告主')).toBeInTheDocument()
    expect(screen.getByText(baseProps.tagline)).toBeInTheDocument()
    expect(screen.getByText('你是不是遇到——')).toBeInTheDocument()
    expect(screen.getByText('我們怎麼幫你——')).toBeInTheDocument()
    baseProps.pains.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument())
    baseProps.solutions.forEach((s) => expect(screen.getByText(s)).toBeInTheDocument())
  })

  it('CTA links to ctaHref in a new tab with noopener', () => {
    render(<AudienceCard {...baseProps} />)
    const cta = screen.getByRole('link', { name: '聊聊我的需求' })
    expect(cta).toHaveAttribute('href', 'https://t.me/+test')
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders a gold special badge when badge prop is provided', () => {
    render(<AudienceCard {...baseProps} badge={{ label: '特殊服務', variant: 'gold' }} />)
    expect(screen.getByText('特殊服務')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4：跑測試確認失敗** — Run: `pnpm test -- tests/components/AudienceCard.test.tsx`，Expected: FAIL（`AudienceCard` 模組不存在）

- [ ] **Step 5：實作 `src/components/AudienceCard.tsx`**

```tsx
import { type ReactNode } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'brand' | 'gold'

type Props = {
  name: string
  icon?: ReactNode
  tagline?: string
  painTitle: string
  pains: ReadonlyArray<string>
  solutionTitle: string
  solutions: ReadonlyArray<string>
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  badge?: { label: string; variant?: BadgeVariant }
  className?: string
}

export function AudienceCard({
  name, icon, tagline,
  painTitle, pains, solutionTitle, solutions,
  ctaLabel, ctaHref,
  highlighted, badge, className,
}: Props) {
  const badgeVariant: BadgeVariant = badge?.variant ?? 'brand'
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
      {badge && (
        <span
          className={cn(
            'absolute px-3 py-1 text-sm font-semibold shadow-glow-md',
            badgeVariant === 'gold' ? 'bg-[#D4AF37] text-black' : 'bg-brand-500 text-white',
            'top-[-12px] left-1/2 -translate-x-1/2 rounded-full',
            'desktop:top-0 desktop:right-0 desktop:left-auto desktop:translate-x-0',
            'desktop:rounded-tl-none desktop:rounded-br-none desktop:rounded-tr-2xl desktop:rounded-bl-2xl',
          )}
        >
          {badge.label}
        </span>
      )}

      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <span
            aria-hidden="true"
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-500/20 border border-border-brand"
          >
            {icon}
          </span>
        )}
        <div className="text-gray-200 text-xl font-medium">{name}</div>
      </div>
      {tagline && <div className="text-gray-400 text-base mb-5">{tagline}</div>}

      {/* 痛點區（muted 子面板） */}
      <div className="rounded-xl bg-bg-base/40 border border-border-subtle p-4 mb-5">
        <div className="text-amber-200/90 text-sm font-semibold mb-3">{painTitle}</div>
        <ul className="space-y-2">
          {pains.map((p) => (
            <li key={p} className="flex items-start gap-2 text-gray-400 text-sm">
              <Minus className="w-4 h-4 mt-0.5 flex-none text-amber-300/70" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 解法區 */}
      <div className="mb-6 flex-1">
        <div className="text-brand-300 text-sm font-semibold mb-3">{solutionTitle}</div>
        <ul className="space-y-2">
          {solutions.map((s) => (
            <li key={s} className="flex items-start gap-2 text-gray-200 text-base">
              <Check className="w-4 h-4 mt-0.5 flex-none text-brand-300" aria-hidden="true" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'mt-auto inline-flex items-center justify-center w-full py-3 rounded-lg text-base font-semibold min-h-[44px] transition-colors',
          highlighted
            ? 'bg-brand-500 text-white hover:bg-brand-400'
            : 'border border-border-brand text-gray-200 hover:bg-surface-hover',
        )}
      >
        {ctaLabel}
      </a>
    </div>
  )
}
```

- [ ] **Step 6：跑測試確認通過** — Run: `pnpm test -- tests/components/AudienceCard.test.tsx`，Expected: PASS（3 個 it 全綠）

- [ ] **Step 7：全綠檢查 + commit**

```bash
pnpm typecheck && pnpm lint && pnpm test
git add src/i18n/messages.zh-hant.ts src/i18n/messages.zh-hans.ts src/i18n/messages.en.ts \
        src/data/content.ts src/components/AudienceCard.tsx tests/components/AudienceCard.test.tsx
git commit -m "feat(audiences): add i18n audiences block, AUDIENCES data, AudienceCard component"
```

Expected: typecheck/lint/test 全綠（純加法，舊功能不受影響）。

---

## Task 2：新增 `Audiences` section、替換 `App` import、改寫 section 測試

**Files:**
- Create: `src/sections/Audiences.tsx`
- Delete: `src/sections/Pricing.tsx`
- Modify: `src/App.tsx`
- Create: `tests/sections/Audiences.test.tsx`
- Delete: `tests/sections/Pricing.test.tsx`

> 本 task 後，`Pricing` 不再被引用，但舊 i18n `pricing`/`addons` + 舊 `content` 價格資料 + `AddOnsCarousel`/`PlanCard` 仍在（Task 5 才刪），故 tree 仍綠。

- [ ] **Step 1：寫 `Audiences` section 失敗測試** `tests/sections/Audiences.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Audiences } from '@/sections/Audiences'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { TELEGRAM_URL } from '@/data/content'

function renderZhHant() {
  localStorage.clear()
  window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
  return render(<LanguageProvider><Audiences /></LanguageProvider>)
}

describe('Audiences', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders section header and three audience cards', () => {
    renderZhHant()
    expect(screen.getByText('我們服務這三類客戶')).toBeInTheDocument()
    expect(screen.getByText('品牌・廣告主')).toBeInTheDocument()
    expect(screen.getByText('網紅・經紀・自媒體')).toBeInTheDocument()
    expect(screen.getByText('專業操盤手・多帳號矩陣')).toBeInTheDocument()
  })

  it('each of the three cards renders its 4 pains and 4 solutions', () => {
    renderZhHant()
    // 各卡代表性痛點 + 解法（證明 pains/solutions 非空、確實分屬三卡）
    expect(screen.getByText('找模特兒、租攝影棚、外拍一次就燒掉大筆預算')).toBeInTheDocument()
    expect(screen.getByText('打造專屬品牌形象人物，一次訓練、長期沿用')).toBeInTheDocument()
    expect(screen.getByText('內容產量永遠追不上平台演算法的胃口')).toBeInTheDocument()
    expect(screen.getByText('建立專屬虛擬人物與 LoRA，內容產量直接拉滿')).toBeInTheDocument()
    expect(screen.getByText('要同時養多組人設，產製量級遠超一般工作室')).toBeInTheDocument()
    expect(screen.getByText('為每組人設訓練獨立 LoRA，角色一致、互不混淆')).toBeInTheDocument()
    // 3 卡 × (4 痛點 + 4 解法) = 24 個 <li>（本測試僅渲染 <Audiences/>，無其他 list 干擾）
    expect(screen.getAllByRole('listitem')).toHaveLength(24)
  })

  it('third card shows the gold special badge', () => {
    renderZhHant()
    expect(screen.getByText('特殊服務')).toBeInTheDocument()
  })

  it('renders three CTAs all pointing to Telegram, opening in new tab', () => {
    renderZhHant()
    const inquiry = screen.getAllByRole('link', { name: '聊聊我的需求' })
    const dedicated = screen.getByRole('link', { name: '洽談專屬產線' })
    expect(inquiry).toHaveLength(2)
    for (const link of [...inquiry, dedicated]) {
      expect(link).toHaveAttribute('href', TELEGRAM_URL)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('keeps the #pricing anchor id (nav / snap / sitemap rely on it)', () => {
    const { container } = renderZhHant()
    expect(container.querySelector('section#pricing')).not.toBeNull()
  })

  it('does NOT render any price or old plan name', () => {
    renderZhHant()
    expect(screen.queryByText(/Mini Launch|Standard Launch|Pro Launch|Discovery Pack/)).not.toBeInTheDocument()
    expect(screen.queryByText(/NT\$|US\$|加購服務/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2：跑測試確認失敗** — Run: `pnpm test -- tests/sections/Audiences.test.tsx`，Expected: FAIL（`Audiences` 不存在）

- [ ] **Step 3：實作 `src/sections/Audiences.tsx`**

```tsx
import { Megaphone, Clapperboard, LayoutGrid, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { AudienceCard } from '@/components/AudienceCard'
import { useT } from '@/i18n/useT'
import { AUDIENCES, TELEGRAM_URL, type AudienceKey } from '@/data/content'

const ICONS: Record<AudienceKey, LucideIcon> = {
  brand:    Megaphone,
  creator:  Clapperboard,
  operator: LayoutGrid,
}

export function Audiences() {
  const { t } = useT()
  const a = t.audiences

  return (
    <section id="pricing" className="px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader badge={a.badge} title={a.title} subtitle={a.subtitle} />

        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8 mt-16 tablet:max-w-lg tablet:mx-auto desktop:max-w-none desktop:items-stretch">
          {AUDIENCES.map((aud) => {
            const Icon = ICONS[aud.key]
            const card = a.cards[aud.key]
            return (
              <AudienceCard
                key={aud.key}
                name={card.name}
                icon={<Icon className="w-4 h-4 text-brand-300" aria-hidden="true" />}
                tagline={card.tagline}
                painTitle={a.painTitle}
                pains={card.pains}
                solutionTitle={a.solutionTitle}
                solutions={card.solutions}
                ctaLabel={card.ctaLabel}
                ctaHref={TELEGRAM_URL}
                highlighted={aud.highlighted}
                badge={aud.special ? { label: a.specialBadge, variant: 'gold' } : undefined}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4：改 `src/App.tsx`** — 把 `import { Pricing } from './sections/Pricing'` 改為 `import { Audiences } from './sections/Audiences'`；`<main>` 內 `<Pricing />` 改為 `<Audiences />`。其餘（Hero / Demo / FinalCTA / SNAP_RULES / overlay）不動。

- [ ] **Step 5：刪除舊檔** — 刪 `src/sections/Pricing.tsx` 與 `tests/sections/Pricing.test.tsx`

```bash
git rm src/sections/Pricing.tsx tests/sections/Pricing.test.tsx
```

- [ ] **Step 6：跑測試確認通過** — Run: `pnpm test -- tests/sections/Audiences.test.tsx`，Expected: PASS（5 個 it 全綠）

- [ ] **Step 7：跑 Audiences 測試（此處先不 commit）**

Run: `pnpm test -- tests/sections/Audiences.test.tsx`，Expected: PASS。

> **⚠️ 此 task 不單獨 commit（codex High 修正）。** `App` 換成 `Audiences` 後，`tests/sections.smoke.test.tsx` 立即失效（仍斷言「選擇適合您的方案 / 加購服務 / 哪個方案」），此刻跑 `pnpm test` 全套會 **紅**。因此 Task 2 完成後**直接續接 Task 3**，待 Task 3 修好 smoke / Nav / Hero / FinalCTA 測試、全套綠後，**Task 2 + Task 3 一起做一個 commit**（commit 指令見 Task 3 Step 7）。

---

## Task 3：連動文案（Nav / Hero / FinalCTA）+ 移除 dead key `pricingCta` + 連動測試

> **與 Task 2 合併提交**：因 `App` 換 section 後 `sections.smoke.test.tsx` 立即失效，需與本 task 一起綠。執行 subagent 可把 Task 2 + Task 3 視為一次 codex 任務、一個 commit。

**Files:**
- Modify: `src/i18n/messages.zh-hant.ts`、`messages.zh-hans.ts`、`messages.en.ts`（改 `nav.plans`/`hero.ctaSecondary`/`finalCta.title`；刪 `demo.pricingCta`）
- Modify: `tests/sections/Nav.test.tsx`、`tests/sections/Hero.test.tsx`、`tests/sections/FinalCTA.test.tsx`、`tests/sections.smoke.test.tsx`

- [ ] **Step 1：三語連動文案改值**

| key | zh-Hant | zh-Hans | en |
|---|---|---|---|
| `nav.plans` | `服務對象` | `服务对象` | `Who We Serve` |
| `hero.ctaSecondary` | `看看我們怎麼幫你` | `看看我们怎么帮你` | `See How We Help` |
| `finalCta.title` | `不確定你屬於哪一類客戶？` | `不确定你属于哪一类客户？` | `Not sure which type fits you?` |

- [ ] **Step 2：三語移除 dead key `demo.pricingCta`** — 從三檔 `demo` 區塊刪掉 `pricingCta:` 那一行（已確認無任何元件 / 測試使用）。

- [ ] **Step 3：改 `tests/sections/Nav.test.tsx`** — 三處 `getByRole('link', { name: '方案' })` 改為 `'服務對象'`（href 仍 `#pricing`，不改）。

- [ ] **Step 4：改 `tests/sections/Hero.test.tsx`** — `getByRole('link', { name: '方案諮詢' })` 改為 `'看看我們怎麼幫你'`（href 仍 `#pricing`）。

- [ ] **Step 5：改 `tests/sections/FinalCTA.test.tsx`** — `getByText('不確定哪個方案適合您？')` 改為 `'不確定你屬於哪一類客戶？'`。

- [ ] **Step 6：改 `tests/sections.smoke.test.tsx`** — 三個語言斷言改為新區塊文案：

```tsx
// zh-Hant 區塊
expect(screen.getByText('AI 生成作品範例')).toBeInTheDocument()
expect(screen.getByText('我們服務這三類客戶')).toBeInTheDocument()
expect(screen.getByText('品牌・廣告主')).toBeInTheDocument()
expect(screen.getByText('不確定你屬於哪一類客戶？')).toBeInTheDocument()
expect(screen.getByText(/© 2026/)).toBeInTheDocument()

// zh-Hans 區塊
expect(screen.getByText('AI 生成作品范例')).toBeInTheDocument()
expect(screen.getByText('我们服务这三类客户')).toBeInTheDocument()
expect(screen.getByText('品牌・广告主')).toBeInTheDocument()

// en 區塊
expect(screen.getByText('AI Portrait Showcase')).toBeInTheDocument()
expect(screen.getByText('We serve these three types of clients')).toBeInTheDocument()
expect(screen.getByText('Brands & Advertisers')).toBeInTheDocument()
```

（`all TG links open in new tab` 測試不變：現在三張卡 CTA + footer + finalCta，TG link ≥ 3 仍成立。）

- [ ] **Step 7：全綠檢查 + commit**（與 Task 2 合併）

```bash
pnpm typecheck && pnpm lint && pnpm test
git add -A
git commit -m "feat(audiences): connected copy (nav/hero/finalCta), drop dead pricingCta key, update tests"
```

Expected：全綠（含 smoke 三語）。

---

## Task 4：SEO 撤價 — `jsonld.ts` + `meta.ts` + `index.html`

**Files:**
- Modify: `src/lib/seo/jsonld.ts`
- Modify: `src/lib/seo/meta.ts`
- Modify: `index.html`
- Modify: `tests/lib/seo/jsonld.test.ts`

> 此時 `content.ts` 的 `PLAN_PRICES`/`DISCOVERY_PRICE` 仍存在（Task 5 才刪），但本 task 把 `jsonld.ts` 改成不再 import 它們。

- [ ] **Step 1：改寫 `tests/lib/seo/jsonld.test.ts` 的 ProfessionalService 區塊**（VideoObject 區塊不動）

把原本 `OfferCatalog contains 4 plans with TWD price` 與 `priceCurrency is always TWD` 兩個 it，替換為：

```ts
    it('OfferCatalog contains 3 audience services with itemOffered, no price', () => {
      const json = buildProfessionalServiceJsonLd('zh-Hant')
      const offers = json.hasOfferCatalog.itemListElement
      expect(offers).toHaveLength(3)
      offers.forEach((o) => {
        expect(o['@type']).toBe('Offer')
        expect(o.itemOffered['@type']).toBe('Service')
        expect(o.itemOffered.name).toBeTruthy()
        // 撤價：Offer 不得帶 price / priceCurrency
        expect('price' in o).toBe(false)
        expect('priceCurrency' in o).toBe(false)
      })
    })

    it('emits no priceRange field for any lang', () => {
      for (const lang of ['zh-Hant', 'zh-Hans', 'en'] as const) {
        const json = buildProfessionalServiceJsonLd(lang)
        expect('priceRange' in json).toBe(false)
      }
    })

    it('serialized JSON-LD contains no price-related field (deep guard)', () => {
      for (const lang of ['zh-Hant', 'zh-Hans', 'en'] as const) {
        const serialized = JSON.stringify(buildProfessionalServiceJsonLd(lang))
        expect(serialized).not.toMatch(/priceCurrency|priceRange|"price":/)
      }
    })
```

- [ ] **Step 2：跑測試確認失敗** — Run: `pnpm test -- tests/lib/seo/jsonld.test.ts`，Expected: FAIL（型別含 priceRange / offers 仍 4 筆帶價）

- [ ] **Step 3：改寫 `src/lib/seo/jsonld.ts`**

把第 3 行 import 改為（移除價格 import）：

```ts
import { TELEGRAM_URL } from '@/data/content'
```

`ProfessionalServiceJsonLd` 型別：移除 `priceRange: string`，並把 `hasOfferCatalog.itemListElement` 的 Offer 型別改為：

```ts
  hasOfferCatalog: {
    '@type': 'OfferCatalog'
    name: string
    itemListElement: Array<{
      '@type': 'Offer'
      name: string
      itemOffered: {
        '@type': 'Service'
        name: string
        serviceType: string
      }
    }>
  }
```

把 `OFFER_NAMES` 整段替換為三客群服務（含 serviceType）：

```ts
const AUDIENCE_OFFERS: Record<Lang, Array<{ name: string; serviceType: string }>> = {
  'zh-Hant': [
    { name: '品牌・廣告主 服務方案', serviceType: 'AI 品牌形象與廣告素材' },
    { name: '網紅・自媒體 服務方案', serviceType: 'AI 虛擬人物與影音內容' },
    { name: '多帳號矩陣 專屬產線',   serviceType: '規模化多人設 LoRA 產線' },
  ],
  'zh-Hans': [
    { name: '品牌・广告主 服务方案', serviceType: 'AI 品牌形象与广告素材' },
    { name: '网红・自媒体 服务方案', serviceType: 'AI 虚拟人物与影音内容' },
    { name: '多账号矩阵 专属产线',   serviceType: '规模化多人设 LoRA 产线' },
  ],
  'en': [
    { name: 'Brand & Advertiser Solutions',           serviceType: 'AI brand imagery & ad creatives' },
    { name: 'Creator & Agency Solutions',             serviceType: 'AI virtual personas & video content' },
    { name: 'Multi-account Matrix Dedicated Line',     serviceType: 'Scaled multi-persona LoRA production' },
  ],
}
```

把 `buildProfessionalServiceJsonLd` 改為（移除 minPrice/maxPrice/priceRange、改 itemListElement）：

```ts
export function buildProfessionalServiceJsonLd(lang: Lang): ProfessionalServiceJsonLd {
  const meta = SEO_META[lang]
  const offers = AUDIENCE_OFFERS[lang]
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SERVICE_NAME[lang],
    alternateName: lang === 'en' ? undefined : 'AI Portrait Studio',
    description: meta.description,
    url: canonical(lang),
    image: ogImage(lang),
    areaServed: ['TW', 'HK', 'SG', 'MY', 'CN', 'US'],
    contactPoint: {
      '@type': 'ContactPoint',
      url: TELEGRAM_URL,
      contactType: 'sales',
      availableLanguage: ['zh-Hant', 'zh-Hans', 'en'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'en' ? 'Service Audiences' : '服務對象',
      itemListElement: offers.map((o) => ({
        '@type': 'Offer' as const,
        name: o.name,
        itemOffered: { '@type': 'Service' as const, name: o.name, serviceType: o.serviceType },
      })),
    },
  }
}
```

- [ ] **Step 4：跑測試確認通過** — Run: `pnpm test -- tests/lib/seo/jsonld.test.ts`，Expected: PASS

- [ ] **Step 5：改 `src/lib/seo/meta.ts`**（三語 `title` + `description` 撤價，`ogTitle`/`ogDescription`/`keywords` 不動）

```ts
  'zh-Hant': {
    title: 'AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 品牌・網紅・矩陣團隊專屬',
    description: '專業 AI 人像工作室。為品牌廣告主、網紅自媒體、多帳號矩陣團隊打造專屬 LoRA 形象人物與 AI 影片內容，依客群需求客製方案，Telegram 即時諮詢。',
    // ogTitle / ogDescription / ogLocale / keywords 不變
```

```ts
  'zh-Hans': {
    title: 'AI 人像工作室｜LoRA 训练・AI 写真・视频人像生成 — 品牌・网红・矩阵团队专属',
    description: '专业 AI 人像工作室。为品牌广告主、网红自媒体、多账号矩阵团队打造专属 LoRA 形象人物与 AI 视频内容，依客群需求定制方案，Telegram 即时咨询。',
```

```ts
  'en': {
    title: 'AI Portrait Studio | LoRA Training・AI Headshots・Video Portraits — For Brands, Creators & Account Networks',
    description: 'Professional AI Portrait Studio. Custom LoRA characters and AI video content for brands & advertisers, creators & agencies, and multi-account teams. Tailored solutions, instant Telegram consultation.',
```

- [ ] **Step 6：改 `index.html`**（靜態 head 預設值 = zh-Hant；只改 `<title>` 與 `<meta name="description">`）

```html
    <title>AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 品牌・網紅・矩陣團隊專屬</title>
    <meta name="description" content="專業 AI 人像工作室。為品牌廣告主、網紅自媒體、多帳號矩陣團隊打造專屬 LoRA 形象人物與 AI 影片內容，依客群需求客製方案，Telegram 即時諮詢。" />
```

> **og:title / og:description 刻意不動（codex Medium #2 裁決：保留）。** 理由：(1) `index.html` 與 `meta.ts` 的 og 兩行本就**無任何價格 / 舊方案名**，已符合 spec 成功標準 6「不再含價格或舊方案名」；(2) og 現值「專業 AI 人像生成與影片製作」語意正確、非誤導；(3) 改成客群導向屬「額外文案優化」，超出本次「撤價」scope。**撤價驗收以 §6 負向 grep 為準，og 不在撤價必改範圍。** （spec §3.5(b) 原列 og 同步，已於本裁決收斂為刻意例外。）

- [ ] **Step 7：全綠檢查 + commit**

```bash
pnpm typecheck && pnpm lint && pnpm test
git add src/lib/seo/jsonld.ts src/lib/seo/meta.ts index.html tests/lib/seo/jsonld.test.ts
git commit -m "feat(seo): drop pricing from JSON-LD/meta/index.html, switch to audience-based OfferCatalog"
```

Expected：全綠。

---

## Task 5：刪死碼（舊 i18n / 舊資料 / 舊元件 / currency / CSS）

**Files:**
- Modify: `src/i18n/messages.zh-hant.ts`、`messages.zh-hans.ts`、`messages.en.ts`（刪 `pricing` + `addons` 兩整塊）
- Modify: `src/data/content.ts`（刪價格資料 + 型別）
- Delete: `src/components/PlanCard.tsx`、`src/components/AddOnCard.tsx`、`src/components/AddOnsCarousel.tsx`
- Delete: `src/lib/useCurrency.ts`、`src/lib/currency.ts`
- Delete: `tests/components/PlanCard.test.tsx`、`tests/components/AddOnsCarousel.test.tsx`、`tests/lib/useCurrency.test.tsx`
- Modify: `src/styles/globals.css`（刪 `.addon-card-cq*`）

> 順序很重要：先確認沒人引用，再刪。此時 `Audiences` 已不依賴任何被刪項。

- [ ] **Step 1：刪三語 i18n 的 `pricing` 與 `addons` 兩整塊**（從 `pricing: {` 到對應 `},`、`addons: {` 到對應 `},` 全刪）。`audiences` 區塊保留。

- [ ] **Step 2：刪 `src/data/content.ts` 價格相關**：移除 `DemoImage` 以外的 `PlanTier`/`PLAN_PRICES`/`PLAN_HIGHLIGHTED`/`DISCOVERY_PRICE`、整段 `AddOnKey`/`AddOnTagVariant`/`AddOnUnitKey`/`AddOnCardData`/`ADDON_CARDS`。保留 `TELEGRAM_URL`、`DEMO_IMAGES`、`AudienceKey`/`AudienceMeta`/`AUDIENCES`。

- [ ] **Step 3：刪元件與其測試**

```bash
git rm src/components/PlanCard.tsx src/components/AddOnCard.tsx src/components/AddOnsCarousel.tsx \
       src/lib/useCurrency.ts src/lib/currency.ts \
       tests/components/PlanCard.test.tsx tests/components/AddOnsCarousel.test.tsx tests/lib/useCurrency.test.tsx
```

- [ ] **Step 4：刪 `src/styles/globals.css` 的 `.addon-card-cq*`** — 移除註解 `/* AddOnCard container query ... */` 連同 `.addon-card-cq { ... }` 與 `@container (min-width: 330px) { .addon-card-cq-bottom ... }` 整段（約 78-95 行）。

- [ ] **Step 5：全域確認無 dangling 引用**

Run:
```bash
grep -rnE "PlanCard|AddOnCard|AddOnsCarousel|useCurrency|convertTwd|PLAN_PRICES|PLAN_HIGHLIGHTED|DISCOVERY_PRICE|ADDON_CARDS|t\.pricing|t\.addons|addon-card-cq|pricingCta" src tests scripts index.html
```
Expected：**無任何輸出**（全數清乾淨）。若有命中，逐一修掉。

- [ ] **Step 6：全綠檢查 + commit**

```bash
pnpm typecheck && pnpm lint && pnpm test
git add -A
git commit -m "chore(audiences): remove dead pricing code (PlanCard/AddOn/currency/i18n/CSS)"
```

Expected：全綠。

---

## Task 6：build + prerender 驗收（正向 + 負向 grep guard）

**Files:** 無原始碼變更（驗收 task）

- [ ] **Step 1：build**

Run: `pnpm build`
Expected：成功，無 TypeScript / Vite 錯誤，產出 `dist/zh-Hant/index.html`、`dist/zh-Hans/index.html`、`dist/en/index.html`。

- [ ] **Step 2：prerender 驗證（如 build 未自動跑）**

Run: `pnpm verify-prerender`
Expected：PASS（hreflang / canonical / og 等規則；`section#pricing` 仍存在）。

- [ ] **Step 3：正向 grep — 新文案存在**

Run:
```bash
grep -l '服務對象' dist/zh-Hant/index.html && \
grep -l '品牌・廣告主' dist/zh-Hant/index.html && \
grep -l '我们服务这三类客户' dist/zh-Hans/index.html && \
grep -l 'We serve these three types of clients' dist/en/index.html
```
Expected：四條都命中（印出檔名）。

- [ ] **Step 4：負向 grep guard — 不含任何舊價格 / 舊方案字串**

Run（任一命中即視為失敗；pattern 擴充自 codex Medium #4 — 收斂 `¥` 並補具體價格數字與幣別碼）:
```bash
if grep -rEn 'Mini Launch|Standard Launch|Pro Launch|Discovery Pack|加購服務|加购服务|Add-ons|add-ons|9 種加購|9 add-ons|NT\$|US\$|约 ¥|¥[0-9]|TWD|USD|CNY|12,800|78,800|168,800|3,500|priceRange|priceCurrency|從 NT\$|From US\$' \
   dist/zh-Hant/index.html dist/zh-Hans/index.html dist/en/index.html; then
  echo "❌ FAIL：偵測到殘留舊價格 / 舊方案字串"; exit 1
else
  echo "✅ PASS：三語 HTML 無殘留舊價格 / 舊方案字串"
fi
```
Expected：`✅ PASS`。

- [ ] **Step 5：commit（若 build 產物需追蹤則略過；本專案 dist 通常不提交）** — 無原始碼變更則本 task 不需 commit。

---

## Task 7：dev server + gemini 視覺 review（強制流程）

**Files:** 視 gemini 意見可能回頭微調 `AudienceCard.tsx` / `Audiences.tsx` / `globals.css`

- [ ] **Step 1：啟動 dev server** — Run: `pnpm dev`（背景），等 `http://localhost:5173/ai-portrait-studio-site/zh-Hant/` 可訪問。

- [ ] **Step 2：用 playwright-cli 截圖** — 至少 desktop（1280）+ mobile（375）各一張，聚焦 `#pricing` 區塊，存 `/tmp/ui-review/audiences-desktop.png`、`/tmp/ui-review/audiences-mobile.png`。建議三語各截或至少繁中 + EN（驗證長文字 RWD）。

- [ ] **Step 3：交 gemini 視覺 review**（依 CLAUDE.md 強制流程）— prompt 含截圖路徑 + 本次變動重點（方案改服務對象、痛點/解法分區、第三卡特殊服務 badge），請 gemini 從排版 / 間距 / 對齊 / 字級色彩對比 a11y / RWD 破版 / 互動元素辨識度 給意見，只回意見不改 code。

- [ ] **Step 4：處理 review 意見** — 套 `receiving-code-review` 精神逐條評估；有修改則重新截圖再 review 一次，直到收斂或使用者同意現狀。

- [ ] **Step 5：回報使用者** — 變更檔案清單 + 最終截圖路徑 + gemini review 摘要（採納 / 略過哪幾條與原因）。

---

## Self-Review（plan 對 spec 覆蓋檢查）

- **spec §1.3 成功標準 1（三卡渲染）** → Task 1（元件）+ Task 2（section + 測試）✅
- **成功標準 2（第三卡 gold badge + CTA）** → Task 1 Step 5 + Task 2 Step 1 測試 ✅
- **成功標準 3（三語 i18n）** → Task 1 Step 1 ✅
- **成功標準 4（連動文案）** → Task 3 ✅
- **成功標準 5（#pricing 錨點不變）** → Task 2 Step 3 實作 + Step 1 測試 ✅
- **成功標準 6（SEO 撤價一致）** → Task 4 ✅
- **成功標準 7（死碼移除）** → Task 5（含 Step 5 dangling 檢查）✅
- **成功標準 8（全綠 + build + 負向 grep）** → 各 task commit gate + Task 6 ✅
- **成功標準 9（gemini 視覺驗收）** → Task 7 ✅
- **spec §7 回滾** → 全程在 `worktree-audiences-section` 分支、分階段 commit，符合「SEO/UI 成套」原則（Task 4 SEO 與 Task 2/3 UI 雖分 commit，但同分支未合併前可整體 revert）✅
- **Placeholder scan**：無 TBD / TODO；每個 code step 均含完整程式碼 ✅
- **Type consistency**：`AudienceKey`（content.ts）↔ `ICONS` key（Audiences.tsx）↔ `audiences.cards` key（i18n）三處皆 `brand`/`creator`/`operator`；`AudienceMeta.special`/`highlighted` ↔ Audiences.tsx 讀取一致；`AudienceCard` props ↔ 呼叫端一致 ✅

**已知執行注意**：Task 2 與 Task 3 必須**同一 commit**（App 換 section 後 smoke 立即失效），執行 subagent 請把兩者打包成一次 codex 任務。
