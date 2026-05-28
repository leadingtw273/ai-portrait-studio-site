import { Sparkles, Star, Crown, Sprout, Check } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { PlanCard } from '@/components/PlanCard'
import { AddOnsCarousel } from '@/components/AddOnsCarousel'
import { useT } from '@/i18n/useT'
import { useCurrency } from '@/lib/useCurrency'
import { convertTwd } from '@/lib/currency'
import { PLAN_PRICES, PLAN_HIGHLIGHTED, DISCOVERY_PRICE, TELEGRAM_URL } from '@/data/content'

export function Pricing() {
  const { t } = useT()
  const { currency, symbol, rate, format } = useCurrency()
  // PlanCard 仍接 number + symbol；非 TWD 時轉成換算後數值、靠 PlanCard 內 toLocaleString 顯示
  const planPrice = (twd: number): number =>
    rate === null ? twd : convertTwd(twd, currency, rate)

  return (
    <section
      id="pricing"
      className="min-h-screen flex flex-col justify-center px-4 py-16 tablet:py-24"
    >
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader badge={t.pricing.badge} title={t.pricing.title} subtitle={t.pricing.subtitle} />
        {t.pricing.currencyNote && (
          <p className="text-xs text-gray-400 mt-2 text-center">{t.pricing.currencyNote}</p>
        )}

        {/* Pricing 三卡 */}
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8 mt-16 tablet:max-w-lg tablet:mx-auto desktop:max-w-none desktop:items-stretch">
          <PlanCard
            name={t.pricing.basic.name}
            icon={<Sparkles className="w-4 h-4 text-brand-300" aria-hidden="true" />}
            tagline={t.pricing.basic.tagline}
            price={planPrice(PLAN_PRICES.basic)}
            priceLabel={symbol}
            priceFractionDigits={currency === 'TWD' ? 0 : 1}
            deliverables={t.pricing.basic.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'basic'}
          />
          <PlanCard
            name={t.pricing.pro.name}
            icon={<Star className="w-4 h-4 text-brand-300" fill="currentColor" aria-hidden="true" />}
            tagline={t.pricing.pro.tagline}
            price={planPrice(PLAN_PRICES.pro)}
            priceLabel={symbol}
            priceFractionDigits={currency === 'TWD' ? 0 : 1}
            deliverables={t.pricing.pro.deliverables}
            ctaLabel={t.pricing.ctaInquiry}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'pro'}
            badge={{ label: t.pricing.hottest, variant: 'brand' }}
            className="order-first desktop:order-none"
          />
          <PlanCard
            name={t.pricing.enterprise.name}
            icon={<Crown className="w-4 h-4 text-brand-300" aria-hidden="true" />}
            tagline={t.pricing.enterprise.tagline}
            price={planPrice(PLAN_PRICES.enterprise)}
            priceLabel={symbol}
            priceFractionDigits={currency === 'TWD' ? 0 : 1}
            deliverables={t.pricing.enterprise.deliverables}
            ctaLabel={t.pricing.enterprise.ctaLabel}
            ctaHref={TELEGRAM_URL}
            highlighted={PLAN_HIGHLIGHTED === 'enterprise'}
            badge={{ label: t.pricing.limited, variant: 'gold' }}
          />
        </div>

        {/* Discovery Pack — 橫向試做卡（介於方案與加購之間） */}
        <div className="mt-12 tablet:mt-16">
          <div className="relative rounded-2xl p-6 desktop:p-8 border border-border-brand bg-gradient-to-r from-brand-500/10 to-brand-500/5 shadow-glow-md">
            {/* Badge — mobile 浮頂 / desktop corner-attached */}
            <span
              className="absolute px-4 py-1 text-sm font-semibold bg-brand-500 text-white shadow-glow-md whitespace-nowrap
                         top-[-12px] left-1/2 -translate-x-1/2 rounded-full
                         desktop:top-0 desktop:right-0 desktop:left-auto desktop:translate-x-0
                         desktop:rounded-tl-none desktop:rounded-br-none desktop:rounded-tr-2xl desktop:rounded-bl-2xl"
            >
              {t.pricing.discovery.badge}
            </span>

            <div className="flex flex-col tablet:flex-row tablet:items-center gap-6 tablet:gap-8">
              {/* 左：icon 垂直置中 */}
              <span
                aria-hidden="true"
                className="shrink-0 self-center inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-500/20 border border-border-brand"
              >
                <Sprout className="w-8 h-8 text-brand-300" />
              </span>

              {/* 右側：grid 2x2 — 左欄(name+tagline / deliverables)、右欄(price / CTA) */}
              <div className="flex-1 grid grid-cols-1 tablet:grid-cols-[1fr_auto] gap-y-5 gap-x-6 tablet:gap-x-12 items-start w-full min-w-0">
                {/* row 1 / col 1：name + tagline（對齊 plan card 樣式） */}
                <div className="text-center tablet:text-left min-w-0">
                  <div className="text-gray-200 text-xl font-medium mb-1">{t.pricing.discovery.name}</div>
                  <div className="text-gray-400 text-base">{t.pricing.discovery.tagline}</div>
                </div>

                {/* row 1 / col 2：price（與標題副標同行、text-5xl 對齊 plan card）*/}
                <div className="text-5xl font-bold text-white whitespace-nowrap shrink-0 text-center tablet:text-right tablet:pt-2">
                  {format(DISCOVERY_PRICE)}
                </div>

                {/* row 2 / col 1：deliverables 2x2、只占左欄寬 */}
                <ul className="grid grid-cols-1 mobile:grid-cols-2 gap-x-6 gap-y-2 text-left">
                  {t.pricing.discovery.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-brand-300 mt-0.5 flex-none" aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {/* row 2 / col 2：CTA 右下（mobile 全寬置中） */}
                <div className="flex justify-center tablet:justify-end self-end">
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-10 py-3 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold text-base shadow-glow-md min-h-[44px] min-w-[200px] tablet:min-w-[240px] transition-colors"
                  >
                    {t.pricing.discovery.ctaLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 加購服務 — Carousel (9 卡、autoplay + 左右切換) */}
        <div className="mt-12 tablet:mt-16">
          <div className="text-center mb-6">
            <h3 className="text-xl tablet:text-2xl font-semibold text-white mb-2">{t.addons.title}</h3>
            <p className="text-gray-400 text-base">{t.addons.subtitle}</p>
          </div>
          <AddOnsCarousel />
        </div>
      </div>
    </section>
  )
}
