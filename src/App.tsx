import { useEffect } from 'react'
import bgTexture from '@/assets/bg-texture.png'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Demo } from './sections/Demo'
import { Audiences } from './sections/Audiences'
import { FinalCTA } from './sections/FinalCTA'
import { Footer } from './sections/Footer'
import { ScrollToTop } from './sections/ScrollToTop'

// Section dead-zone snap 規則：使用者下滑停在 fromId section 末端時自動 snap 到 toId。
const SNAP_RULES = [
  { fromId: 'top', toId: 'demo', threshold: 0.7 },
  { fromId: 'demo', toId: 'pricing', threshold: 0.9 },
] as const

export function App() {
  // SPA 初始載入時 URL 含 #hash：mount 後手動 scroll 到 target。
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [])

  // Section dead-zone snap（只在下滑時觸發；prefers-reduced-motion 不觸發）
  useEffect(() => {
    if (typeof window.matchMedia === 'function') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    }

    let endTimer: ReturnType<typeof setTimeout> | undefined
    let isAutoScrolling = false
    let releaseTimer: ReturnType<typeof setTimeout> | undefined
    let lastY = window.scrollY
    let lastDirection: 'up' | 'down' = 'down'

    const onScroll = () => {
      if (isAutoScrolling) return
      const currentY = window.scrollY
      if (currentY !== lastY) {
        lastDirection = currentY > lastY ? 'down' : 'up'
        lastY = currentY
      }
      if (endTimer) clearTimeout(endTimer)
      endTimer = setTimeout(() => {
        if (lastDirection !== 'down') return
        const y = window.scrollY
        for (const rule of SNAP_RULES) {
          const fromEl = document.getElementById(rule.fromId)
          const toEl = document.getElementById(rule.toId)
          if (!fromEl || !toEl) continue
          const rect = fromEl.getBoundingClientRect()
          const sectionTop = rect.top + y
          const sectionHeight = rect.height
          const sectionBottom = sectionTop + sectionHeight
          if (y > sectionTop + sectionHeight * rule.threshold && y < sectionBottom) {
            isAutoScrolling = true
            toEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
            releaseTimer = setTimeout(() => { isAutoScrolling = false }, 800)
            return
          }
        }
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (endTimer) clearTimeout(endTimer)
      if (releaseTimer) clearTimeout(releaseTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg text-content">
      {/* 固定極淺紋理背景（中央大留白、不搶文字） */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${bgTexture})` }}
      />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Demo />
          <Audiences />
          <FinalCTA />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  )
}
