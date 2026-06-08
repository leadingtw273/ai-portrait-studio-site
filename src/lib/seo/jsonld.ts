import type { Lang } from '@/i18n/LanguageProvider'
import { canonical, ogImage, videoPoster, asset } from './canonicalUrl'
import { TELEGRAM_URL } from '@/data/content'
import { SEO_META } from './meta'

export type ProfessionalServiceJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'ProfessionalService'
  name: string
  alternateName?: string
  description: string
  url: string
  image: string
  areaServed: string[]
  contactPoint: {
    '@type': 'ContactPoint'
    url: string
    contactType: string
    availableLanguage: string[]
  }
  hasOfferCatalog: {
    '@type': 'OfferCatalog'
    name: string
    itemListElement: Array<{
      '@type': 'Offer'
      name: string
      itemOffered: {
        '@type': 'Service'
        name: string
        serviceType: string
      }
    }>
  }
}

const SERVICE_NAME: Record<Lang, string> = {
  'zh-Hant': 'AI 人像工作室',
  'zh-Hans': 'AI 人像工作室',
  'en':      'AI Portrait Studio',
}

const AUDIENCE_OFFERS: Record<Lang, Array<{ name: string; serviceType: string }>> = {
  'zh-Hant': [
    { name: '品牌・廣告主 服務方案', serviceType: 'AI 品牌形象與廣告素材' },
    { name: '網紅・自媒體 服務方案', serviceType: 'AI 虛擬人物與影音內容' },
    { name: '多帳號矩陣 專屬產線',   serviceType: '規模化多人設 LoRA 產線' },
  ],
  'zh-Hans': [
    { name: '品牌・广告主 服务方案', serviceType: 'AI 品牌形象与广告素材' },
    { name: '网红・自媒体 服务方案', serviceType: 'AI 虚拟人物与影音内容' },
    { name: '多账号矩阵 专属产线',   serviceType: '规模化多人设 LoRA 产线' },
  ],
  'en': [
    { name: 'Brand & Advertiser Solutions',           serviceType: 'AI brand imagery & ad creatives' },
    { name: 'Creator & Agency Solutions',             serviceType: 'AI virtual personas & video content' },
    { name: 'Multi-account Matrix Dedicated Line',     serviceType: 'Scaled multi-persona LoRA production' },
  ],
}

export function buildProfessionalServiceJsonLd(lang: Lang): ProfessionalServiceJsonLd {
  const meta = SEO_META[lang]
  const offers = AUDIENCE_OFFERS[lang]
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SERVICE_NAME[lang],
    alternateName: lang === 'en' ? undefined : 'AI Portrait Studio',
    description: meta.description,
    url: canonical(lang),
    image: ogImage(lang),
    areaServed: ['TW', 'HK', 'SG', 'MY', 'CN', 'US'],
    contactPoint: {
      '@type': 'ContactPoint',
      url: TELEGRAM_URL,
      contactType: 'sales',
      availableLanguage: ['zh-Hant', 'zh-Hans', 'en'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'en' ? 'Service Audiences' : '服務對象',
      itemListElement: offers.map((o) => ({
        '@type': 'Offer' as const,
        name: o.name,
        itemOffered: { '@type': 'Service' as const, name: o.name, serviceType: o.serviceType },
      })),
    },
  }
}

export type VideoObjectJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'VideoObject'
  name: string
  description: string
  thumbnailUrl: string
  contentUrl: string
  uploadDate: string
  duration?: string
}

export type VideoObjectInput = {
  name: string           // 用於 poster 檔名 + JSON-LD name
  title: string          // 顯示用 title
  description: string
  mp4FileName: string    // Vite hash 後的 mp4 檔名（從 build manifest 取，Task 16c 負責）
}

export function buildVideoObjectJsonLd(input: VideoObjectInput): VideoObjectJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: input.title,
    description: input.description,
    thumbnailUrl: videoPoster(input.name),
    contentUrl: asset(`assets/${input.mp4FileName}`),
    uploadDate: '2026-05-21',  // landing v1 上線日期、後續可改 build-time inject
    duration: 'PT15S',
  }
}
