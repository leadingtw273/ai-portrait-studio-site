import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs',
        'border border-border-brand bg-brand-500/10 text-brand-300',
        'shadow-glow-md',
        className,
      )}
    >
      <Sparkles className="w-3 h-3" aria-hidden="true" />
      {children}
    </span>
  )
}
