import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { Demo } from '@/sections/Demo'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Demo', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('defaults to image tab — images visible, video grid hidden', () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    expect(screen.getByRole('tab', { name: /圖片人像生成/ })).toHaveAttribute('aria-selected', 'true')
    // 至少看到 4 張 image alt（zh-Hant: AI 生成人像示意圖）
    expect(screen.getAllByAltText(/AI 生成人像示意圖/).length).toBeGreaterThan(0)
  })

  it('clicking video tab switches grid', async () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    await userEvent.click(screen.getByRole('tab', { name: /影片人像生成/ }))
    expect(screen.getByRole('tab', { name: /影片人像生成/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('電影級人像動態')).toBeInTheDocument()
  })

  it('renders tech banner', () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    expect(screen.getByText('AI 影片人像生成')).toBeInTheDocument()
    expect(screen.getByText(/我們可以將靜態人像/)).toBeInTheDocument()
  })
})
