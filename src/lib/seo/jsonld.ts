import type { Lang } from '@/i18n/LanguageProvider'
import { canonical, ogImage, videoPoster, asset } from './canonicalUrl'
import { PLAN_PRICES, DISCOVERY_PRICE, TELEGRAM_URL } from '@/data/content'
import { SEO_META } from './meta'

export type ProfessionalServiceJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'ProfessionalService'
  name: string
  alternateName?: string
  description: string
  url: string
  image: string
  priceRange: string
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
      price: string
      priceCurrency: 'TWD'
    }>
  }
}

const SERVICE_NAME: Record<Lang, string> = {
  'zh-Hant': 'AI 人像工作室',
  'zh-Hans': 'AI 人像工作室',
  'en':      'AI Portrait Studio',
}

const OFFER_NAMES: Record<Lang, { discovery: string; mini: string; standard: string; pro: string }> = {
  'zh-Hant': { discovery: 'Discovery Pack 試做', mini: 'Mini Launch', standard: 'Standard Launch', pro: 'Pro Launch' },
  'zh-Hans': { discovery: 'Discovery Pack 试做', mini: 'Mini Launch', standard: 'Standard Launch', pro: 'Pro Launch' },
  'en':      { discovery: 'Discovery Pack',      mini: 'Mini Launch', standard: 'Standard Launch', pro: 'Pro Launch' },
}

export function buildProfessionalServiceJsonLd(lang: Lang): ProfessionalServiceJsonLd {
  const meta = SEO_META[lang]
  const offers = OFFER_NAMES[lang]
  const minPrice = DISCOVERY_PRICE
  const maxPrice = PLAN_PRICES.enterprise
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SERVICE_NAME[lang],
    alternateName: lang === 'en' ? undefined : 'AI Portrait Studio',
    description: meta.description,
    url: canonical(lang),
    image: ogImage(lang),
    priceRange: `NT$${minPrice.toLocaleString()} - NT$${maxPrice.toLocaleString()}`,
    areaServed: ['TW', 'HK', 'SG', 'MY', 'CN', 'US'],
    contactPoint: {
      '@type': 'ContactPoint',
      url: TELEGRAM_URL,
      contactType: 'sales',
      availableLanguage: ['zh-Hant', 'zh-Hans', 'en'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'en' ? 'Service Plans' : '服務方案',
      itemListElement: [
        { '@type': 'Offer', name: offers.discovery, price: String(DISCOVERY_PRICE),      priceCurrency: 'TWD' },
        { '@type': 'Offer', name: offers.mini,      price: String(PLAN_PRICES.basic),     priceCurrency: 'TWD' },
        { '@type': 'Offer', name: offers.standard,  price: String(PLAN_PRICES.pro),       priceCurrency: 'TWD' },
        { '@type': 'Offer', name: offers.pro,       price: String(PLAN_PRICES.enterprise), priceCurrency: 'TWD' },
      ],
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
