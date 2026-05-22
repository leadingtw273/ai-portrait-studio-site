import { Send, Mouse } from 'lucide-react'
import { Badge } from '@/components/Badge'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL } from '@/data/content'
import { cn } from '@/lib/cn'
import heroBg from '@/assets/hero-bg.jpg'

export function Hero() {
  const { t } = useT()
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center px-4 py-20 tablet:py-28 overflow-hidden"
    >
      {/* 背景圖 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* dark gradient overlay — 確保文字可讀（下半部較暗、CTA 周圍對比夠） */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(14,11,31,0.35) 0%, rgba(14,11,31,0.55) 50%, rgba(14,11,31,0.8) 100%)',
        }}
      />
      {/* 微弱紫光（保留 hero 氛圍） */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(168,85,247,0.25), transparent 60%)',
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <Badge className="mb-6">
          {t.hero.badge}
        </Badge>
        <h1 className="text-5xl tablet:text-7xl desktop:text-8xl font-bold text-white mb-4">
          {t.hero.title}
        </h1>
        <p className="text-lg tablet:text-xl text-gray-300 mb-2">{t.hero.subtitle}</p>
        <p className="text-base tablet:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          {t.hero.description}
        </p>
        <div className="flex flex-col mobile:flex-row items-center justify-center gap-3">
          <a
            href="#demo"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg',
              'transition-colors shadow-glow-md min-h-[44px]',
            )}
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'border border-border-subtle text-white hover:bg-surface-hover text-lg',
              'transition-colors min-h-[44px]',
            )}
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.hero.ctaSecondary}
          </a>
        </div>
        <Mouse
          className="w-6 h-6 text-gray-400 mx-auto mt-10 animate-bounce"
          aria-label={t.hero.scrollHint}
        />
      </div>
    </section>
  )
}
