import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Pricing } from '@/sections/Pricing'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Pricing', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders three plans with names, prices, ctas', () => {
    render(<LanguageProvider><Pricing /></LanguageProvider>)
    expect(screen.getByText('Mini Launch')).toBeInTheDocument()
    expect(screen.getByText('Standard Launch')).toBeInTheDocument()
    expect(screen.getByText('Pro Launch')).toBeInTheDocument()
    // 12,800 同時出現於 Mini Launch (plan) 與 AddOn loraHandover — 用 getAllByText
    expect(screen.getAllByText(/12,800/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/78,800/)).toBeInTheDocument()
    expect(screen.getByText(/168,800/)).toBeInTheDocument()
    // 兩張 ctaInquiry (basic + pro) + 一張 enterprise ctaLabel (預約 Pro 諮詢) = 3 ctas
    expect(screen.getAllByRole('link', { name: '立即諮詢' })).toHaveLength(2)
    expect(screen.getByRole('link', { name: '預約 Pro 諮詢' })).toBeInTheDocument()
  })

  it('pro plan shows the hottest brand badge, enterprise shows the limited gold badge', () => {
    render(<LanguageProvider><Pricing /></LanguageProvider>)
    expect(screen.getAllByText('最熱門')).toHaveLength(1)
    expect(screen.getAllByText('每月限 3 位')).toHaveLength(1)
  })
})

describe('Pricing — currencyNote (Task 9)', () => {
  function renderInLang(lang: 'zh-Hant' | 'zh-Hans' | 'en') {
    localStorage.clear()
    window.history.replaceState({}, '', `/ai-portrait-studio-site/${lang}/`)
    return render(
      <LanguageProvider>
        <Pricing />
      </LanguageProvider>,
    )
  }

  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('zh-Hant does NOT show currencyNote (TWD is the actual quote)', () => {
    renderInLang('zh-Hant')
    expect(screen.queryByText(/實際以 TWD 報價|实际以 TWD 报价|billed in TWD/i)).not.toBeInTheDocument()
  })

  it('zh-Hans shows currencyNote "实际以 TWD 报价"', () => {
    renderInLang('zh-Hans')
    expect(screen.getByText(/实际以 TWD 报价/)).toBeInTheDocument()
  })

  it('en shows currencyNote "billed in TWD"', () => {
    renderInLang('en')
    expect(screen.getByText(/billed in TWD/i)).toBeInTheDocument()
  })
})
