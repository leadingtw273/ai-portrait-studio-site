import { Megaphone, Clapperboard, LayoutGrid, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { AudienceCard } from '@/components/AudienceCard'
import { useT } from '@/i18n/useT'
import { AUDIENCES, TELEGRAM_URL, type AudienceKey } from '@/data/content'

const ICONS: Record<AudienceKey, LucideIcon> = {
  brand:    Megaphone,
  creator:  Clapperboard,
  operator: LayoutGrid,
}

export function Audiences() {
  const { t } = useT()
  const a = t.audiences

  return (
    <section id="pricing" className="px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader badge={a.badge} title={a.title} subtitle={a.subtitle} />

        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8 mt-16 tablet:max-w-lg tablet:mx-auto desktop:max-w-none desktop:items-stretch">
          {AUDIENCES.map((aud) => {
            const Icon = ICONS[aud.key]
            const card = a.cards[aud.key]
            return (
              <AudienceCard
                key={aud.key}
                name={card.name}
                icon={<Icon className="w-4 h-4 text-brand-300" aria-hidden="true" />}
                tagline={card.tagline}
                painTitle={a.painTitle}
                pains={card.pains}
                solutionTitle={a.solutionTitle}
                solutions={card.solutions}
                ctaLabel={card.ctaLabel}
                ctaHref={TELEGRAM_URL}
                highlighted={aud.highlighted}
                badge={aud.special ? { label: a.specialBadge, variant: 'gold' } : undefined}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
