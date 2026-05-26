# AI Portrait Studio Site

一頁式形象 landing site for AI 人像工作室。

## Tech

- React 19 + TypeScript + Vite + Tailwind 3
- 中英 / 簡繁體三語（自寫 LanguageProvider Context）
- 價格依語言自動切換幣別（TWD / CNY / USD）含即時匯率
- Deploy: GitHub Pages

## Local

```bash
pnpm install
pnpm dev          # localhost:5173/ai-portrait-studio-site/
pnpm test         # vitest（含 RTL + jsdom）
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

## 區塊結構

| Section | id | 內容 |
|---|---|---|
| Hero | `#top` | 主標 + 副描述 + 兩顆 CTA |
| Demo | `#demo` | LoRA 訓練 (before/after) + 影片人像生成（兩支 mp4） |
| Pricing | `#pricing` | 三方案 (Mini/Standard/Pro Launch) + Discovery 試做卡 + 9 加購 carousel |
| FinalCTA + Footer | `#contact` | 主 CTA + 聯絡方式（TG 按鈕 + QR） |

## 多幣別 / 即時匯率

依當前語言自動切換幣別、顯示對應即時匯率：

| 語言 | 幣別 | 顯示 |
|---|---|---|
| `zh-Hant` | TWD | `NT$ 12,800`（原價、不換算） |
| `zh-Hans` | CNY | `¥ 2,775` |
| `en`      | USD | `US$ 408.6` |

- 換算公式：`TWD × 匯率 × 1.005`、無條件進位至 1 位小數
- 匯率來源：[open.er-api.com](https://open.er-api.com/)（免費、無 API key、`localStorage` 24h cache）
- TWD 整數無小數；CNY / USD 強制 1 位小數
- 拉不到匯率時 fallback 回 TWD 原價、避免閃白
- 程式入口：`src/lib/currency.ts` + `src/lib/useCurrency.ts`

加購 9 卡：7 張用 `priceTwd + priceUnitKey` 動態計算（`套 / 場景 / 風格 / 主題` 後綴由 i18n.addons.units 提供）；2 張急件加成保留 `priceFee` 字串（`+ 30% / + 60%`、不換算）。

## 素材替換（上線前）

- TG 邀請連結：`src/data/content.ts` 的 `TELEGRAM_URL`（目前為群組邀請連結 `t.me/+...`）
- Demo 影片：`src/assets/tea-product-promo.mp4` / `src/assets/automotive-kv-promo.mp4`
- LoRA before/after：`src/assets/lora-before.jpg` / `lora-after.png`
- Hero 背景：`src/assets/hero-bg.jpg`
- 方案 / 加購文案：`src/i18n/messages.{zh-hant,zh-hans,en}.ts`
- 方案數字 / 加購數字底價：`src/data/content.ts` 的 `PLAN_PRICES` / `DISCOVERY_PRICE` / `ADDON_CARDS[].priceTwd`

## Spec

`docs/superpowers/specs/2026-05-21-landing-site-design.md`
