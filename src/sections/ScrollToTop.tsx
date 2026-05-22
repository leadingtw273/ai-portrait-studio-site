import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { cn } from '@/lib/cn'

const SHOW_THRESHOLD_PX = 600

export function ScrollToTop() {
  const { t } = useT()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD_PX)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label={t.scrollToTop.label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed right-8 bottom-8 z-40',
        'w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-400',
        'shadow-glow-lg transition-colors',
        'flex items-center justify-center',
      )}
    >
      <ChevronUp className="w-6 h-6 text-white" aria-hidden="true" />
    </button>
  )
}
