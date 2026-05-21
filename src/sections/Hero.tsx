import { Send, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/Badge'
import { useT } from '@/i18n/useT'
import { TELEGRAM_URL } from '@/data/content'
import { cn } from '@/lib/cn'

export function Hero() {
  const { t } = useT()
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center px-4 py-20 tablet:py-28">
      {/* 背景 — 低調 gradient + 微弱光暈 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-bg-base via-bg-elevated to-bg-base"
      />
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
        <h1 className="text-4xl tablet:text-6xl desktop:text-7xl font-bold text-white mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base tablet:text-xl text-gray-300 mb-2">{t.hero.subtitle}</p>
        <p className="text-sm tablet:text-base text-gray-400 mb-8 max-w-2xl mx-auto">
          {t.hero.description}
        </p>
        <div className="flex flex-col mobile:flex-row items-center justify-center gap-3">
          <a
            href="#demo"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'bg-brand-500 hover:bg-brand-400 text-white font-semibold',
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
              'border border-border-subtle text-white hover:bg-surface-hover',
              'transition-colors min-h-[44px]',
            )}
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.hero.ctaSecondary}
          </a>
        </div>
        <ChevronDown
          className="w-6 h-6 text-gray-500 mx-auto mt-10 animate-bounce"
          aria-label={t.hero.scrollHint}
        />
      </div>
    </section>
  )
}
