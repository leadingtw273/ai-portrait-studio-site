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
