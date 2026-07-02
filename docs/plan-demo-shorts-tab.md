# 任務：Demo 區塊新增「短影音」tab + LoRA 圖更換

工作目錄（一律以此為根）：`/home/markchou/project/ai-portrait-studio-site/.claude/worktrees/demo-shorts-lora-update`

這是 React 19 + Vite + Tailwind + vitest 的形象官網。素材檔已就位於 `src/assets/`（不要動素材檔）：
- `shorts-soma-demo.mp4`（1080x1920 直式，15 秒）
- `shorts-dance-demo.mp4`（1080x1920 直式，15 秒）
- `lora-after-grid.jpg`（新的訓練後合併圖，取代舊 `lora-after.png`）
- `lora-before.jpg`（已被新圖覆蓋，import 不用改）

## 變更 1：`src/components/DemoCard.tsx` — video variant 支援直式比例

`VideoProps` 新增可選欄位 `orientation?: 'landscape' | 'portrait'`（預設 `'landscape'`）。
`VideoDemoCard` 內原本寫死的 `aspect-video` 容器 class，依 orientation 切換：
- landscape → `aspect-video`（維持現狀）
- portrait → `aspect-[9/16]`

其他行為（poster、play gesture、controls 切換）完全不動。

## 變更 2：`src/sections/Demo.tsx` — 新增 shorts tab

1. `TabId` 改為 `'image' | 'video' | 'shorts'`
2. import 兩支新影片：
   ```ts
   import shortsSoma from '@/assets/shorts-soma-demo.mp4'
   import shortsDance from '@/assets/shorts-dance-demo.mp4'
   ```
3. `loraAfter` 的 import 改為 `import loraAfter from '@/assets/lora-after-grid.jpg'`（舊的 `lora-after.png` import 移除）
4. tabs 陣列順序：video（現有）→ **shorts（新，第二個）** → image（現有）。shorts 的 icon 用 lucide-react 的 `Smartphone`（`<Smartphone className="w-4 h-4" />`）
5. 內容區三分支（現有的 ternary 改寫成可讀的三分支，例如 `tab === 'image' ? (...) : tab === 'shorts' ? (...) : (...)`）。shorts 分支：
   ```tsx
   <div className="grid grid-cols-2 gap-4 tablet:gap-6 max-w-xl tablet:max-w-2xl mx-auto">
     <DemoCard
       variant="video"
       orientation="portrait"
       source={{ type: 'mp4', src: shortsSoma }}
       durationSec="15"
       title={t.demo.shortsCard.title1}
       desc={t.demo.shortsCard.desc1}
       playLabel={t.demo.videoCard.playLabel}
     />
     <DemoCard
       variant="video"
       orientation="portrait"
       source={{ type: 'mp4', src: shortsDance }}
       durationSec="15"
       title={t.demo.shortsCard.title2}
       desc={t.demo.shortsCard.desc2}
       playLabel={t.demo.videoCard.playLabel}
     />
   </div>
   ```
6. Tech banner 三分支：shorts 用 `t.demo.techBanner.shorts.title / .description`，icon 沿用 `VideoIcon`（image 分支維持 Sparkles）。

## 變更 3：i18n 三語系檔（key 結構三檔一致）

在 `src/i18n/messages.zh-hant.ts`、`messages.zh-hans.ts`、`messages.en.ts` 的 `demo` 區塊各加：

- `tabs.shorts`
- `shortsCard: { title1, desc1, title2, desc2 }`
- `techBanner.shorts: { title, description }`

文案**逐字使用**以下內容（不要自行改寫）：

zh-hant：
- tabs.shorts: `短影音生成`
- shortsCard.title1: `品牌短影音・SOMA`
- shortsCard.desc1: `AI 虛擬人設 × 品牌產品置入 × 律動演出`
- shortsCard.title2: `舞蹈短影音`
- shortsCard.desc2: `AI 人物舞蹈：動作流暢 × 角色形象一致`
- techBanner.shorts.title: `AI 短影音生成`
- techBanner.shorts.description: `以 AI 直接生成直式短影音，人物動作自然流暢、角色形象前後一致，無需真人出鏡與實景拍攝。適合 TikTok、Reels、Shorts 等平台的高頻內容產出，讓虛擬人設持續露出、內容產線不中斷。`

zh-hans（簡體）：
- tabs.shorts: `短视频生成`
- shortsCard.title1: `品牌短视频・SOMA`
- shortsCard.desc1: `AI 虚拟人设 × 品牌产品植入 × 律动演出`
- shortsCard.title2: `舞蹈短视频`
- shortsCard.desc2: `AI 人物舞蹈：动作流畅 × 角色形象一致`
- techBanner.shorts.title: `AI 短视频生成`
- techBanner.shorts.description: `以 AI 直接生成竖版短视频，人物动作自然流畅、角色形象前后一致，无需真人出镜与实景拍摄。适合 TikTok、Reels、Shorts 等平台的高频内容产出，让虚拟人设持续露出、内容产线不中断。`

en：
- tabs.shorts: `Short-form Video`
- shortsCard.title1: `Branded Short · SOMA`
- shortsCard.desc1: `AI virtual persona × product placement × rhythmic performance`
- shortsCard.title2: `Dance Short`
- shortsCard.desc2: `AI character dance: fluid motion × consistent identity`
- techBanner.shorts.title: `AI Short-form Video Generation`
- techBanner.shorts.description: `We generate vertical short-form videos entirely with AI — natural, fluid motion with a consistent character identity, no on-camera talent or location shoots required. Perfect for high-frequency content on TikTok, Reels and Shorts, keeping your virtual persona visible and your content pipeline running.`

另外：三語系的 `demo.loraAfter` 文案更新為（訓練後圖現在是四場景合併圖）：
- zh-hant: `訓練後：同一人物跨場景生成範例`
- zh-hans: `训练后：同一人物跨场景生成范例`
- en: `After: same character across scenes, generated`

若 i18n 有 type 定義（例如以 zh-hant 為 source of truth 的 `typeof`），確認三檔 key 完全一致即可通過 typecheck。

## 變更 4：測試

`tests/sections/Demo.test.tsx` 新增一個測試：點擊「短影音生成」tab 後，`品牌短影音・SOMA` 與 `舞蹈短影音` 卡片可見、banner 顯示 `AI 短影音生成`、且 `aria-selected` 正確。既有測試不應被破壞（zh-hant 預設語系邏輯照舊）。

`tests/components/DemoCard.test.tsx` 若結構允許，補一個 portrait orientation 的斷言（container 含 `aspect-[9/16]` class）；若現有測試寫法不易擴充，可略過並在回報中註明。

## 驗收條件

1. `pnpm typecheck` 通過
2. `pnpm test` 全綠
3. `pnpm lint` 無新增錯誤
4. 不動 `src/assets/` 下任何檔案、不動本計畫檔
