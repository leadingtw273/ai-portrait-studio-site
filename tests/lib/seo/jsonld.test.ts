import { describe, it, expect } from 'vitest'
import { buildProfessionalServiceJsonLd, buildVideoObjectJsonLd } from '@/lib/seo/jsonld'

describe('JSON-LD generators (Task 10)', () => {
  describe('ProfessionalService', () => {
    it('contains required schema.org fields for zh-Hant', () => {
      const json = buildProfessionalServiceJsonLd('zh-Hant')
      expect(json['@context']).toBe('https://schema.org')
      expect(json['@type']).toBe('ProfessionalService')
      expect(json.name).toBeTruthy()
      expect(json.url).toMatch(/^https:\/\/.*\/zh-Hant\/$/)
      expect(json.image).toMatch(/^https:\/\/.*\/og\/og-zh-Hant\.jpg$/)
      expect(json.contactPoint).toBeTruthy()
      expect(json.contactPoint.url).toContain('t.me/')
    })

    it('OfferCatalog contains 4 plans with TWD price', () => {
      const json = buildProfessionalServiceJsonLd('zh-Hant')
      const offers = json.hasOfferCatalog.itemListElement
      expect(offers).toHaveLength(4)
      offers.forEach((o) => {
        expect(o['@type']).toBe('Offer')
        expect(o.priceCurrency).toBe('TWD')
        expect(Number(o.price)).toBeGreaterThan(0)
      })
    })

    it('priceCurrency is always TWD regardless of lang (策略 A)', () => {
      for (const lang of ['zh-Hant', 'zh-Hans', 'en'] as const) {
        const json = buildProfessionalServiceJsonLd(lang)
        json.hasOfferCatalog.itemListElement.forEach((o) => {
          expect(o.priceCurrency).toBe('TWD')
        })
      }
    })
  })

  describe('VideoObject', () => {
    it('contains Google-required fields: name / thumbnailUrl / uploadDate / description', () => {
      const json = buildVideoObjectJsonLd({
        name: 'tea-product-promo',
        title: '產品宣傳短片',
        description: 'AI 人臉 × 茶園實景',
        mp4FileName: 'tea-product-promo-abc123.mp4',
      })
      expect(json['@type']).toBe('VideoObject')
      expect(json.name).toBeTruthy()
      expect(json.thumbnailUrl).toMatch(/^https:\/\/.*\.jpg$/)
      expect(json.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(json.description).toBeTruthy()
      expect(json.contentUrl).toMatch(/^https:\/\/.*\.mp4$/)
    })
  })
})
