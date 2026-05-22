import { type ReactNode, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

export type Tab<T extends string> = { id: T; label: string; icon?: ReactNode }

type Props<T extends string> = {
  tabs: ReadonlyArray<Tab<T>>
  value: T
  onChange: (id: T) => void
  className?: string
}

export function TabSegment<T extends string>({ tabs, value, onChange, className }: Props<T>) {
  const activeIdx = Math.max(0, tabs.findIndex((t) => t.id === value))

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      onChange(tabs[(currentIdx + 1) % tabs.length].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      onChange(tabs[(currentIdx - 1 + tabs.length) % tabs.length].id)
    }
  }

  return (
    <div
      role="tablist"
      className={cn(
        'relative inline-flex p-1 rounded-full glass shadow-glow-md',
        className,
      )}
    >
      {/* 滑動指示器 — 紫色 fill 跟著 activeIdx 滑 */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 rounded-full bg-brand-500 shadow-glow-md transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${tabs.length})`,
          transform: `translateX(${activeIdx * 100}%)`,
        }}
      />
      {tabs.map((tab, idx) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKey(e, idx)}
            className={cn(
              'relative z-10 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-base transition-colors',
              'min-h-[44px]',
              active
                ? 'text-white'
                : 'text-gray-300 hover:text-white',
            )}
          >
            {tab.icon && <span className="w-4 h-4 inline-flex items-center">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
