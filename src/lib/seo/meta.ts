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
    title: 'AI 影像工作室｜AI 影片內容生成・LoRA 訓練・AI 寫真 — 品牌・網紅・矩陣團隊專屬',
    description: '專業 AI 影像工作室。為品牌廣告主、網紅自媒體、多帳號矩陣團隊打造專屬 LoRA 形象人物與 AI 影片內容，依客群需求客製方案，Telegram 即時諮詢。',
    ogTitle: 'AI 影像工作室｜AI 影片內容生成・LoRA 訓練・AI 寫真',
    ogDescription: '為品牌廣告主、網紅自媒體與多帳號矩陣團隊打造專屬 LoRA 形象人物與 AI 影片內容，依客群需求客製方案。',
    ogLocale: 'zh_TW',
    keywords: 'AI 影片生成,AI 影像,LoRA 訓練,AI 寫真,AI 人像,虛擬人設,品牌形象,網紅素材,AI portrait,AI headshot',
  },
  'zh-Hans': {
    title: 'AI 影像工作室｜AI 视频内容生成・LoRA 训练・AI 写真 — 品牌・网红・矩阵团队专属',
    description: '专业 AI 影像工作室。为品牌广告主、网红自媒体、多账号矩阵团队打造专属 LoRA 形象人物与 AI 视频内容，依客群需求定制方案，Telegram 即时咨询。',
    ogTitle: 'AI 影像工作室｜AI 视频内容生成・LoRA 训练・AI 写真',
    ogDescription: '为品牌广告主、网红自媒体与多账号矩阵团队打造专属 LoRA 形象人物与 AI 视频内容，依客群需求定制方案。',
    ogLocale: 'zh_CN',
    keywords: 'AI 视频生成,AI 影像,LoRA 训练,AI 写真,AI 头像,虚拟人设,品牌形象,网红素材',
  },
  'en': {
    title: 'AI Imaging Studio | AI Video Content・LoRA Training・AI Headshots — For Brands, Creators & Account Networks',
    description: 'Professional AI Imaging Studio. Custom LoRA characters and AI video content for brands & advertisers, creators & agencies, and multi-account teams. Tailored solutions, instant Telegram consultation.',
    ogTitle: 'AI Imaging Studio | AI Video Content・LoRA Training・AI Headshots',
    ogDescription: 'Custom LoRA characters and AI video content for brands, creators, and multi-account teams — solutions tailored to each audience.',
    ogLocale: 'en_US',
    keywords: 'AI video generation,AI imaging studio,LoRA training,AI headshot,AI portrait,virtual persona,brand imagery,creator content',
  },
}
