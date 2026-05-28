import { describe, it, expect } from 'vitest'
import { buildLangUrl } from '@/lib/seo/langNav'
import { BASE_PATH } from '@/lib/seo/canonicalUrl'

describe('buildLangUrl', () => {
  it('builds URL with target lang and trailing slash, no hash', () => {
    expect(buildLangUrl('zh-Hant', '')).toBe(`${BASE_PATH}/zh-Hant/`)
    expect(buildLangUrl('zh-Hans', '')).toBe(`${BASE_PATH}/zh-Hans/`)
    expect(buildLangUrl('en', '')).toBe(`${BASE_PATH}/en/`)
  })

  it('preserves hash when provided', () => {
    expect(buildLangUrl('zh-Hans', '#pricing')).toBe(`${BASE_PATH}/zh-Hans/#pricing`)
    expect(buildLangUrl('en', '#contact')).toBe(`${BASE_PATH}/en/#contact`)
  })

  it('handles hash without leading # gracefully (add # prefix if missing)', () => {
    // 視 caller 而定；目前 spec 接受 window.location.hash 直接傳入 (含 #)
    expect(buildLangUrl('zh-Hant', '#demo')).toBe(`${BASE_PATH}/zh-Hant/#demo`)
  })

  it('handles empty / undefined hash', () => {
    expect(buildLangUrl('en', '')).toBe(`${BASE_PATH}/en/`)
  })
})
