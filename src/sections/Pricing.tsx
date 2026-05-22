import { Sparkles, Star, Crown, Sprout, Check } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { PlanCard } from '@/components/PlanCard'
import { AddOnCard } from '@/components/AddOnCard'
import { useT } from '@/i18n/useT'
import { PLAN_PRICES, PLAN_HIGHLIGHTED, ADDONS, DISCOVERY_PRICE, TELEGRAM_URL } from '@/data/content'

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
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8 mt-16 tablet:max-w-lg tablet:mx-auto desktop:max-w-none desktop:items-stretch">
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
            badge={{ label: t.pricing.hottest, variant: 'brand' }}
            className="order-first desktop:order-none"
          />
          <PlanCard
            name={t.pricing.enterprise.name}
            icon={<Crown className="w-4 h-4 text-brand-300" aria-hidden="true" />}
            tagline={t.pricing.enterprise.tagline}
            price={PLAN_PRICES.enterprise}
            priceLabel={t.pricing.priceLabel}
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
              className="absolute px-3 py-1 text-sm font-semibold bg-brand-500 text-white shadow-glow-md
                         top-[-12px] left-1/2 -translate-x-1/2 rounded-full
                         desktop:top-0 desktop:right-0 desktop:left-auto desktop:translate-x-0
                         desktop:rounded-tl-none desktop:rounded-br-none desktop:rounded-tr-2xl desktop:rounded-bl-2xl"
            >
              {t.pricing.discovery.badge}
            </span>

            <div className="flex flex-col desktop:flex-row items-center gap-6 desktop:gap-8">
              {/* 左：icon */}
              <span
                aria-hidden="true"
                className="shrink-0 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-500/20 border border-border-brand"
              >
                <Sprout className="w-8 h-8 text-brand-300" />
              </span>

              {/* 中：內容 */}
              <div className="flex-1 text-center desktop:text-left w-full">
                <div className="text-xl font-medium text-white mb-1">{t.pricing.discovery.name}</div>
                <div className="text-gray-400 text-base mb-3">{t.pricing.discovery.tagline}</div>
                <div className="text-3xl font-bold text-white mb-3 whitespace-nowrap">
                  {t.pricing.priceLabel} {DISCOVERY_PRICE.toLocaleString()}
                </div>
                <ul className="grid grid-cols-1 mobile:grid-cols-2 gap-x-6 gap-y-1 text-left">
                  {t.pricing.discovery.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-brand-300 mt-0.5 flex-none" aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 右：CTA */}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold text-base shadow-glow-md min-h-[44px] transition-colors"
              >
                {t.pricing.discovery.ctaLabel}
              </a>
            </div>
          </div>
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
