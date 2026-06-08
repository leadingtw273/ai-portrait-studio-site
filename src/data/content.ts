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

// 服務對象 — 三類客群（文案在 i18n.audiences、這裡只放 key + 視覺 flag）
export type AudienceKey = 'brand' | 'creator' | 'operator'

export type AudienceMeta = {
  key: AudienceKey
}

export const AUDIENCES: AudienceMeta[] = [
  { key: 'brand' },
  { key: 'creator' },
  { key: 'operator' },
]
