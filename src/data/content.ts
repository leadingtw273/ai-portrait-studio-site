// 集中所有「非翻譯」資料：URL、價格、deliverable list 結構
// 翻譯文字（標題 / 描述）放在 i18n messages

// TG 聯絡 — 群組邀請連結（非 username，故無對應 @handle 可顯示）
export const TELEGRAM_URL = 'https://t.me/+ggZ71bEWqas5MzRl'

// Demo 區素材（image / video 直接以 import asset 方式提供、未在 content 集中）
export type DemoImage = { src: string; alt: string }

// 注意：3 張 image（spec §3 寫 2-3 卡）
export const DEMO_IMAGES: DemoImage[] = [
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', alt: 'AI portrait sample 1' },
  { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', alt: 'AI portrait sample 2' },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', alt: 'AI portrait sample 3' },
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

// priceUnitKey：對應 i18n.addons.units 內的 key
export type AddOnUnitKey = 'set' | 'scene' | 'style' | 'theme'

export type AddOnCardData = {
  key: AddOnKey
  emoji: string
  tagVariant?: AddOnTagVariant
  priceTwd?: number       // 數值底價（TWD）；undefined → 為 rush 類型、改讀 i18n.priceFee 字串
  priceUnitKey?: AddOnUnitKey
}

export const ADDON_CARDS: AddOnCardData[] = [
  { key: 'extraOutfit',    emoji: '👗', priceTwd: 1800,  priceUnitKey: 'set' },
  { key: 'extraScene',     emoji: '🏞', priceTwd: 2400,  priceUnitKey: 'scene' },
  { key: 'styleTransfer',  emoji: '🎨', priceTwd: 2800,  priceUnitKey: 'style' },
  { key: 'loraRetrain',    emoji: '🔄', priceTwd: 4800,                          tagVariant: 'pro-free' },
  { key: 'loraHandover',   emoji: '📦', priceTwd: 12800,                         tagVariant: 'pro-free' },
  { key: 'strategyCall',   emoji: '💬', priceTwd: 2800,                          tagVariant: 'pro-free' },
  { key: 'advancedStyle',  emoji: '🎬', priceTwd: 4800,  priceUnitKey: 'theme',  tagVariant: 'pro-only' },
  { key: 'rush48h',        emoji: '⚡',                                          tagVariant: 'pro-free' },
  { key: 'rush24h',        emoji: '🔥',                                          tagVariant: 'pro-free' },
]
