import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { App } from '@/App'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('App smoke', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders all sections without crashing', () => {
    render(<LanguageProvider><App /></LanguageProvider>)
    expect(screen.getAllByRole('heading')).not.toHaveLength(0)
    expect(screen.getAllByText(/AI 影像工作室/).length).toBeGreaterThan(0)
    expect(screen.getByText('AI 生成作品範例')).toBeInTheDocument()
    expect(screen.getByText('我們服務這三類客戶')).toBeInTheDocument()
    expect(screen.getByText('品牌・廣告主')).toBeInTheDocument()
    expect(screen.getByText('不確定你屬於哪一類客戶？')).toBeInTheDocument()
    expect(screen.getByText(/© 2026/)).toBeInTheDocument()
  })

  it('renders with zh-Hans dictionary', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    render(<LanguageProvider><App /></LanguageProvider>)
    expect(screen.getByText('AI 生成作品范例')).toBeInTheDocument()
    expect(screen.getByText('我们服务这三类客户')).toBeInTheDocument()
    expect(screen.getByText('品牌・广告主')).toBeInTheDocument()
  })

  it('renders with en dictionary', () => {
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true })
    render(<LanguageProvider><App /></LanguageProvider>)
    expect(screen.getByText('AI Portrait Showcase')).toBeInTheDocument()
    expect(screen.getByText('We serve these three types of clients')).toBeInTheDocument()
    expect(screen.getByText('Brands & Advertisers')).toBeInTheDocument()
  })

  it('all TG links open in new tab with noopener', () => {
    render(<LanguageProvider><App /></LanguageProvider>)
    const tgLinks = screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.includes('t.me'))
    expect(tgLinks.length).toBeGreaterThanOrEqual(3)
    for (const link of tgLinks) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
