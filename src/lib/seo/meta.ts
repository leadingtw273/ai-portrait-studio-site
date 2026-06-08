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
    title: 'AI 影像工作室｜LoRA 訓練・AI 寫真・影片人像生成 — 品牌・網紅・矩陣團隊專屬',
    description: '專業 AI 影像工作室。為品牌廣告主、網紅自媒體、多帳號矩陣團隊打造專屬 LoRA 形象人物與 AI 影片內容，依客群需求客製方案，Telegram 即時諮詢。',
    ogTitle: 'AI 影像工作室｜LoRA 訓練・AI 寫真・影片人像生成',
    ogDescription: '專業 AI 影像工作室。LoRA 個人模型訓練 + AI 商品形象寫真 + AI 影片人像生成。',
    ogLocale: 'zh_TW',
    keywords: 'AI 人像,AI 寫真,LoRA 訓練,AI 影片,人像生成,商品形象,AI portrait,AI headshot',
  },
  'zh-Hans': {
    title: 'AI 影像工作室｜LoRA 训练・AI 写真・视频人像生成 — 品牌・网红・矩阵团队专属',
    description: '专业 AI 影像工作室。为品牌广告主、网红自媒体、多账号矩阵团队打造专属 LoRA 形象人物与 AI 视频内容，依客群需求定制方案，Telegram 即时咨询。',
    ogTitle: 'AI 影像工作室｜LoRA 训练・AI 写真・视频人像生成',
    ogDescription: '专业 AI 影像工作室。LoRA 个人模型训练 + AI 商品形象写真 + AI 视频人像生成。',
    ogLocale: 'zh_CN',
    keywords: 'AI 写真,AI 头像,AI 形象,LoRA 训练,AI 视频,人像生成,商品形象',
  },
  'en': {
    title: 'AI Portrait Studio | LoRA Training・AI Headshots・Video Portraits — For Brands, Creators & Account Networks',
    description: 'Professional AI Portrait Studio. Custom LoRA characters and AI video content for brands & advertisers, creators & agencies, and multi-account teams. Tailored solutions, instant Telegram consultation.',
    ogTitle: 'AI Portrait Studio | LoRA Training・AI Headshots・Video Portraits',
    ogDescription: 'Professional AI Portrait Studio. Custom LoRA training + AI brand photography + AI video portraits.',
    ogLocale: 'en_US',
    keywords: 'AI portrait studio,AI headshot,LoRA training,AI video,brand photography,personal AI model',
  },
}
