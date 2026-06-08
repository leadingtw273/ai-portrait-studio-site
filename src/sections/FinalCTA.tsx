import { Sparkles } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL } from '@/data/content'

export function FinalCTA() {
  const { t } = useT()
  return (
    <section id="contact" className="px-4 py-12 tablet:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="glow-border-gradient shadow-soft-lg">
          <div className="p-8 tablet:p-10 text-center">
            <h3 className="text-3xl tablet:text-4xl font-bold font-serif text-content mb-3">
              {t.finalCta.title}
            </h3>
            <p className="text-content-muted mb-6 text-lg">
              {t.finalCta.description}
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-12 py-3 rounded-lg bg-primary hover:bg-primary-hover text-on-primary font-semibold text-lg transition-colors shadow-soft min-h-[44px] min-w-[280px]"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              {t.finalCta.button}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
