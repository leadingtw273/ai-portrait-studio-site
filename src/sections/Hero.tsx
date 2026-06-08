import { Badge } from '@/components/Badge'
import { useT } from '@/i18n/useT'
import { cn } from '@/lib/cn'

export function Hero() {
  const { t } = useT()
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center px-4 py-20 tablet:py-28 overflow-hidden"
    >
      <div className="relative max-w-3xl mx-auto text-center">
        <Badge className="mb-10">
          {t.hero.badge}
        </Badge>
        <h1 className="text-5xl tablet:text-7xl desktop:text-8xl font-bold font-serif text-content mb-6">
          {t.hero.title}
        </h1>
        <p className="text-lg tablet:text-xl text-content-muted mb-4">{t.hero.subtitle}</p>
        <p className="text-base tablet:text-lg text-content-muted mb-12 max-w-2xl mx-auto">
          {t.hero.description}
        </p>
        <div className="flex flex-col mobile:flex-row items-center justify-center gap-3">
          <a
            href="#demo"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'bg-primary hover:bg-primary-hover text-on-primary font-semibold text-lg',
              'transition-colors shadow-soft min-h-[44px]',
            )}
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#pricing"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'border border-content/[0.15] text-content hover:bg-surface-hover text-lg',
              'transition-colors min-h-[44px]',
            )}
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 mx-auto mt-16 animate-bounce"
          aria-label={t.hero.scrollHint}
          role="img"
        >
          {/* 滑鼠外殼 — 灰色細線 + 透明 */}
          <rect
            x="5"
            y="2"
            width="14"
            height="20"
            rx="7"
            strokeWidth={1.25}
            className="stroke-content/40"
          />
          {/* 內部滾輪 — primary 紫色 */}
          <path d="M12 6v4" strokeWidth={2} className="stroke-primary" />
        </svg>
      </div>
    </section>
  )
}
