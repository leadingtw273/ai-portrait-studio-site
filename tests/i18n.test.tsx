import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { useT } from '@/i18n/useT'

const STORAGE_KEY = 'ai-portrait-studio-lang'

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

  it('setLang switches dictionary and updates localStorage + html lang', async () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('title').textContent).toBe('AI 人像工作室')

    act(() => { screen.getByTestId('to-en').click() })
    expect(screen.getByTestId('title').textContent).toBe('AI Portrait Studio')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')

    act(() => { screen.getByTestId('to-hans').click() })
    expect(screen.getByTestId('lang').textContent).toBe('zh-Hans')
    expect(document.documentElement.lang).toBe('zh-Hans')
  })

  it('reads from localStorage on next mount', () => {
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
    localStorage.setItem(STORAGE_KEY, 'en')
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('useT outside provider throws', () => {
    expect(() => render(<Probe />)).toThrow(/LanguageProvider/)
  })
})
