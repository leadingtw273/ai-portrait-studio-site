import { SectionHeader } from '@/components/SectionHeader'
import { PlanCard } from '@/components/PlanCard'
import { useT } from '@/i18n/useT'
import { PLAN_PRICES, PLAN_HIGHLIGHTED, TELEGRAM_URL } from '@/data/content'

export function Pricing() {
  const { t } = useT()
  return (
    <section id="pricing" className="px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto">
        <SectionHeader badge={t.pricing.badge} title={t.pricing.title} subtitle={t.pricing.subtitle} />
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8 mt-10">
          <PlanCard
            name={t.pricing.basic.name}
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
      </div>
    </section>
  )
}
