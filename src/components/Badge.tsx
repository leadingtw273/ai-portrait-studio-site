import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full text-sm',
        'border border-border-brand bg-white/[0.04] backdrop-blur-sm text-purple-200',
        'shadow-glow-md',
        className,
      )}
    >
      <Sparkles className="w-3 h-3 text-brand-300" aria-hidden="true" />
      {children}
    </span>
  )
}
