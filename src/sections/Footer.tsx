import { Sparkles, Send } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL } from '@/data/content'

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

          {/* TG button — desktop 有 relative wrapper 讓 QR 絕對定位在右側 */}
          <div className="relative inline-block">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-colors min-h-[44px] text-base"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              {t.footer.telegramButton}
            </a>
            {/* Desktop QR — absolute 定在 TG button 右側、小尺寸無 caption */}
            <div className="hidden desktop:block absolute left-full top-1/2 -translate-y-1/2 ml-6">
              <div className="p-2 rounded-lg bg-white">
                <QRCodeSVG value={TELEGRAM_URL} size={72} level="M" aria-label={t.footer.qrCaption} />
              </div>
            </div>
          </div>

          <div className="text-gray-500 text-sm mt-3">{t.footer.responseTime}</div>

          {/* Mobile/Tablet QR — 接在 contact 區塊下方、大尺寸 + caption */}
          <div className="desktop:hidden mt-5 flex flex-col items-center gap-2">
            <div className="p-3 rounded-lg bg-white">
              <QRCodeSVG value={TELEGRAM_URL} size={140} level="M" aria-label={t.footer.qrCaption} />
            </div>
            <div className="text-gray-500 text-xs">{t.footer.qrCaption}</div>
          </div>
        </div>

        <div className="pt-6 border-t border-border-subtle text-gray-500 text-sm">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  )
}
