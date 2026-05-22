import { Sparkles, Star, Crown } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { PlanCard } from '@/components/PlanCard'
import { AddOnCard } from '@/components/AddOnCard'
import { useT } from '@/i18n/useT'
import { PLAN_PRICES, PLAN_HIGHLIGHTED, ADDONS, TELEGRAM_URL } from '@/data/content'

export function Pricing() {
  const { t } = useT()

  // 加購服務 i18n bundle map
  const addonI18nByKey = {
    extraVideo: t.addons.extraVideo,
    rushDelivery: t.addons.rushDelivery,
    extraTrainingPhotos: t.addons.extraTrainingPhotos,
  } as const

  return (
    <section
      id="pricing"
      className="min-h-screen flex flex-col justify-center px-4 py-16 tablet:py-24"
    >
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader badge={t.pricing.badge} title={t.pricing.title} subtitle={t.pricing.subtitle} />

        {/* Pricing 三卡 */}
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8 mt-16 desktop:items-stretch">
          <PlanCard
            name={t.pricing.basic.name}
            icon={<Sparkles className="w-4 h-4 text-brand-300" aria-hidden="true" />}
            tagline={t.pricing.basic.tagline}
            price={PLAN_PRICES.basic}
            priceLabel={t.pricing.priceLabel}
            deliverables={t.pricing.basic.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'basic'}
            hottestLabel={t.pricing.hottest}
          />
          <PlanCard
            name={t.pricing.pro.name}
            icon={<Star className="w-4 h-4 text-brand-300" fill="currentColor" aria-hidden="true" />}
            tagline={t.pricing.pro.tagline}
            price={PLAN_PRICES.pro}
            priceLabel={t.pricing.priceLabel}
            deliverables={t.pricing.pro.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'pro'}
            hottestLabel={t.pricing.hottest}
          />
          <PlanCard
            name={t.pricing.enterprise.name}
            icon={<Crown className="w-4 h-4 text-brand-300" aria-hidden="true" />}
            tagline={t.pricing.enterprise.tagline}
            price={PLAN_PRICES.enterprise}
            priceLabel={t.pricing.priceLabel}
            deliverables={t.pricing.enterprise.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'enterprise'}
            hottestLabel={t.pricing.hottest}
          />
        </div>

        {/* 加購服務 — 內嵌為 Pricing 的 sub-section */}
        <div className="mt-12 tablet:mt-16">
          <div className="text-center mb-6">
            <h3 className="text-xl tablet:text-2xl font-semibold text-white mb-2">{t.addons.title}</h3>
            <p className="text-gray-400 text-base">{t.addons.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {ADDONS.map((a) => {
              const i = addonI18nByKey[a.key]
              return (
                <AddOnCard
                  key={a.key}
                  name={i.name}
                  desc={i.desc}
                  price={a.price}
                  unit={i.unit}
                  priceLabel={t.pricing.priceLabel}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
