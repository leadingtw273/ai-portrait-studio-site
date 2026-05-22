import { cn } from '@/lib/cn'
import type { AddOnTagVariant } from '@/data/content'

type Props = {
  emoji: string
  name: string
  desc: string
  priceMain: string         // 'NT$ 1,800 / 套 (20 張變化)' or '+ 30% 費用'
  priceBonus?: string       // '買 3 套 NT$ 4,800（省 NT$600）'
  tagLabel?: string         // 'Pro 包月免費 ⭐' / '限 Pro 客戶 🔒'
  tagVariant?: AddOnTagVariant
  className?: string
}

export function AddOnCard({
  emoji, name, desc, priceMain, priceBonus, tagLabel, tagVariant,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'relative h-full rounded-2xl p-5 border border-border-subtle bg-surface flex flex-col',
        className,
      )}
    >
      {/* Tag — 右上角、variant 控色 */}
      {tagLabel && (
        <span
          className={cn(
            'absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-glow-md whitespace-nowrap',
            tagVariant === 'pro-only'
              ? 'bg-[#D4AF37] text-black'
              : 'bg-brand-500 text-white',
          )}
        >
          {tagLabel}
        </span>
      )}

      {/* icon + 標題 + 副標題 同行排列 */}
      <div className="flex items-start gap-3 mb-4 flex-1">
        <div className="text-4xl leading-none shrink-0" aria-hidden="true">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-lg font-medium mb-1">{name}</div>
          <div className="text-gray-400 text-sm leading-relaxed">{desc}</div>
        </div>
      </div>

      {/* Price 區（push to bottom）*/}
      <div className="mt-auto">
        <div className="text-brand-300 text-xl font-bold whitespace-nowrap">{priceMain}</div>
        {priceBonus && (
          <div className="text-gray-400 text-xs mt-1">{priceBonus}</div>
        )}
      </div>
    </div>
  )
}
