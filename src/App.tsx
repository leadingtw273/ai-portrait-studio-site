import { useEffect, useState } from 'react'
import heroBg from '@/assets/hero-bg.jpg'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Demo } from './sections/Demo'
import { Pricing } from './sections/Pricing'
import { AddOns } from './sections/AddOns'
import { FinalCTA } from './sections/FinalCTA'
import { Footer } from './sections/Footer'
import { ScrollToTop } from './sections/ScrollToTop'

// 從 hero（scrollY=0）滑到下一視窗（scrollY=window.innerHeight）期間，
// blur / opacity 從 0 漸增到 max；用 t² 製造指數曲線（慢起快收）。
const MAX_BLUR_PX = 24
const MAX_BG_OPACITY = 0.7

export function App() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const compute = () => {
      const vh = window.innerHeight || 1
      const t = Math.min(1, window.scrollY / vh)
      // 指數曲線（慢起快收）：t²
      setProgress(t * t)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    compute()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const blur = progress * MAX_BLUR_PX
  const bgOpacity = progress * MAX_BG_OPACITY

  return (
    <div className="min-h-screen bg-bg-base text-white">
      {/* 固定背景圖（永遠在底層） */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Scroll-driven 毛玻璃 overlay（hero 完全透明、滑下漸強到 demo 全 blur） */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          backgroundColor: `rgba(14, 11, 31, ${bgOpacity})`,
        }}
      />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Demo />
          <Pricing />
          <AddOns />
          <FinalCTA />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  )
}
