# AI Portrait Studio Site —「服務對象」區塊改版設計規格

- **日期**：2026-06-08
- **狀態**：Spec v1，待 codex review → user review
- **撰寫**：Claude Code (Opus 4.8) + 使用者 leadi
- **前情**：`2026-05-21-landing-site-design.md`（landing v1）、`2026-05-26-seo-improvement-design.md`（SEO 三語）
- **下一步**：user review → writing-plans skill 產出 implementation plan

---

## 1. 目的與成功標準

### 1.1 目的

把現有 `#pricing` 區塊從「**以價格為主軸**」（三方案卡 + Discovery 試做卡 + 加購 9 卡 carousel，公開定價 NT$3,500〜168,800）重新定位為「**以客群痛點為主軸**」的服務對象區塊：呈現三類目標客戶、各自的痛點與我們的解法，全部走諮詢導向 CTA（Telegram），不顯示任何價格。

### 1.2 決策前提（本次對話鎖定）

| 維度 | 決策 | 影響 |
|---|---|---|
| **價格內容去留** | **完全取代** | 移除三方案卡 / Discovery / 加購 carousel；整個 `#pricing` 改為三張服務對象卡 |
| **連動文案** | **Nav + 連動文案一起改** | Nav「方案」→「服務對象」，Hero / Demo / FinalCTA 提及「方案」的字眼改客群導向 |
| **i18n 範圍** | **三語都做** | 繁中用使用者文案，簡中 / EN 由 Claude 對應翻譯（i18n 強型別共用 shape，三語必須同步） |
| **SEO JSON-LD** | **改成不帶價** | `OfferCatalog` 改三客群服務（不帶 price）、移除 `priceRange`，與頁面一致 |
| **死碼清理** | **刪除** | 撤掉 PlanCard / AddOnCard / AddOnsCarousel / currency 相關死碼 |

### 1.3 成功標準

1. **`#pricing` 區塊渲染三張服務對象卡**：品牌・廣告主 / 網紅・經紀・自媒體 / 專業操盤手・多帳號矩陣，每卡含名稱 + 客群描述 + 痛點 ×4 + 解法 ×4 + CTA。
2. **第三類卡視覺差異化**：金色「特殊服務」badge + highlighted 邊框（沿用既有 `gold` variant），CTA 為「洽談專屬產線」；前兩卡 CTA 為「聊聊我的需求」。
3. **三語 i18n 全部到位**：繁中 / 簡中 / EN 三檔結構一致（DeepString shape 通過），無殘留舊方案 / 加購文字。
4. **連動文案更新**：Nav、Hero secondary CTA、Demo pricingCta、FinalCTA title 四處按 §3.4 提案更新（三語）。
5. **錨點不變**：section `id="pricing"` 維持，nav `href="#pricing"`、App `SNAP_RULES`、SEO hash 不受影響。
6. **SEO JSON-LD 與頁面一致**：`buildProfessionalServiceJsonLd` 不再輸出帶價 Offer 與 `priceRange`，改三客群服務目錄（不帶價）。
7. **死碼移除乾淨**：PlanCard / AddOnCard / AddOnsCarousel / useCurrency / currency.ts 及其 import 全數移除，無 dangling import。
8. **全綠驗收**：`pnpm typecheck`、`pnpm lint`、`pnpm test` 全通過；`pnpm build` 成功；prerender HTML 含新文案（如「品牌・廣告主」「服務對象」）。
9. **視覺驗收**：dev server 截圖（desktop + mobile）經 gemini 視覺 review，排版 / 對齊 / RWD / 對比度無重大問題。

### 1.4 不在範圍

- ❌ 價格策略本身（撤價是既定決策，不討論該不該撤）
- ❌ 新增 analytics / 表單（CTA 仍直連 Telegram，沿用 v1）
- ❌ Hero / Demo 區塊的版面或素材改動（僅動其中提及「方案」的文字）
- ❌ 既有 scroll blur / snap 機制（不動）

---

## 2. 文案內容（繁中 source of truth）

### 2.1 區塊標題

- **badge**：服務對象
- **title**：我們服務這三類客戶
- **subtitle**：以上這些專業能力，會依不同客群的需求，組成完全不同的解決方案

> 註：subtitle「以上這些專業能力」承接前一個 Demo 區（作品展示：LoRA 人像 + 影片生成），作為過場橋接句，語意成立。

### 2.2 卡一：品牌・廣告主

- **客群描述**：需要形象與廣告素材的企業主、電商與在地商家
- **你是不是遇到——**
  - 找模特兒、租攝影棚、外拍一次就燒掉大筆預算
  - 想換季、換檔期就得重拍，素材更新永遠跟不上
  - 商品想要代言形象，卻請不起長期代言人
  - 投廣告需要大量不同版本素材做 A/B 測試
- **我們怎麼幫你——**
  - 打造專屬品牌形象人物，一次訓練、長期沿用
  - 同一張臉產出無限場景與服裝，換檔期不必重拍
  - 商品形象寫真 + 代言視覺，成本僅傳統外拍的一小部分
  - 批量產出多版本廣告素材，加速投放與測試
- **CTA**：聊聊我的需求

### 2.3 卡二：網紅・經紀・自媒體

- **客群描述**：想靠影音內容變現的創作者、經紀公司與 MCN
- **你是不是遇到——**
  - 內容產量永遠追不上平台演算法的胃口
  - 真人出鏡有檔期、肖像與隱私的層層限制
  - 想經營虛擬人設，卻缺技術與穩定產線
  - 跨平台要做差異化內容，人力根本做不完
- **我們怎麼幫你——**
  - 建立專屬虛擬人物與 LoRA，內容產量直接拉滿
  - 人像 + 影片一條龍，短影音與貼文素材穩定供應
  - 從人設、風格表到發布策略，幫你把虛擬 IP 養起來
  - 跨平台差異化內容批量產出，一人也能做出團隊的量
- **CTA**：聊聊我的需求

### 2.4 卡三：專業操盤手・多帳號矩陣〔特殊服務〕

- **客群描述**：需要同時經營多組虛擬人設與品牌帳號的專業團隊
- **你是不是遇到——**
  - 要同時養多組人設，產製量級遠超一般工作室
  - 每組人設都要長相一致、風格各自獨立、不能撞臉
  - 素材需求是持續性的，產線一停內容就斷
  - 一般外包無法配合保密與專屬產製的需求
- **我們怎麼幫你——**
  - 為每組人設訓練獨立 LoRA，角色一致、互不混淆
  - 規模化人像 + 影片產線，支援高頻、大批量交付
  - 人設、風格與場景可系統化區隔與管理
  - 專屬保密合作模式，依產量級距客製專案
- **CTA**：洽談專屬產線
- **特殊標記**：金色「特殊服務」badge

### 2.5 簡中 / EN 翻譯

簡中 / EN 由 Claude 對應翻譯，保留原文語氣（痛點口語化、解法俐落）。專有名詞（LoRA、MCN、A/B 測試、IP）維持原樣。EN 痛點 / 解法用平行句式，標題用「Are you facing—」/「Here's how we help—」之類對應。CTA：聊聊我的需求 → 聊聊我的需求 / Let's talk；洽談專屬產線 → 洽谈专属产线 / Discuss a dedicated line。（實際譯文於實作時定稿，spec 鎖定結構與語氣原則。）

---

## 3. 設計細節

### 3.1 版面結構

```
[服務對象]  ← badge
我們服務這三類客戶                              ← title
以上這些專業能力，會依不同客群的需求，組成完全不同的解決方案  ← subtitle

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 📣 品牌・廣告主│  │ 🎬 網紅・自媒體│  │ ▦ 專業操盤手  │ ◀ 金色「特殊服務」+ highlight
│ 客群描述       │  │ 客群描述       │  │ 客群描述       │
│ 你是不是遇到— │  │ ...           │  │ ...           │ ◀ 痛點區（muted 子面板）
│ – 痛點 ×4     │  │              │  │              │
│ 我們怎麼幫你— │  │ ...           │  │ ...           │ ◀ 解法區（brand ✓）
│ ✓ 解法 ×4     │  │              │  │              │
│ [聊聊我的需求] │  │ [聊聊我的需求] │  │ [洽談專屬產線] │ ◀ CTA → Telegram
└──────────────┘  └──────────────┘  └──────────────┘
```

- **RWD**：沿用現有方案卡 grid pattern — `grid-cols-1 desktop:grid-cols-3`，tablet 限寬置中、desktop 三欄 `items-stretch` 等高。
- **區塊高度**：移除原 `min-h-screen ... justify-center` 強制置中（三張長卡會溢出），改自然高度 + `py-16 tablet:py-24`。
- **痛點 vs 解法 視覺分流**：
  - 痛點：muted 子面板（如 `bg-surface/40` 或暗底圓角區），標題「你是不是遇到——」暖灰調，每點用低調標記（`—` dash 或 `HelpCircle`，非 Check，避免與解法混淆）。
  - 解法：標題「我們怎麼幫你——」brand 調，每點 `Check` icon（brand-300，沿用既有 deliverables 樣式）。
- **第三類差異化**：沿用既有 `gold`（#D4AF37）badge variant + highlighted 邊框（即原 Pro Launch 金色處理），標示高階 / 專屬。
- **設計系統**：完全沿用 brand 紫、surface 卡、`rounded-2xl`、glow shadow、lucide icon，不引入新風格。

### 3.2 icon 對應（lucide-react）

| 卡 | icon |
|---|---|
| 品牌・廣告主 | `Megaphone` |
| 網紅・經紀・自媒體 | `Clapperboard` |
| 專業操盤手・多帳號矩陣 | `LayoutGrid` |

### 3.3 元件設計

**新增 `src/components/AudienceCard.tsx`**

```ts
type Props = {
  name: string
  icon?: ReactNode
  tagline?: string            // 客群描述
  painTitle: string           // 「你是不是遇到——」
  pains: ReadonlyArray<string>
  solutionTitle: string       // 「我們怎麼幫你——」
  solutions: ReadonlyArray<string>
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  badge?: { label: string; variant?: 'brand' | 'gold' }
  className?: string
}
```

- 結構與既有 `PlanCard` 同構（badge / icon-header / highlighted 邊框 / 底部全寬 CTA），降低設計風險與認知成本。
- 卡片 `flex flex-col h-full`，CTA `mt-auto` 貼底，確保三卡等高時 CTA 對齊。

### 3.4 連動文案（三語都改）

| 位置 | i18n key | 原（繁中） | 新（繁中） |
|------|----------|-----------|-----------|
| Nav | `nav.plans` | 方案 | **服務對象** |
| Hero 次要 CTA | `hero.ctaSecondary` | 方案諮詢 | **看看我們怎麼幫你** |
| Demo→Pricing 連結 | `demo.pricingCta` | 精選方案 | **看看服務對象** |
| FinalCTA 標題 | `finalCta.title` | 不確定哪個方案適合您？ | **不確定你屬於哪一類客戶？** |

簡中 / EN 對應翻譯同步更新。`nav.plans` 的 i18n key 名稱維持 `plans`（避免擴大改動面），僅改 value。

### 3.5 SEO JSON-LD（`src/lib/seo/jsonld.ts`）

- 移除 `import { PLAN_PRICES, DISCOVERY_PRICE }`，型別移除 `priceRange` 與帶價 `Offer`。
- `hasOfferCatalog` 改為三客群「服務」目錄，`itemListElement` 用 `@type: 'Offer'` 但 **不帶 `price` / `priceCurrency`**（schema.org 允許 Offer 省略價格），`name` 為三客群中文 / 英文名稱：
  - 品牌・廣告主 服務方案 / Brand & Advertiser Solutions
  - 網紅・自媒體 服務方案 / Creator & Agency Solutions
  - 多帳號矩陣 專屬產線 / Multi-account Matrix Dedicated Line
- `priceRange` 欄位：型別改為 optional 並省略輸出（或從型別刪除）。`OfferCatalog.name` 改「服務對象」/「Service Audiences」。
- 同步更新 `tests/lib/seo/jsonld.test.ts`：移除價格斷言，改驗證新服務名稱與「無 price 欄位」。

---

## 4. 檔案變更地圖

**改：**
- `src/sections/Pricing.tsx` → 重寫為三張 AudienceCard（檔名改 `Audiences.tsx`、export `<Audiences/>`；連帶 `src/App.tsx` import 與用法）。section `id="pricing"` **維持不變**。
- `src/data/content.ts` → 移除 `PLAN_PRICES / PLAN_HIGHLIGHTED / DISCOVERY_PRICE / ADDON_CARDS` 及相關 type；新增 `AUDIENCES` 結構（key + icon flag + highlighted/badge flag）。保留 `TELEGRAM_URL`、`DEMO_IMAGES`。
- `src/i18n/messages.zh-hant.ts` / `messages.zh-hans.ts` / `messages.en.ts` → `pricing` + `addons` 區塊換成 `audiences`；更新 §3.4 四處連動文案。
- `src/lib/seo/jsonld.ts` → 依 §3.5 改寫。
- `src/App.tsx` → import `Audiences` 取代 `Pricing`。

**新增：**
- `src/components/AudienceCard.tsx`

**刪除（死碼 + 對應測試）：**
- `src/components/PlanCard.tsx` + `tests/components/PlanCard.test.tsx`
- `src/components/AddOnCard.tsx`
- `src/components/AddOnsCarousel.tsx` + `tests/components/AddOnsCarousel.test.tsx`
- `src/lib/useCurrency.ts` + `tests/lib/useCurrency.test.tsx`
- `src/lib/currency.ts`

**測試連動更新：**
- `tests/sections/Pricing.test.tsx` → 改寫為 audiences 測試（檔名可改 `Audiences.test.tsx`）
- `tests/i18n.test.tsx` → 對齊新 shape
- `tests/sections.smoke.test.tsx` → 若斷言舊區塊內容需更新
- `tests/lib/seo/jsonld.test.ts` → 依 §3.5
- `tests/sections/{Nav,Hero,Demo,FinalCTA}.test.tsx` → 若斷言舊字串（方案 / 精選方案 / 方案諮詢 / 哪個方案）需更新
- `scripts/prerender.ts` / `scripts/verify-prerender.ts` → 確認不依賴被刪 export；若 verify 規則斷言舊文案（如 `grep "Mini Launch"`）需改為新文案（如「品牌・廣告主」/「服務對象」）

---

## 5. 風險與緩解

| 風險 | 緩解 |
|---|---|
| i18n 三語 shape 不同步 → build 失敗 | 三檔同一個 PR 同步改，`pnpm typecheck` 為硬性 gate |
| 刪除 currency / PlanCard 後有 dangling import | 全域 grep 確認無殘留引用後才刪；typecheck + lint 把關 |
| `verify-prerender.ts` 斷言舊文案（如 Mini Launch）→ build/verify 紅 | spec §4 已列入，實作時改為新文案斷言 |
| JSON-LD 改動破壞既有 SEO 驗收（SEO spec 成功標準 1） | SEO spec 的 `grep "Mini Launch"` 驗收同步改為新文案；JSON-LD validator 上線後 manual 重跑 |
| 三張長卡在 mobile 過長、閱讀疲勞 | 痛點 / 解法分區 + muted 面板做視覺節奏；gemini 視覺 review 把關 |
| 撤價後 SEO 失去 priceRange rich data | 既定決策；改不帶價服務目錄維持 ProfessionalService 語意完整 |

---

## 6. 驗收方式

1. `pnpm typecheck && pnpm lint && pnpm test` 全綠。
2. `pnpm build` 成功；`pnpm verify-prerender`（如適用）通過。
3. `curl` / grep prerender 後的三語 HTML，含「服務對象」「品牌・廣告主」等新文案、不含「Mini Launch」「加購服務」等舊文案。
4. dev server 啟動，playwright-cli 截 desktop + mobile 圖，交 gemini 視覺 review（強制流程），意見收斂。
5. 回報使用者：變更檔案清單 + 最終截圖 + gemini review 摘要。
