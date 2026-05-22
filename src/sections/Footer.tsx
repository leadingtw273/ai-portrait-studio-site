import { Sparkles, Send } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL, TELEGRAM_HANDLE } from '@/data/content'

export function Footer() {
  const { t } = useT()
  return (
    <footer className="px-4 pt-12 pb-6 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-white font-semibold mb-2 text-lg">
          <Sparkles className="w-4 h-4 text-brand-300" aria-hidden="true" />
          {t.hero.title}
        </div>
        <p className="text-gray-400 text-base max-w-xl mx-auto mb-8">{t.footer.tagline}</p>

        <div className="mb-8">
          <div className="text-gray-300 text-base mb-3">{t.footer.contactTitle}</div>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-colors min-h-[44px] text-base"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.footer.telegramButton}
          </a>
          <div className="text-gray-500 text-sm mt-3">
            {t.footer.responseTime}
            <span className="ml-2 text-gray-600 text-sm">{TELEGRAM_HANDLE}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-border-subtle text-gray-500 text-sm">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  )
}
