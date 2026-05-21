import { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
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

  it('renders hamburger toggle button with proper aria', () => {
    render(withProvider(<Nav />))
    const toggle = screen.getByRole('button', { name: /開啟選單/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'nav-drawer')
  })

  it('drawer is collapsed by default (anchor links not in document)', () => {
    render(withProvider(<Nav />))
    expect(screen.queryByRole('link', { name: '方案' })).not.toBeInTheDocument()
  })

  it('opening hamburger reveals three anchor links', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: /開啟選單/ }))
    expect(screen.getByRole('link', { name: '方案' })).toHaveAttribute('href', '#pricing')
    expect(screen.getByRole('link', { name: 'Demo' })).toHaveAttribute('href', '#demo')
    expect(screen.getByRole('link', { name: '聯絡' })).toHaveAttribute('href', '#contact')
  })

  it('clicking an anchor closes the drawer', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: /開啟選單/ }))
    await userEvent.click(screen.getByRole('link', { name: '方案' }))
    expect(screen.queryByRole('link', { name: '方案' })).not.toBeInTheDocument()
  })

  it('switching language updates header text', async () => {
    render(withProvider(<Nav />))
    await userEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByText(/AI Portrait Studio/)).toBeInTheDocument()
  })
})
