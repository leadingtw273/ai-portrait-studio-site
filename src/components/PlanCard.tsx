import { type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'brand' | 'gold'

type Props = {
  name: string
  icon?: ReactNode            // 標題左側 icon（紫色圓底內）
  tagline?: string
  price: number
  priceLabel?: string         // 'NT$' / 'US$' / '¥' 等
  priceFractionDigits?: number // 顯示小數位數；TWD=0、其他幣別=1
  deliverables: ReadonlyArray<string>
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  badge?: { label: string; variant?: BadgeVariant } // 'brand' (紫) | 'gold' (#D4AF37)
  className?: string
}

export function PlanCard({
  name, icon, tagline, price, priceLabel = 'NT$', priceFractionDigits = 0,
  deliverables, ctaLabel, ctaHref,
  highlighted, badge,
  className,
}: Props) {
  const badgeVariant: BadgeVariant = badge?.variant ?? 'brand'
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 flex flex-col h-full',
        highlighted
          ? 'border border-brand-500 bg-gradient-to-b from-brand-500/15 to-brand-500/5 shadow-glow-lg desktop:scale-[1.07] desktop:z-10'
          : 'border border-border-subtle bg-surface',
        className,
      )}
    >
      {badge && (
        <span
          className={cn(
            'absolute px-3 py-1 text-sm font-semibold shadow-glow-md',
            badgeVariant === 'gold'
              ? 'bg-[#D4AF37] text-black'
              : 'bg-brand-500 text-white',
            // mobile 預設：膠囊浮在卡頂置中
            'top-[-12px] left-1/2 -translate-x-1/2 rounded-full',
            // desktop：corner-attached、貼卡片右上角
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
      {tagline && <div className="text-gray-400 text-base mb-3">{tagline}</div>}
      <div className="text-5xl font-bold text-white mb-5 whitespace-nowrap">
        {priceLabel} {price.toLocaleString(undefined, {
          minimumFractionDigits: priceFractionDigits,
          maximumFractionDigits: priceFractionDigits,
        })}
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
            : 'border border-border-brand text-gray-200 hover:bg-surface-hover',
        )}
      >
        {ctaLabel}
      </a>
    </div>
  )
}
