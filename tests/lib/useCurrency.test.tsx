import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCurrency } from '@/lib/useCurrency'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('useCurrency — hydration-safe initial state (Task 14)', () => {
  beforeEach(() => {
    // Block any real fetch to prevent test flakiness + simulate prerender's
    // "external fetch blocked" behavior. The hook should still produce a
    // valid format() output via the rate=null fallback.
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('blocked'))))
    localStorage.clear()
  })

  function renderInLang(lang: 'zh-Hant' | 'zh-Hans' | 'en') {
    window.history.replaceState({}, '', `/ai-portrait-studio-site/${lang}/`)
    return renderHook(() => useCurrency(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
  }

  it('zh-Hant initial: currency=TWD, rate=1, format produces NT$', () => {
    const { result } = renderInLang('zh-Hant')
    expect(result.current.currency).toBe('TWD')
    expect(result.current.rate).toBe(1)
    expect(result.current.format(12800)).toMatch(/^NT\$ 12,800$/)
  })

  it('zh-Hans initial: currency=CNY, rate=null, format falls back to NT$ (hydration-safe)', () => {
    const { result } = renderInLang('zh-Hans')
    expect(result.current.currency).toBe('CNY')
    expect(result.current.rate).toBeNull()
    // Hydration-critical: when rate is null, format returns NT$ 原價 —
    // this is the value prerender HTML contains AND client first frame contains.
    expect(result.current.format(12800)).toMatch(/^NT\$ 12,800$/)
  })

  it('en initial: currency=USD, rate=null, format falls back to NT$ (hydration-safe)', () => {
    const { result } = renderInLang('en')
    expect(result.current.currency).toBe('USD')
    expect(result.current.rate).toBeNull()
    expect(result.current.format(12800)).toMatch(/^NT\$ 12,800$/)
  })

  it('symbol matches currency', () => {
    expect(renderInLang('zh-Hant').result.current.symbol).toBe('NT$')
    expect(renderInLang('zh-Hans').result.current.symbol).toBe('¥')
    expect(renderInLang('en').result.current.symbol).toBe('US$')
  })
})
