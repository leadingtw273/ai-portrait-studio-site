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
          ? 'border border-primary bg-primary/[0.08] shadow-soft-lg'
          : 'border border-content/10 bg-surface shadow-soft',
        className,
      )}
    >
      {badge && (
        <span
          className={cn(
            'absolute px-3 py-1 text-sm font-semibold shadow-glow-md',
            badgeVariant === 'gold' ? 'bg-[#D4AF37] text-black' : 'bg-primary text-on-primary',
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
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 border border-primary/25"
          >
            {icon}
          </span>
        )}
        <div className="text-content text-xl font-medium">{name}</div>
      </div>
      {tagline && <div className="text-content-muted text-base mb-5">{tagline}</div>}

      {/* 痛點區（muted 子面板） */}
      <div className="rounded-xl bg-primary/[0.08] border border-content/10 p-4 mb-5">
        <div className="text-content-muted text-sm font-semibold mb-3">{painTitle}</div>
        <ul className="space-y-2">
          {pains.map((p) => (
            <li key={p} className="flex items-start gap-2 text-content-muted text-sm">
              <Minus className="w-4 h-4 mt-0.5 flex-none text-content-muted" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 解法區 */}
      <div className="mb-6 flex-1">
        <div className="text-primary text-sm font-semibold mb-3">{solutionTitle}</div>
        <ul className="space-y-2">
          {solutions.map((s) => (
            <li key={s} className="flex items-start gap-2 text-content text-base">
              <Check className="w-4 h-4 mt-0.5 flex-none text-primary" aria-hidden="true" />
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
            ? 'bg-primary text-on-primary hover:bg-primary-hover'
            : 'border border-primary/25 text-content hover:bg-surface-hover',
        )}
      >
        {ctaLabel}
      </a>
    </div>
  )
}
