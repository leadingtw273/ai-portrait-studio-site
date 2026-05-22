import { render, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ScrollToTop } from '@/sections/ScrollToTop'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('ScrollToTop', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
  })

  it('hidden state (opacity-0 + aria-hidden + tabIndex=-1) when scrollY is small', () => {
    const { container } = render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    const btn = container.querySelector('button')!
    expect(btn).toHaveClass('opacity-0')
    expect(btn).toHaveClass('scale-90')
    expect(btn).toHaveClass('pointer-events-none')
    expect(btn).toHaveAttribute('aria-hidden', 'true')
    expect(btn).toHaveAttribute('tabIndex', '-1')
  })

  it('visible state (opacity-100 + scale-100) when scrollY > 600', () => {
    const { container } = render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 800, configurable: true, writable: true })
      fireEvent.scroll(window)
    })
    const btn = container.querySelector('button')!
    expect(btn).toHaveClass('opacity-100')
    expect(btn).toHaveClass('scale-100')
    expect(btn).toHaveClass('pointer-events-auto')
    expect(btn).toHaveAttribute('aria-hidden', 'false')
    expect(btn).toHaveAttribute('tabIndex', '0')
  })

  it('clicking scrolls to top', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })
    const { container } = render(<LanguageProvider><ScrollToTop /></LanguageProvider>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 800, configurable: true, writable: true })
      fireEvent.scroll(window)
    })
    fireEvent.click(container.querySelector('button')!)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
