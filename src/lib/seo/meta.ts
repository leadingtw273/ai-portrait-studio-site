import type { Lang } from '@/i18n/LanguageProvider'

export type SeoMeta = {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogLocale: string         // FB OG 規格、底線分隔（zh_TW / zh_CN / en_US）
  keywords: string
}

export const SEO_META: Record<Lang, SeoMeta> = {
  'zh-Hant': {
    title: 'AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 從 NT$ 3,500 起',
    description: '專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。Mini / Standard / Pro 三方案、含 9 種加購、Telegram 即時諮詢。',
    ogTitle: 'AI 人像工作室｜LoRA 訓練・AI 寫真・影片人像生成',
    ogDescription: '專業 AI 人像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。',
    ogLocale: 'zh_TW',
    keywords: 'AI 人像,AI 寫真,LoRA 訓練,AI 影片,人像生成,商品形象,AI portrait,AI headshot',
  },
  'zh-Hans': {
    title: 'AI 人像工作室｜LoRA 训练・AI 写真・视频人像生成 — 约 ¥800 起',
    description: '专业 AI 人像工作室。LoRA 个人模型训练 + AI 商品形象写真 + AI 视频人像生成。Mini / Standard / Pro 三方案，含 9 种加购，Telegram 即时咨询。',
    ogTitle: 'AI 人像工作室｜LoRA 训练・AI 写真・视频人像生成',
    ogDescription: '专业 AI 人像工作室。LoRA 个人模型训练 + AI 商品形象写真 + AI 视频人像生成。',
    ogLocale: 'zh_CN',
    keywords: 'AI 写真,AI 头像,AI 形象,LoRA 训练,AI 视频,人像生成,商品形象',
  },
  'en': {
    title: 'AI Portrait Studio | LoRA Training・AI Headshots・Video Portraits — From US$ 109',
    description: 'Professional AI Portrait Studio. Custom LoRA training + AI brand photography + AI video portraits. Mini / Standard / Pro plans, 9 add-ons, instant Telegram consultation.',
    ogTitle: 'AI Portrait Studio | LoRA Training・AI Headshots・Video Portraits',
    ogDescription: 'Professional AI Portrait Studio. Custom LoRA training + AI brand photography + AI video portraits.',
    ogLocale: 'en_US',
    keywords: 'AI portrait studio,AI headshot,LoRA training,AI video,brand photography,personal AI model',
  },
}
