import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { AddOnsCarousel } from '@/components/AddOnsCarousel'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('AddOnsCarousel — hydration-safe + accessibility (Task 13)', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
  })

  it('renders all 9 addon cards in DOM (carousel state, JS controls which are visible via translateX)', () => {
    render(
      <LanguageProvider>
        <AddOnsCarousel />
      </LanguageProvider>,
    )
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(9)
  })

  it('has prev and next navigation buttons (existing UX preserved)', () => {
    render(
      <LanguageProvider>
        <AddOnsCarousel />
      </LanguageProvider>,
    )
    // aria-label comes from i18n.addons.prevLabel / nextLabel (exact match to avoid matching dots)
    // zh-Hant: "上一張" / "下一張"; en: "Previous" / "Next"
    expect(screen.getByRole('button', { name: /^上一張$|^Previous$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^下一張$|^Next$/i })).toBeInTheDocument()
  })

  it('renders dots indicator (existing UX preserved)', () => {
    render(
      <LanguageProvider>
        <AddOnsCarousel />
      </LanguageProvider>,
    )
    // dots have aria-label: `${nextLabel} ${i + 1}` — e.g. "下一張 1", "下一張 2"
    const dots = screen.getAllByRole('button').filter((b) =>
      /^下一張 \d+$|^next \d+$/i.test(b.getAttribute('aria-label') || ''),
    )
    expect(dots.length).toBeGreaterThanOrEqual(1)
  })
})
