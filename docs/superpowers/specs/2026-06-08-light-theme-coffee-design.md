# AI Portrait Studio Site — 亮色系 × 咖啡色 簡約專業改版設計規格

- **日期**：2026-06-08
- **狀態**：Spec v2，codex review 完（9 條意見全採納）、待 user review
- **撰寫**：Claude Code (Opus 4.8) + 使用者 leadi + Codex (codex-cli) review
- **前情**：`2026-06-08-audiences-section-design.md`（服務對象改版，已上線 main）
- **參考**：[madebypan.com](https://madebypan.com/)（暖白底 + 近黑字 + 襯線大標 + 留白 editorial 簡約）
- **下一步**：user review → writing-plans

---

## 1. 目的與成功標準

### 1.1 目的

把整站視覺從「**深紫科技風**（深色底 `#0E0B1F` + 品牌紫 + glow 陰影 + 玻璃感 + 深色 hero 大圖 + 捲動毛玻璃 overlay）」重塑為「**亮色系・簡約・專業**（暖白底 + 咖啡色 primary + 留白 + 襯線大標 + 極淺紋理背景）」，並建立 **CSS 變數 design token 架構**，讓未來新增暗色主題只需補一組 token 值、不需再改元件。

### 1.2 決策前提（本次 brainstorm 鎖定）

| 維度 | 決策 |
|---|---|
| 色系 | 亮色優先；用 CSS 變數 token 鋪好架構，**現在只出亮色、不做切換 UI / dark 值**（預留 `[data-theme="dark"]` 空區塊） |
| Primary | **Mocha 中咖啡** `#6F4E37`（hover `#5C3F2C`） |
| 背景底 | 暖奶油白 `#F5F1EB` |
| 卡片面 | 暖白 `#FCFAF6`（比底色亮一階、靠柔陰影+細框分層） |
| 文字 | 近黑棕 `#2B2420` |
| 風格 | 簡約專業（去 glow / 去玻璃 / 去深色 overlay），參考 madebypan |
| 大標字體 | **襯線**（Noto Serif TC + Georgia）套 **hero 大標 + 區塊標題**；內文與**卡片名稱維持 Inter 無襯線**（卡名之後想改襯線僅需加 `font-serif`，1 class 可逆） |
| 背景圖 | 使用者 AI 生成的「極淺咖啡水墨紋理」圖（2734×1537 PNG，中央大留白、四角極淡筆觸），取代原深色 hero 大圖；fixed、低調、不搶文字 |

### 1.3 成功標準

1. **全站亮色**：頁面底為暖白 `#F5F1EB`、文字近黑棕 `#2B2420`，無任何深色底殘留（hero / demo / pricing / footer / nav 皆亮色）。
2. **咖啡 primary**：所有原品牌紫（CTA / 連結 / icon / 強調 / badge / 邊框）改為 Mocha 咖啡色，無紫色殘留。
3. **去科技化**：移除紫色 glow 陰影、玻璃 `.glass`、`.glow-border-gradient` 紫漸層、Hero 紫 radial、**App 捲動深色毛玻璃 overlay**；改為柔和中性陰影 + 細框 + 暖白卡。
4. **CSS 變數 token 架構**：色彩全走語義 token（`--color-bg / --color-content / --color-primary …`），元件用語義類名（`bg-bg / text-content / bg-primary …`）而非散落的 `text-white / bg-brand-500`；`[data-theme="dark"]` 預留空區塊。
5. **襯線大標**：Hero 大標題與各區塊 `SectionHeader` 標題用 `font-serif`（Noto Serif TC），內文/卡名維持 Inter。
6. **背景紋理圖**：新圖納入 `src/assets/`，作為 fixed 低調背景，不影響文字可讀性。
7. **a11y 對比**（codex 實算，Med-high #2）：主文字 `#2B2420` on `#F5F1EB` = **13.6:1**（AAA）；咖啡按鈕白字 = **7.4:1**（AAA）；次要 `content-muted #6B5F57` = **5.5:1**（AA）；說明 `content-subtle` 已從 `#938678`（3.15:1 不達標）**加深為 `#74675D`（目標 ≥4.5:1，實作需實測確認）**。**關鍵小字一律用 `content` 或 `content-muted`，`content-subtle` 僅用於非關鍵說明/裝飾**。
8. **全綠驗收**：`pnpm typecheck / lint / test` 全通過；`pnpm build` 成功；prerender + verify-prerender 通過。
9. **視覺驗收**：dev server 截圖（桌面 + 手機、至少繁中）經 gemini 視覺 review，簡約專業質感與對比度收斂。

### 1.4 不在範圍

- ❌ 暗色主題的實際 token 值與切換按鈕（本次只鋪架構）
- ❌ 版面結構 / 文案 / RWD 斷點調整（純視覺主題改版，不動 layout 與內容）
- ❌ 捲動 snap 行為（`SNAP_RULES`）— 與主題無關，保留不動
- ❌ 新增動畫或互動

---

## 2. 架構：CSS 變數 token + Tailwind 語義映射

### 2.1 為何此法（vs 替代）

- ✅ **採用**：`:root` 定義亮色 CSS 變數，Tailwind `colors` 映射到 `var(--…)`，元件用語義類名。一次解決亮色重塗，且未來 dark 只需在 `[data-theme="dark"]` 填值。
- ❌ 直接改 tailwind hex：`text-white` / `text-gray-*` 是 Tailwind **內建類**，改 config 無效，且無法支援切換。
- ❌ `dark:` variant 滿版：現在就得寫兩套、違背「dark 之後再做」。

### 2.2 Token 清單（亮色 `:root`）— **RGB channel 格式（codex High #1）**

> **關鍵**：CSS 變數存「`R G B` 空格分隔的 channel 數值」（**不是** hex、不是 rgba），Tailwind 端用 `rgb(var(--…) / <alpha-value>)`，才能讓 `/opacity` modifier（`bg-bg/80`、`bg-primary/8`）正常運作。因此原本的 `primary-soft` / `primary-border` / `border` named token 不再需要——改用 alpha modifier（`bg-primary/8`、`border-primary/25`、`border-content/12`）。

```css
:root {
  --color-bg:             245 241 235;  /* #F5F1EB 頁面暖奶油白 */
  --color-surface:        252 250 246;  /* #FCFAF6 卡片暖白（比底亮一階） */
  --color-surface-hover:  240 234 225;  /* #F0EAE1 hover */
  --color-content:         43  36  32;  /* #2B2420 主文字 近黑棕（on bg 13.6:1 AAA） */
  --color-content-muted:  107  95  87;  /* #6B5F57 次要文字（on bg 5.5:1 AA） */
  --color-content-subtle: 116 103  93;  /* #74675D 說明小字（加深以達 AA ≥4.5；見 §1.3.7） */
  --color-primary:        111  78  55;  /* #6F4E37 咖啡主色（白字 7.4:1 AAA） */
  --color-primary-hover:   92  63  44;  /* #5C3F2C */
  --color-on-primary:     255 255 255;  /* 咖啡底上的白字 */
  --color-focus:          111  78  55;  /* focus ring = primary */
}

/* 預留：之後補一組對應 channel 值即有暗色主題（本次不填、不啟用） */
[data-theme="dark"] {
  /* TODO(dark): 補 --color-* channel 值即可啟用暗色主題 */
}
```

> 狀態色說明（codex Med #3）：本站無表單、CTA 皆為連結，故 **不設 error / disabled token**（YAGNI）。`link` 等同 `primary`，不另設。`focus` 設為獨立 token（=primary，未來 dark 可不同）。`::selection` 用 `rgb(var(--color-primary) / 0.16)` 底、`content` 字（於 globals.css 設定）。

### 2.3 Tailwind `colors` 映射（取代現有 colors 區塊）

```ts
colors: {
  bg:      'rgb(var(--color-bg) / <alpha-value>)',
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
```

對應類名與「軟色 / 邊框」用 alpha modifier 取代 named token：

| 用途 | 類名 |
|---|---|
| 底 / 面 | `bg-bg`、`bg-surface`、`bg-surface-hover` |
| 細邊框（取代 border-subtle） | `border-content/10` ~ `border-content/15` |
| 強邊框 | `border-content/20` |
| 咖啡描邊（取代 border-brand） | `border-primary/25` |
| 文字 | `text-content`、`text-content-muted`、`text-content-subtle` |
| 主色 | `bg-primary`、`hover:bg-primary-hover`、`text-primary` |
| 淡咖啡底（取代 brand/10~20、bg-white/4） | `bg-primary/8` ~ `bg-primary/10` |
| 咖啡底白字 | `bg-primary text-on-primary` |

### 2.4 陰影 / 字體 / 漸層（tailwind.config）

```ts
boxShadow: {
  // 取代紫 glow，改柔和中性陰影
  'soft':    '0 1px 2px rgba(43,36,32,0.06), 0 8px 24px -12px rgba(43,36,32,0.12)',
  'soft-lg': '0 2px 4px rgba(43,36,32,0.06), 0 16px 40px -16px rgba(43,36,32,0.16)',
},
fontFamily: {
  sans:  ['Inter', 'Noto Sans TC', 'system-ui', '-apple-system', 'sans-serif'],
  serif: ['"Noto Serif TC"', 'Georgia', 'Cambria', 'serif'],
},
// 移除 backgroundImage.gradient-brand（紫漸層）；如需 primary 漸層另開咖啡色版（本次預設不用）
```

`backdropBlur.card` 可保留（亮色 sticky nav 仍可用淡玻璃），但 nav 底色改亮。

---

## 3. globals.css 改動

- `:root` + `[data-theme="dark"]` token 區塊（§2.2，channel 格式）。
- `body`：`background-color: rgb(var(--color-bg))`、`color: rgb(var(--color-content))`。
- `:focus-visible` outline 色：`#A855F7` → `rgb(var(--color-focus))`。
- `::selection`（codex Med #3）：`background: rgb(var(--color-primary) / 0.16); color: rgb(var(--color-content))`。
- `.glass`（**codex Low #9 定案：保留為 legacy alias 重定義**，避免 plan 分歧、`TabSegment`/sticky 不必一次大改）：`background: rgb(var(--color-surface) / .78); border: 1px solid rgb(var(--color-content) / .1); backdrop-filter: blur(12px)`。新元件優先用語義 class。
- `.glow-border-gradient`（FinalCTA 紫漸層描邊）：改為咖啡細框白卡 util（外層 `background: rgb(var(--color-primary) / .25)` padding 1px + 內層 `background: rgb(var(--color-surface))`），或改寫 FinalCTA 直接用 `border border-content/10 bg-surface shadow-soft-lg` 不靠此 util（擇一，plan 定）。
- serif 字體於 `src/main.tsx` import（見 §5），非 globals。
- 動畫 keyframes（chevron、fade-in-slide）保留。

---

## 4. 元件語義類名替換（literal → semantic）

**通用替換規則**（套用於所有 §6 列出的檔案）：

| 現有 literal class | 改為 semantic |
|---|---|
| `text-white` | `text-content` |
| `text-gray-200` | `text-content` |
| `text-gray-300` | `text-content-muted` |
| `text-gray-400` | `text-content-muted`（最次要可 `text-content-subtle`） |
| `text-purple-200` / `text-brand-300` | `text-primary` |
| `bg-brand-500` | `bg-primary` |
| `hover:bg-brand-400` | `hover:bg-primary-hover` |
| `bg-brand-500/10~/20`（icon 圓底 / 面板 tint） | `bg-primary/8` ~ `bg-primary/10` |
| `bg-bg-base` / `bg-bg-elevated` | `bg-bg` / `bg-surface` |
| `bg-surface` / `bg-surface-hover` | 同名（已 remap 到 var） |
| `border-border-subtle` | `border-content/10` ~ `/15` |
| `border-border-brand` | `border-primary/25` |
| `shadow-glow-md/lg/xl` | `shadow-soft` / `shadow-soft-lg` |
| `bg-white/[0.04]`（Badge） | `bg-primary/8` |
| `text-amber-200/90`、`text-amber-300/70`（AudienceCard 痛點） | `text-content-muted`（痛點面板底改 `bg-primary/8`） |

**媒體 overlay 例外（codex Med #3，不套主題 token）：** `DemoCard` 影片/圖片上的 scrim 與控制項 — 播放遮罩 `bg-black/60`、duration badge、play 按鈕、`text-white`，以及圖片上的「AI 生成」chip（原 `bg-bg-base/80 text-purple-200`）— 因為**壓在媒體（任意明暗的照片/影片）之上**，保留「深色半透明 scrim + 白/淺字」的 literal 處理，**不**改成亮色 token（改了反而在深色影像上看不清）。「AI 生成」chip 改為中性深色 scrim chip（如 `bg-black/55 text-white` 或 `bg-content/70 text-on-primary`），icon 可保留 primary。此類 literal 在殘留 grep 中列為允許例外。

**特殊處理（逐檔）：**

- **`src/App.tsx`**：移除捲動驅動的深色毛玻璃 overlay（`BASE_BG_OPACITY` / `MAX_EXTRA_BG_OPACITY` / `MAX_BLUR_PX` / `progress` blur 計算 / 兩個 overlay `<div>` / 對應 useEffect）。固定背景由 `hero-bg.jpg` 改為新紋理圖（§7），低調 fixed cover。保留 `SNAP_RULES` 與 hash-scroll useEffect。最外層 `bg-bg-base text-white` → `bg-bg text-content`。
- **`src/sections/Hero.tsx`**：移除紫色 radial glow `<div>`（`rgba(168,85,247,0.25)`）。大標 `<h1>` 加 `font-serif`。次要 CTA 邊框/字色改語義。
- **`src/sections/Nav.tsx`**：`bg-bg-base/50 backdrop-blur-card` → `bg-bg/80 backdrop-blur-card`（亮色淡玻璃）；連結 `text-gray-300` → `text-content-muted`、hover `text-content`；語言鈕 active 態 `bg-brand-500/25 border-border-brand` → `bg-primary/10 border-primary/25 text-content`。
- **`src/components/SectionHeader.tsx`**：`<h2>` 加 `font-serif`；標題 `text-white` → `text-content`，副標 `text-gray-300` → `text-content-muted`。
- **`src/components/Badge.tsx`**：`bg-white/[0.04] text-purple-200` → `bg-primary/8 text-primary`；`shadow-glow-md` → `shadow-soft`；border 改 `border-primary/25`。
- **`src/sections/FinalCTA.tsx`**：`glow-border-gradient shadow-glow-xl` → 咖啡細框白卡（`border border-content/10 bg-surface shadow-soft-lg`）；標題 `text-white` → `text-content` + 可選 `font-serif`；button 紫 → 咖啡。
- **`src/components/AudienceCard.tsx`**：卡面 `bg-surface border-border-subtle` → `bg-surface border-content/10 shadow-soft`；icon 圓底 `bg-brand-500/20 border-border-brand` → `bg-primary/10 border-primary/25`；痛點面板 `bg-bg-base/40` → `bg-primary/8`、痛點標題 amber → `text-content-muted`、痛點 marker amber → `text-content-muted`；解法 check `text-brand-300` → `text-primary`；CTA 紫 → 咖啡。（`highlighted`/`gold badge` 為死碼路徑、本次不渲染，可保留；如順手清理另記。）
- **`src/sections/Demo.tsx`**：tech banner `bg-brand-500/10 border-border-brand` → `bg-primary/8 border-primary/25`；LoRA 箭頭 `text-brand-300` → `text-primary`；AI 生成 tag（壓在圖上、見媒體例外）→ 中性深 scrim chip（`bg-black/55 text-white`，icon 可 primary）；標題等文字語義化。
- **`src/components/DemoCard.tsx`** / **`TabSegment.tsx`** / **`sections/Footer.tsx`** / **`sections/ScrollToTop.tsx`**：依通用規則替換 `text-white/gray/brand/bg-brand/shadow-glow/border-border`。ScrollToTop 浮鈕紫 → 咖啡。

> 註：替換以「語義對應」為準，不是機械 1:1；emphasis 高的用 `content`，次要用 `content-muted`，說明用 `content-subtle`。實作時以視覺層次與對比為準（plan 會逐檔列出實際 class）。

---

## 5. 襯線字體

- 新增依賴 **`@fontsource/noto-serif-tc`**（CJK 襯線）。
- 在字體載入處（與既有 `@fontsource/inter`、`@fontsource/noto-sans-tc` 同一入口，`src/main.tsx`）import 需要的字重（如 400 / 600 / 700）。
- `tailwind.config` `fontFamily.serif = ['"Noto Serif TC"', 'Georgia', 'Cambria', 'serif']`。
- 套用 `font-serif`：Hero `<h1>`、`SectionHeader` `<h2>`、（可選）FinalCTA `<h3>`。**卡片名稱不套**（維持 Inter）。

---

## 6. 影響檔案地圖

**改：**
- `tailwind.config.ts`（colors → channel/`<alpha-value>` / boxShadow soft / fontFamily serif / 移除紫漸層）
- `src/styles/globals.css`（token channel 區塊 / body / focus / ::selection / glass alias / glow-border / 動畫保留）
- `package.json`（+ `@fontsource/noto-serif-tc`）
- `src/main.tsx`（import serif 字體 css）
- `index.html`（**codex Med #5**：body `bg-bg-base text-white antialiased` → `bg-bg text-content antialiased`）
- `src/App.tsx`（移除深色 overlay 機制 / 換背景圖 / 最外層 `bg-bg-base text-white` → `bg-bg text-content`）
- `src/sections/`：`Hero.tsx`、`Nav.tsx`、`Demo.tsx`、`FinalCTA.tsx`、`Footer.tsx`、`ScrollToTop.tsx`
- `src/components/`：`SectionHeader.tsx`、`Badge.tsx`、`AudienceCard.tsx`、`DemoCard.tsx`、`TabSegment.tsx`

**新增：**
- `src/assets/bg-texture.png`（使用者提供圖，從 `/mnt/c/Users/markchou/Downloads/下載.png` 複製）

**測試連動（codex Med #4）：**
- `tests/main.test.tsx`：目前 mock `@fontsource/inter`、`@fontsource/noto-sans-tc`；新增 serif import 後**必須同步加 `vi.mock('@fontsource/noto-serif-tc/...')`**（對應實際 import 的字重路徑），否則 `pnpm test` 會紅。
- 其餘測試多為文字 / role / href 斷言，預期不受色彩影響；plan 仍須確認無「斷言特定色彩 class / 斷言 App overlay 或 Hero radial 等 aria-hidden 裝飾 div」的測試（移除後若有需更新）。
- `scripts/verify-prerender.ts`：不涉色彩，預期不需改。

---

## 7. 背景圖處理

- 來源：`/mnt/c/Users/markchou/Downloads/下載.png`（2734×1537 PNG，中央大留白、左上/右下角極淡咖啡水墨筆觸）。
- 複製到 `src/assets/bg-texture.png`，於 `App.tsx` 以 `import` 方式引用（Vite 會 hash + 進 dist）。
- 用法：最底層 `fixed inset-0 bg-cover bg-center`，底色 `var(--color-bg)`；圖本身已夠淺，可直接鋪或加極輕 opacity（~0.6–0.8）確保文字區對比。**移除**原 scroll blur/overlay。
- 生圖提示詞（已交付，存查）：暖白底 `#F5F1EB` + 極淡咖啡 `#6F4E37` 抽象筆觸、中央大留白、低對比、無主體無文字。

---

## 8. 風險與緩解

| 風險 | 緩解 |
|---|---|
| 散落 literal class 漏改 → 亮底上殘留白字/紫色 | 全域 grep guard（`text-white\|text-gray-\|brand-\|glow\|border-border-\|purple-\|amber-\|bg-bg-`）在完成後應收斂到 0；逐檔 review + gemini 視覺 review |
| 對比度不足（咖啡按鈕白字、次要文字） | token 值已按 WCAG 估算；gemini review 把關；必要時微調 `content-muted/subtle` |
| 移除 App overlay 破壞既有測試 / hash-scroll | plan 先確認無測試斷言 overlay；保留 snap/hash useEffect |
| serif CJK 字重檔案增大 transfer | 只 import 必要字重（400/600/700）；prerender 不受影響 |
| 背景圖太搶或文字壓不住（codex Low #8） | 圖中央近純色大留白、hero 文字置中落在留白區；**所有文字區塊/卡片一律坐在 `bg-surface` 不透明面或淡遮罩上保底**，不單靠視覺 review；hero 直接壓圖的文字由 gemini 檢查局部對比 |
| 字體 FOUT / serif mock（codex Med #4） | 只 import 必要字重；`tests/main.test.tsx` 同步加 serif mock |
| dark token 預留但未驗證 | 本次明確 out of scope，只留空 `[data-theme="dark"]` 區塊與 TODO |

---

## 9. 驗收方式

1. `pnpm typecheck && pnpm lint && pnpm test` 全綠。
2. `pnpm build` 成功；prerender + `pnpm verify-prerender` 通過。
3. **殘留 grep（codex Med #6 擴大 scope + pattern + 例外）**：掃 `src index.html tailwind.config.ts src/styles/globals.css`，pattern：
   ```
   grep -rEn "text-brand-|stroke-brand-|border-brand-|bg-brand-|from-brand-|to-brand-|brand-(300|400|500|accent)|purple-|text-amber-|rgba\(168,85,247|#A855F7|#7C3AED|#8B5CF6|#0E0B1F|#1A0F2F|gradient-brand|glow-border-gradient|shadow-glow|bg-bg-base|bg-bg-elevated|border-border-subtle|border-border-brand|text-gray-|text-white" \
     src index.html tailwind.config.ts src/styles/globals.css
   ```
   應**收斂到 0**，但**允許例外**（不算殘留）：① `src/data/content.ts` 的 audience key `brand` / 型別 `AudienceKey`；② SEO / i18n 文案中的英文 "brand"；③ §4「媒體 overlay 例外」清單中 DemoCard 的 `bg-black*` / `text-white`（媒體 scrim，刻意保留）。逐筆確認命中是否屬例外。
4. dev server 啟動，playwright-cli 截桌面 + 手機（至少繁中，建議含 hero/demo/audiences/footer），交 gemini 視覺 review（強制流程）：簡約專業質感、咖啡色運用、對比度 a11y、背景圖不搶文字、襯線大標效果。
5. 回報使用者：變更檔案清單 + 最終截圖 + gemini review 摘要。
