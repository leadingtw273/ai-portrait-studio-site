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

  return (
    <button
      type="button"
      aria-label={t.scrollToTop.label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed right-8 bottom-8 z-40',
        'w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-400',
        'shadow-glow-lg flex items-center justify-center',
        'transition-all duration-300 ease-out',
        visible
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-90 pointer-events-none',
      )}
    >
      <ChevronUp className="w-6 h-6 text-white" aria-hidden="true" />
    </button>
  )
}
