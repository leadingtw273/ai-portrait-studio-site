import { cn } from '@/lib/cn'
import type { AddOnTagVariant } from '@/data/content'

type Props = {
  emoji: string
  name: string
  desc: string
  priceMain: string
  tagLabel?: string
  tagVariant?: AddOnTagVariant
  className?: string
}

export function AddOnCard({
  emoji, name, desc, priceMain, tagLabel, tagVariant,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'h-full rounded-2xl p-5 border border-border-subtle bg-surface flex flex-col',
        className,
      )}
    >
      {/* icon + 標題 + 副標題 同行排列、icon 縮小 0.7×、垂直置中 */}
      <div className="flex items-center gap-4 mb-4 flex-1">
        <div className="text-[42px] leading-none shrink-0 self-center" aria-hidden="true">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-lg font-medium mb-1">{name}</div>
          <div className="text-gray-400 text-sm leading-relaxed">{desc}</div>
        </div>
      </div>

      {/* Bottom row：< desktop (1024) 垂直 stack 且全部靠右；desktop+ 左下 tag / 右下 price 同行 */}
      <div className="flex flex-col items-end gap-2 desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-3 mt-auto">
        {tagLabel && (
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-glow-md whitespace-nowrap',
              tagVariant === 'pro-only'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-brand-500 text-white',
            )}
          >
            {tagLabel}
          </span>
        )}
        <div className="text-brand-300 text-xl font-bold whitespace-nowrap text-right desktop:ml-auto">
          {priceMain}
        </div>
      </div>
    </div>
  )
}
