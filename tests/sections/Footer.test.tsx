import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Footer } from '@/sections/Footer'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Footer', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders logo, tagline, telegram cta, response time, copyright', () => {
    const { container } = render(<LanguageProvider><Footer /></LanguageProvider>)
    // logo 與 copyright 兩處都有 "AI 人像工作室"
    expect(screen.getAllByText(/AI 人像工作室/).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/數位形象/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Telegram/ })).toHaveAttribute('href', expect.stringMatching(/t\.me/))
    expect(screen.getByText(/24 小時內/)).toBeInTheDocument()
    expect(screen.getByText(/© 2026/)).toBeInTheDocument()
    // 確認 copyright 文案是繁中（不是被改成英文）
    expect(container.textContent).toContain('© 2026 AI 人像工作室. All rights reserved.')
  })

  it('does NOT render terms of service or privacy policy links', () => {
    render(<LanguageProvider><Footer /></LanguageProvider>)
    expect(screen.queryByText(/服務條款/)).not.toBeInTheDocument()
    expect(screen.queryByText(/隱私政策/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Privacy Policy/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Terms/)).not.toBeInTheDocument()
  })
})
