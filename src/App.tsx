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

// 整頁固定 dark base（hero 也包含）= BASE_BG_OPACITY 永遠存在。
// Scroll 從 hero 滑到下一視窗時：
//   - blur 從 0 漸增到 MAX_BLUR_PX
//   - bg-opacity 從 BASE_BG_OPACITY 漸增到 BASE_BG_OPACITY + MAX_EXTRA_BG_OPACITY
// 都用 t² 指數曲線（慢起快收）。Overlay 是 fixed cover 整個 viewport、
// 不會產生 hero/demo 接縫的色帶（hero 內已無獨立 overlay）。
const BASE_BG_OPACITY = 0.45
const MAX_EXTRA_BG_OPACITY = 0.35
const MAX_BLUR_PX = 40

export function App() {
  const [progress, setProgress] = useState(0)

  // Scroll-driven blur/bg overlay progress
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

  // 處理 SPA 初始載入時 URL 含 #hash 的情況：
  // 瀏覽器在 page navigation 時 hash anchor element 尚未 mount，
  // 預設 scroll 找不到目標 → 停在 top。Mount 後手動 scroll 到 target。
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1) // 去 '#' 前綴
    if (!id) return
    // 等 sections render + layout 穩定後再 scroll
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [])

  const blur = progress * MAX_BLUR_PX
  const bgOpacity = BASE_BG_OPACITY + progress * MAX_EXTRA_BG_OPACITY

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
