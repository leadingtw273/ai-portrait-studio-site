import { type ReactNode } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'brand' | 'gold'

type Props = {
  name: string
  icon?: ReactNode
  tagline?: string
  painTitle: string
  pains: ReadonlyArray<string>
  solutionTitle: string
  solutions: ReadonlyArray<string>
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  badge?: { label: string; variant?: BadgeVariant }
  className?: string
}

export function AudienceCard({
  name, icon, tagline,
  painTitle, pains, solutionTitle, solutions,
  ctaLabel, ctaHref,
  highlighted, badge, className,
}: Props) {
  const badgeVariant: BadgeVariant = badge?.variant ?? 'brand'
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 flex flex-col h-full',
        highlighted
          ? 'border border-brand-500 bg-gradient-to-b from-brand-500/15 to-brand-500/5 shadow-glow-lg'
          : 'border border-border-subtle bg-surface',
        className,
      )}
    >
      {badge && (
        <span
          className={cn(
            'absolute px-3 py-1 text-sm font-semibold shadow-glow-md',
            badgeVariant === 'gold' ? 'bg-[#D4AF37] text-black' : 'bg-brand-500 text-white',
            'top-[-12px] left-1/2 -translate-x-1/2 rounded-full',
            'desktop:top-0 desktop:right-0 desktop:left-auto desktop:translate-x-0',
            'desktop:rounded-tl-none desktop:rounded-br-none desktop:rounded-tr-2xl desktop:rounded-bl-2xl',
          )}
        >
          {badge.label}
        </span>
      )}

      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <span
            aria-hidden="true"
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-500/20 border border-border-brand"
          >
            {icon}
          </span>
        )}
        <div className="text-gray-200 text-xl font-medium">{name}</div>
      </div>
      {tagline && <div className="text-gray-400 text-base mb-5">{tagline}</div>}

      {/* 痛點區（muted 子面板） */}
      <div className="rounded-xl bg-bg-base/40 border border-border-subtle p-4 mb-5">
        <div className="text-amber-200/90 text-sm font-semibold mb-3">{painTitle}</div>
        <ul className="space-y-2">
          {pains.map((p) => (
            <li key={p} className="flex items-start gap-2 text-gray-400 text-sm">
              <Minus className="w-4 h-4 mt-0.5 flex-none text-amber-300/70" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 解法區 */}
      <div className="mb-6 flex-1">
        <div className="text-brand-300 text-sm font-semibold mb-3">{solutionTitle}</div>
        <ul className="space-y-2">
          {solutions.map((s) => (
            <li key={s} className="flex items-start gap-2 text-gray-200 text-base">
              <Check className="w-4 h-4 mt-0.5 flex-none text-brand-300" aria-hidden="true" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'mt-auto inline-flex items-center justify-center w-full py-3 rounded-lg text-base font-semibold min-h-[44px] transition-colors',
          highlighted
            ? 'bg-brand-500 text-white hover:bg-brand-400'
            : 'border border-border-brand text-gray-200 hover:bg-surface-hover',
        )}
      >
        {ctaLabel}
      </a>
    </div>
  )
}
