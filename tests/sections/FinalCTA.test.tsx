import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { FinalCTA } from '@/sections/FinalCTA'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('FinalCTA', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders the persuasion title, description, telegram CTA', () => {
    render(<LanguageProvider><FinalCTA /></LanguageProvider>)
    expect(screen.getByText('不確定哪個方案適合您？')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /免費諮詢/ })
    expect(link).toHaveAttribute('href', expect.stringMatching(/t\.me/))
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
