import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full text-sm',
        'border border-primary/25 bg-primary/[0.08] backdrop-blur-sm text-primary',
        'shadow-soft',
        className,
      )}
    >
      <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
      {children}
    </span>
  )
}
