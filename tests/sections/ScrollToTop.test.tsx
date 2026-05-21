import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ScrollToTop } from '@/sections/ScrollToTop'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('ScrollToTop', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
  })

  it('hidden when scrollY is small', () => {
    render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    expect(screen.queryByRole('button', { name: '回到頂部' })).not.toBeInTheDocument()
  })

  it('visible when scrollY > 600 (past hero)', () => {
    render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 800, configurable: true, writable: true })
      fireEvent.scroll(window)
    })
    expect(screen.getByRole('button', { name: '回到頂部' })).toBeInTheDocument()
  })

  it('clicking scrolls to top', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })
    render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 800, configurable: true, writable: true })
      fireEvent.scroll(window)
    })
    fireEvent.click(screen.getByRole('button', { name: '回到頂部' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
