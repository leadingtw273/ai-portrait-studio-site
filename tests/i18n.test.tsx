import { render, screen, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { useT } from '@/i18n/useT'

function Probe() {
  const { t, lang, setLang } = useT()
  return (
    <div>
      <span data-testid="title">{t.hero.title}</span>
      <span data-testid="lang">{lang}</span>
      <button data-testid="to-en" onClick={() => setLang('en')}>en</button>
      <button data-testid="to-hans" onClick={() => setLang('zh-Hans')}>hans</button>
    </div>
  )
}

describe('i18n', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = ''
    // reset pathname to root (no lang prefix) so navigator.language fallback governs
    window.history.replaceState({}, '', '/ai-portrait-studio-site/')
  })

  it('defaults to zh-Hant title on first visit when navigator.language is zh-TW', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('title').textContent).toBe('AI 人像工作室')
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hant')
    expect(document.documentElement.lang).toBe('zh-Hant')
  })

  it('detects zh-Hans for navigator.language zh-CN', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hans')
  })

  it('detects en for navigator.language en-US', () => {
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('falls back to zh-Hant for unrecognized language', () => {
    Object.defineProperty(navigator, 'language', { value: 'ja-JP', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hant')
  })

  it('setLang switches dictionary and updates html lang (no longer writes localStorage)', async () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('title').textContent).toBe('AI 人像工作室')

    act(() => { screen.getByTestId('to-en').click() })
    expect(screen.getByTestId('title').textContent).toBe('AI Portrait Studio')
    // Task 5: localStorage is no longer written — URL is the truth source
    expect(localStorage.getItem('ai-portrait-studio-lang')).toBeNull()
    expect(document.documentElement.lang).toBe('en')

    act(() => { screen.getByTestId('to-hans').click() })
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hans')
    expect(document.documentElement.lang).toBe('zh-Hans')
  })

  it('ignores localStorage on mount (URL is truth source after Task 5)', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    // localStorage says 'en' but URL has no lang prefix → navigator.language governs
    localStorage.setItem('ai-portrait-studio-lang', 'en')
    render(<LanguageProvider><Probe /></LanguageProvider>)
    // navigator.language is zh-TW → zh-Hant (localStorage is ignored)
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hant')
  })

  it('useT outside provider throws', () => {
    expect(() => render(<Probe />)).toThrow(/LanguageProvider/)
  })
})

describe('LanguageProvider — URL path detection (Task 5)', () => {
  beforeEach(() => {
    // 重置 location pathname
    window.history.replaceState({}, '', '/')
    localStorage.clear()
  })

  it('detects zh-Hant from /ai-portrait-studio-site/zh-Hant/', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('zh-Hant')
  })

  it('detects zh-Hans from /ai-portrait-studio-site/zh-Hans/', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hans/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('zh-Hans')
  })

  it('detects en from /ai-portrait-studio-site/en/', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/en/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('en')
  })

  it('fallback: navigator zh-TW → zh-Hant', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/')
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('zh-Hant')
  })

  it('fallback: navigator zh-CN → zh-Hans', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/')
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('zh-Hans')
  })

  it('fallback: navigator en-US → en', () => {
    window.history.replaceState({}, '', '/ai-portrait-studio-site/')
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true })
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    expect(result.current.lang).toBe('en')
  })

  it('does NOT read localStorage anymore (URL is the only truth source)', () => {
    localStorage.setItem('ai-portrait-studio-lang', 'en')
    window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
    const { result } = renderHook(() => useT(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
    // URL 是 zh-Hant、就算 localStorage 有 en、也是 zh-Hant
    expect(result.current.lang).toBe('zh-Hant')
  })
})
