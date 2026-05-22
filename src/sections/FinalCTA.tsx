import { Sparkles } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL } from '@/data/content'

export function FinalCTA() {
  const { t } = useT()
  return (
    <section id="contact" className="px-4 py-12 tablet:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="glow-border-gradient shadow-glow-xl">
          <div className="p-8 tablet:p-10 text-center">
            <h3 className="text-3xl tablet:text-4xl font-bold text-white mb-3">
              {t.finalCta.title}
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              {t.finalCta.description}
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg transition-colors shadow-glow-md min-h-[44px]"
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
