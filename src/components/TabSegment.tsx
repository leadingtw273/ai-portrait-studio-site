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
        'inline-flex p-1 rounded-full glass shadow-glow-md',
        className,
      )}
    >
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
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors',
              'min-h-[44px]',
              active
                ? 'bg-brand-500 text-white shadow-glow-md'
                : 'text-gray-300 hover:text-white hover:bg-surface-hover',
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
