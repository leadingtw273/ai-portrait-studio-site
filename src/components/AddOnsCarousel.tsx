import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AddOnCard } from './AddOnCard'
import { ADDON_CARDS } from '@/data/content'
import { useT } from '@/i18n/useT'
import { cn } from '@/lib/cn'

const AUTOPLAY_MS = 5000
const PAUSE_AFTER_INTERACTION_MS = 8000

function getVisibleCount(width: number): number {
  if (width >= 1024) return 3
  if (width >= 768) return 2
  return 1
}

export function AddOnsCarousel() {
  const { t } = useT()
  const [visibleCount, setVisibleCount] = useState(3)
  const [startIdx, setStartIdx] = useState(0)
  const pauseUntilRef = useRef(0) // timestamp (ms) — autoplay 在此之前都暫停

  const total = ADDON_CARDS.length
  const maxStart = Math.max(0, total - visibleCount)

  // 響應式 visibleCount
  useEffect(() => {
    const compute = () => setVisibleCount(getVisibleCount(window.innerWidth))
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // visibleCount 變動時若 startIdx 超出範圍、reset
  useEffect(() => {
    if (startIdx > maxStart) setStartIdx(0)
  }, [maxStart, startIdx])

  // Autoplay：每 AUTOPLAY_MS 往後移一張（循環）
  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return
      setStartIdx((i) => (i + 1 > maxStart ? 0 : i + 1))
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [maxStart])

  const handleNav = (delta: 1 | -1) => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS
    setStartIdx((i) => {
      const next = i + delta
      if (next < 0) return maxStart
      if (next > maxStart) return 0
      return next
    })
  }

  // translateX% = -startIdx * (100 / visibleCount)
  // 每張卡 width = 100% / visibleCount (in container)
  const cardWidthPct = 100 / visibleCount
  const trackTranslatePct = -(startIdx * cardWidthPct)

  return (
    <div className="relative">
      {/* 左右箭頭 */}
      <button
        type="button"
        onClick={() => handleNav(-1)}
        aria-label={t.addons.prevLabel}
        className={cn(
          'absolute z-10 top-1/2 -translate-y-1/2 left-0 tablet:-left-4 desktop:-left-6',
          'w-10 h-10 rounded-full bg-bg-base/80 backdrop-blur-sm border border-border-brand',
          'inline-flex items-center justify-center text-brand-300 hover:bg-brand-500/20 hover:text-white',
          'transition-colors shadow-glow-md',
        )}
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => handleNav(1)}
        aria-label={t.addons.nextLabel}
        className={cn(
          'absolute z-10 top-1/2 -translate-y-1/2 right-0 tablet:-right-4 desktop:-right-6',
          'w-10 h-10 rounded-full bg-bg-base/80 backdrop-blur-sm border border-border-brand',
          'inline-flex items-center justify-center text-brand-300 hover:bg-brand-500/20 hover:text-white',
          'transition-colors shadow-glow-md',
        )}
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Carousel track */}
      <div className="overflow-hidden px-12 tablet:px-8 desktop:px-10">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${trackTranslatePct}%)` }}
        >
          {ADDON_CARDS.map((card) => {
            const i18nCard = t.addons.cards[card.key]
            return (
              <div
                key={card.key}
                className="shrink-0 px-2"
                style={{ width: `${cardWidthPct}%` }}
              >
                <AddOnCard
                  emoji={card.emoji}
                  name={i18nCard.name}
                  desc={i18nCard.desc}
                  priceMain={i18nCard.priceMain}
                  tagLabel={'tagLabel' in i18nCard ? i18nCard.tagLabel : undefined}
                  tagVariant={card.tagVariant}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: maxStart + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS
              setStartIdx(i)
            }}
            aria-label={`${t.addons.nextLabel} ${i + 1}`}
            aria-current={i === startIdx ? 'true' : undefined}
            className={cn(
              'h-2 rounded-full transition-all',
              i === startIdx
                ? 'w-8 bg-brand-500'
                : 'w-2 bg-gray-500 hover:bg-gray-400',
            )}
          />
        ))}
      </div>
    </div>
  )
}
