import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = {
  name: string
  tagline?: string
  price: number
  priceLabel?: string         // 'NT$' 等
  deliverables: ReadonlyArray<string>
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  hottestLabel?: string       // '最熱門' / 'Most Popular'
  className?: string
}

export function PlanCard({
  name, tagline, price, priceLabel = 'NT$',
  deliverables, ctaLabel, ctaHref,
  highlighted, hottestLabel,
  className,
}: Props) {
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
      {highlighted && hottestLabel && (
        <span
          className={cn(
            'absolute px-3 py-1 rounded-full text-sm font-semibold',
            'bg-brand-500 text-white shadow-glow-md',
            // desktop：右上角；mobile：卡頂置中
            'top-3 right-3 desktop:top-3 desktop:right-3',
            'mobile:top-[-12px] mobile:left-1/2 mobile:-translate-x-1/2 mobile:right-auto desktop:translate-x-0',
          )}
        >
          {hottestLabel}
        </span>
      )}
      <div className="text-gray-200 text-xl font-medium mb-1">{name}</div>
      {tagline && <div className="text-gray-400 text-base mb-3">{tagline}</div>}
      <div className="text-6xl font-bold text-white mb-5">
        {priceLabel} {price.toLocaleString()}
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {deliverables.map((d) => (
          <li key={d} className="flex items-start gap-2 text-gray-300 text-base">
            <Check className="w-4 h-4 text-brand-300 mt-0.5 flex-none" aria-hidden="true" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center justify-center w-full py-3 rounded-lg text-base font-semibold min-h-[44px]',
          'transition-colors',
          highlighted
            ? 'bg-brand-500 text-white hover:bg-brand-400'
            : 'border border-border-subtle text-gray-200 hover:bg-surface-hover',
        )}
      >
        {ctaLabel}
      </a>
    </div>
  )
}
