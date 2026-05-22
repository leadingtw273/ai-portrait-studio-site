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
  basic:      12800,
  pro:        78800,
  enterprise: 168800,
}
export const PLAN_HIGHLIGHTED: PlanTier = 'pro'  // 中卡突出「最熱門」

// Discovery Pack — 試做卡（介於方案三卡與加購之間的入門包）
export const DISCOVERY_PRICE = 3500

// 加購服務 — 9 張卡 carousel
export type AddOnKey =
  | 'extraOutfit'
  | 'extraScene'
  | 'styleTransfer'
  | 'loraRetrain'
  | 'loraHandover'
  | 'strategyCall'
  | 'advancedStyle'
  | 'rush48h'
  | 'rush24h'

// pro-free: 紫色 ⭐ 「Pro 包月/首次/每月免費 N 次」
// pro-only: 金色 🔒 「限 Pro 客戶」
export type AddOnTagVariant = 'pro-free' | 'pro-only'

export type AddOnCardData = {
  key: AddOnKey
  emoji: string
  tagVariant?: AddOnTagVariant
}

export const ADDON_CARDS: AddOnCardData[] = [
  { key: 'extraOutfit',    emoji: '👗' },
  { key: 'extraScene',     emoji: '🏞' },
  { key: 'styleTransfer',  emoji: '🎨' },
  { key: 'loraRetrain',    emoji: '🔄', tagVariant: 'pro-free' },
  { key: 'loraHandover',   emoji: '📦', tagVariant: 'pro-free' },
  { key: 'strategyCall',   emoji: '💬', tagVariant: 'pro-free' },
  { key: 'advancedStyle',  emoji: '🎬', tagVariant: 'pro-only' },
  { key: 'rush48h',        emoji: '⚡', tagVariant: 'pro-free' },
  { key: 'rush24h',        emoji: '🔥', tagVariant: 'pro-free' },
]
