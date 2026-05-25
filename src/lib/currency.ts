// 語言 → 幣別映射、open.er-api.com 拉匯率（24h cache）、依公式換算
// 公式：TWD × 匯率 × 1.005、無條件進位至小數點後 1 位

import type { Lang } from '@/i18n/LanguageProvider'

export type Currency = 'TWD' | 'CNY' | 'USD'

export const LANG_TO_CURRENCY: Record<Lang, Currency> = {
  'zh-Hant': 'TWD',
  'zh-Hans': 'CNY',
  'en':      'USD',
}

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  TWD: 'NT$',
  CNY: '¥',
  USD: 'US$',
}

const CACHE_KEY = 'ai-portrait-rates-v1'
const CACHE_TTL = 24 * 60 * 60 * 1000  // 24h
const API_URL = 'https://open.er-api.com/v6/latest/TWD'

export type Rates = Partial<Record<Currency, number>>

type CachedPayload = { ts: number; rates: Rates }

export async function fetchRates(): Promise<Rates> {
  // 讀 cache（< 24h 視為有效）
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(CACHE_KEY)
      if (raw) {
        const cached: CachedPayload = JSON.parse(raw)
        if (Date.now() - cached.ts < CACHE_TTL) return cached.rates
      }
    } catch { /* ignore parse / quota errors */ }
  }

  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`rate API ${res.status}`)
  const data = await res.json()
  const rates: Rates = {
    TWD: 1,
    CNY: data?.rates?.CNY,
    USD: data?.rates?.USD,
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rates }))
    } catch { /* quota */ }
  }

  return rates
}

// 公式：TWD × rate × 1.005、無條件進位至 1 位小數
export function convertTwd(twd: number, currency: Currency, rate: number): number {
  if (currency === 'TWD') return twd
  return Math.ceil(twd * rate * 1.005 * 10) / 10
}

export function formatPrice(twd: number, currency: Currency, rate: number): string {
  const symbol = CURRENCY_SYMBOL[currency]
  const value = convertTwd(twd, currency, rate)
  const fractionDigits = currency === 'TWD' ? 0 : 1
  return `${symbol} ${value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`
}
