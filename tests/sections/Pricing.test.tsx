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
    expect(screen.getByText(/12,800/)).toBeInTheDocument()
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
