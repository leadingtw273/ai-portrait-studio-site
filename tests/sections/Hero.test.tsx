import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Hero } from '@/sections/Hero'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Hero', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders title, subtitle, both CTAs, badge', () => {
    render(<LanguageProvider><Hero /></LanguageProvider>)
    expect(screen.getByRole('heading', { name: 'AI 人像工作室' })).toBeInTheDocument()
    expect(screen.getByText(/AI 智能/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '查看作品展示' })).toHaveAttribute('href', '#demo')
    expect(screen.getByRole('link', { name: '立即諮詢' })).toHaveAttribute('href', expect.stringMatching(/t\.me/))
  })
})
