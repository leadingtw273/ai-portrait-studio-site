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
    expect(screen.getByText('基礎方案')).toBeInTheDocument()
    expect(screen.getByText('專業方案')).toBeInTheDocument()
    expect(screen.getByText('企業方案')).toBeInTheDocument()
    expect(screen.getByText(/1,200/)).toBeInTheDocument()
    expect(screen.getByText(/2,800/)).toBeInTheDocument()
    expect(screen.getByText(/5,800/)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: '立即諮詢' })).toHaveLength(3)
  })

  it('only the pro plan shows the hottest badge', () => {
    render(<LanguageProvider><Pricing /></LanguageProvider>)
    expect(screen.getAllByText('最熱門')).toHaveLength(1)
  })
})
