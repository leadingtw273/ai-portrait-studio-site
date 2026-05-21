import { type ReactNode } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { Nav } from '@/sections/Nav'
import { LanguageProvider } from '@/i18n/LanguageProvider'

function withProvider(node: ReactNode) {
  return <LanguageProvider>{node}</LanguageProvider>
}

describe('Nav', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders logo and language switcher always', () => {
    render(withProvider(<Nav />))
    expect(screen.getByText(/AI 人像工作室/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '繁中' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '简中' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
  })

  it('renders desktop inline nav with three anchors (always in DOM, hidden by CSS on mobile/tablet)', () => {
    render(withProvider(<Nav />))
    const desktopNav = screen.getByRole('navigation', { name: 'Desktop navigation' })
    expect(within(desktopNav).getByRole('link', { name: '方案' })).toHaveAttribute('href', '#pricing')
    expect(within(desktopNav).getByRole('link', { name: 'Demo' })).toHaveAttribute('href', '#demo')
    expect(within(desktopNav).getByRole('link', { name: '聯絡' })).toHaveAttribute('href', '#contact')
  })

  it('renders hamburger toggle button with proper aria', () => {
    render(withProvider(<Nav />))
    const toggle = screen.getByRole('button', { name: /開啟選單/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'nav-drawer')
  })

  it('mobile drawer is collapsed by default (Mobile navigation not in DOM)', () => {
    render(withProvider(<Nav />))
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument()
  })

  it('opening hamburger reveals mobile drawer with three anchors', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: /開啟選單/ }))
    const drawer = screen.getByRole('navigation', { name: 'Mobile navigation' })
    expect(within(drawer).getByRole('link', { name: '方案' })).toHaveAttribute('href', '#pricing')
    expect(within(drawer).getByRole('link', { name: 'Demo' })).toHaveAttribute('href', '#demo')
    expect(within(drawer).getByRole('link', { name: '聯絡' })).toHaveAttribute('href', '#contact')
  })

  it('clicking a drawer anchor closes the drawer', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: /開啟選單/ }))
    const drawer = screen.getByRole('navigation', { name: 'Mobile navigation' })
    await userEvent.click(within(drawer).getByRole('link', { name: '方案' }))
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument()
  })

  it('switching language updates header text', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByText(/AI Portrait Studio/)).toBeInTheDocument()
  })
})
