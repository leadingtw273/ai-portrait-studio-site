# AI Portrait Studio Site —「服務對象」區塊改版設計規格

- **日期**：2026-06-08
- **狀態**：Spec v2，codex review 完（6 條意見，採納 5 駁回 1）、待 user review
- **撰寫**：Claude Code (Opus 4.8) + 使用者 leadi + Codex (codex-cli 0.132) review
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
6. **SEO 撤價一致（含 head meta）**：`src/lib/seo/meta.ts`（SEO_META 三語 title/description）與 `index.html` 靜態 head 不再含任何價格或舊方案名；`buildProfessionalServiceJsonLd` 不再輸出帶價 Offer 與 `priceRange`，改三客群服務目錄（不帶價、補 `itemOffered: Service`）。**頁面可見內容、prerender head、structured data 三者一致撤價。**
7. **死碼移除乾淨**：PlanCard / AddOnCard / AddOnsCarousel / useCurrency / currency.ts 及其 import、`globals.css` 的 `.addon-card-cq*` class 全數移除，無 dangling import / dead CSS。
8. **全綠驗收**：`pnpm typecheck`、`pnpm lint`、`pnpm test` 全通過；`pnpm build` 成功；prerender HTML 含新文案（如「品牌・廣告主」「服務對象」），且**三語 HTML / head / JSON-LD 不含舊價格與舊方案字串**（負向 grep，見 §6）。
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

### 3.5 SEO 撤價：head meta + JSON-LD（codex High #1 補強）

撤價必須三處一致 —「**頁面可見內容**」「**prerender head meta**」「**structured data**」缺一不可。原 spec 只列 JSON-LD，漏了 head meta，本節補上。

**(a) `src/lib/seo/meta.ts`（SEO_META 三語 title / description）**

現況含舊價格與舊方案名，需改寫為客群導向（`ogTitle` / `ogDescription` 本來就無價格，維持不動；僅改 `title` + `description`）：

| lang | 欄位 | 新值（草案，實作可微調） |
|---|---|---|
| zh-Hant | title | `AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 品牌・網紅・矩陣團隊專屬` |
| zh-Hant | description | `專業 AI 人像工作室。為品牌廣告主、網紅自媒體、多帳號矩陣團隊打造專屬 LoRA 形象人物與 AI 影片內容，依客群需求客製方案，Telegram 即時諮詢。` |
| zh-Hans | title | `AI 人像工作室｜LoRA 训练・AI 写真・视频人像生成 — 品牌・网红・矩阵团队专属` |
| zh-Hans | description | `专业 AI 人像工作室。为品牌广告主、网红自媒体、多账号矩阵团队打造专属 LoRA 形象人物与 AI 视频内容，依客群需求定制方案，Telegram 即时咨询。` |
| en | title | `AI Portrait Studio \| LoRA Training・AI Headshots・Video Portraits — For Brands, Creators & Account Networks` |
| en | description | `Professional AI Portrait Studio. Custom LoRA characters and AI video content for brands & advertisers, creators & agencies, and multi-account teams. Tailored solutions, instant Telegram consultation.` |

**(b) `index.html`（靜態 head 預設值，= zh-Hant）**

`<title>`、`<meta name="description">`、`<meta property="og:title/og:description">` 的舊價格版本，同步換成上表 zh-Hant 新值。`inject-seo-meta.ts` 於 prerender 時用 SEO_META 逐語覆蓋，無硬編價格字串（已確認），故改 (a) 即連動三語 prerender head。

**(c) `src/lib/seo/jsonld.ts`**

- 移除 `import { PLAN_PRICES, DISCOVERY_PRICE }`；型別移除 `priceRange` 與帶價 `Offer` 欄位。
- `hasOfferCatalog` 改三客群「服務」目錄，`itemListElement` 每項 `@type: 'Offer'` **不帶 `price` / `priceCurrency`**，並補 **`itemOffered: { '@type': 'Service', name, serviceType }`**（codex Medium #3：語意更精準、避免被理解成殘缺價格 offer）：
  - 品牌・廣告主 服務方案 / Brand & Advertiser Solutions
  - 網紅・自媒體 服務方案 / Creator & Agency Solutions
  - 多帳號矩陣 專屬產線 / Multi-account Matrix Dedicated Line
- `priceRange` 從型別與輸出刪除。`OfferCatalog.name` 改「服務對象」/「Service Audiences」。
- `verify-prerender.ts` 僅斷言 `hasOfferCatalog` key 存在（已確認、不斷言價格），保留該 key 即不破。
- 同步更新 `tests/lib/seo/jsonld.test.ts`：移除價格 / priceRange 斷言，改驗證新服務名稱、`itemOffered.@type === 'Service'`、且輸出**不含** `price` / `priceCurrency` / `priceRange`。

---

## 4. 檔案變更地圖

**改：**
- `src/sections/Pricing.tsx` → 重寫為三張 AudienceCard（檔名改 `Audiences.tsx`、export `<Audiences/>`；連帶 `src/App.tsx` import 與用法）。section `id="pricing"` **維持不變**。
- `src/data/content.ts` → 移除 `PLAN_PRICES / PLAN_HIGHLIGHTED / DISCOVERY_PRICE / ADDON_CARDS` 及相關 type；新增 `AUDIENCES` 結構（key + icon flag + highlighted/badge flag）。保留 `TELEGRAM_URL`、`DEMO_IMAGES`。
- `src/i18n/messages.zh-hant.ts` / `messages.zh-hans.ts` / `messages.en.ts` → `pricing` + `addons` 區塊換成 `audiences`；更新 §3.4 四處連動文案。
- `src/lib/seo/jsonld.ts` → 依 §3.5(c) 改寫。
- `src/lib/seo/meta.ts` → 依 §3.5(a) 改三語 title/description（撤價）。**（codex High #1 補）**
- `index.html` → 依 §3.5(b) 改靜態 head title/description/og（撤價）。**（codex High #1 補）**
- `src/App.tsx` → import `Audiences` 取代 `Pricing`。

**新增：**
- `src/components/AudienceCard.tsx`

**刪除（死碼 + 對應測試）：**
- `src/components/PlanCard.tsx` + `tests/components/PlanCard.test.tsx`
- `src/components/AddOnCard.tsx`
- `src/components/AddOnsCarousel.tsx` + `tests/components/AddOnsCarousel.test.tsx`
- `src/lib/useCurrency.ts` + `tests/lib/useCurrency.test.tsx`
- `src/lib/currency.ts`
- `src/styles/globals.css` 的 `.addon-card-cq` / `.addon-card-cq-bottom` / `.addon-card-cq-price`（約 79-88 行）**（codex Medium #4 補）**

**測試連動更新：**
- `tests/sections/Pricing.test.tsx` → 改寫為 audiences 測試（檔名可改 `Audiences.test.tsx`）；新增斷言：三張卡、每卡 4 pain + 4 solution、第三卡 gold「特殊服務」badge、三個 CTA 都連 `TELEGRAM_URL` 且 `target="_blank"` / `rel="noopener noreferrer"`、頁面不出現任何價格 / 舊方案字串。
- `tests/i18n.test.tsx` → **檔案存在**（codex Medium #5 誤判為不存在，已駁回；此檔仍需對齊新 shape）。
- `tests/sections.smoke.test.tsx` → 若斷言舊區塊內容需更新
- `tests/lib/seo/jsonld.test.ts` → 依 §3.5(c)
- `tests/sections/{Nav,Hero,Demo,FinalCTA}.test.tsx` → 若斷言舊字串（方案 / 精選方案 / 方案諮詢 / 哪個方案）需更新
- `scripts/prerender.ts` / `scripts/verify-prerender.ts` → 已確認：prerender 等 `section#pricing`（id 保留即可）、verify 僅斷言 `hasOfferCatalog` key 存在、無舊文案 / 價格斷言，故不需改腳本邏輯，只需確認不依賴被刪 export。

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
3. **正向 grep**：三語 prerender HTML 含「服務對象」「品牌・廣告主」「網紅」「專業操盤手」等新文案。
4. **負向 grep（codex High #2 補）**：三語 HTML（含 head meta 與 JSON-LD）**不得**出現以下任一舊字串 —
   `Mini Launch`、`Standard Launch`、`Pro Launch`、`Discovery Pack`、`加購服務` / `add-ons` / `9 種加購` / `9 add-ons`、`NT$`、`US$`、`¥`、`priceRange`、`priceCurrency`、`從 NT$ 3,500`、`From US$`、`约 ¥800`。
   建議實作為一條 grep guard（任一命中即 fail）。
5. dev server 啟動，playwright-cli 截 desktop + mobile 圖，交 gemini 視覺 review（強制流程），意見收斂。
6. 回報使用者：變更檔案清單 + 最終截圖 + gemini review 摘要。

---

## 7. 回滾策略（codex Medium #6 補）

- **隔離單位**：全部變更在 git worktree `worktree-audiences-section` 分支上進行，不碰主 checkout；未合併前主線零影響。
- **單一可回滾單位**：實作以連貫 commit 收斂（或最終 squash），確保「撤價」是一個原子變更，避免只回 UI 卻留下 head meta / JSON-LD / CI 破洞。
- **最小回滾集合**（若 SEO / prerender 上線後出問題需局部回復）：
  1. `id="pricing"` 全程保留 → 錨點 / snap / sitemap 永不需回滾。
  2. 回復順序：`messages.*`（pricing/addons 區塊）→ `Pricing.tsx` + `App.tsx` import → `jsonld.ts` + `meta.ts` + `index.html` → 復原刪除的元件 / currency / CSS。
  3. SEO 與 UI 必須**成套回滾**（同一 commit），不可只回其一造成頁面與 structured data 再度不一致。
- **驗證回滾**：回滾後重跑 §6 全部驗收（含正向 + 負向 grep）確認狀態一致。

---

## 8. 實作順序建議（codex 其他意見，供 writing-plans 參考）

1. 先改 `messages.zh-hant.ts`（source shape，定義新 `audiences` 結構 + 連動文案 + 移除 pricing/addons）。
2. 同步 `messages.zh-hans.ts` / `messages.en.ts` 對齊新 shape（否則 `Messages` 型別與 typecheck 會噴大量中間錯誤）。
3. 新增 `AudienceCard.tsx`、改 `content.ts`（新增 AUDIENCES、移除價格資料）。
4. 改 `Pricing.tsx` → `Audiences.tsx` + `App.tsx` import。
5. 改 SEO：`jsonld.ts` + `meta.ts` + `index.html`。
6. 刪死碼（元件 / currency / CSS）+ 更新 / 改寫測試。
7. 跑全綠驗收 → build → 正負向 grep → gemini 視覺 review。
