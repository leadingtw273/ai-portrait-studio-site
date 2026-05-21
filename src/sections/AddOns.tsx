import { SectionHeader } from '@/components/SectionHeader'
import { AddOnCard } from '@/components/AddOnCard'
import { useT } from '@/i18n/useT'
import { ADDONS } from '@/data/content'

export function AddOns() {
  const { t } = useT()
  // map key → i18n bundle
  const i18nByKey = {
    extraVideo:           t.addons.extraVideo,
    rushDelivery:         t.addons.rushDelivery,
    extraTrainingPhotos:  t.addons.extraTrainingPhotos,
  } as const

  return (
    <section className="px-4 py-12 tablet:py-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={t.addons.title} subtitle={t.addons.subtitle} />
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 mt-8">
          {ADDONS.map((a) => {
            const i = i18nByKey[a.key]
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
    </section>
  )
}
