import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Audiences } from '@/sections/Audiences'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { TELEGRAM_URL } from '@/data/content'

function renderZhHant() {
  localStorage.clear()
  window.history.replaceState({}, '', '/ai-portrait-studio-site/zh-Hant/')
  return render(<LanguageProvider><Audiences /></LanguageProvider>)
}

describe('Audiences', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('renders section header and three audience cards', () => {
    renderZhHant()
    expect(screen.getByText('我們服務這三類客戶')).toBeInTheDocument()
    expect(screen.getByText('品牌・廣告主')).toBeInTheDocument()
    expect(screen.getByText('網紅・經紀・自媒體')).toBeInTheDocument()
    expect(screen.getByText('專業操盤手・多帳號矩陣')).toBeInTheDocument()
  })

  it('each of the three cards renders its 4 pains and 4 solutions', () => {
    renderZhHant()
    expect(screen.getByText('找模特兒、租攝影棚、外拍一次就燒掉大筆預算')).toBeInTheDocument()
    expect(screen.getByText('打造專屬品牌形象人物，一次訓練、長期沿用')).toBeInTheDocument()
    expect(screen.getByText('內容產量永遠追不上平台演算法的胃口')).toBeInTheDocument()
    expect(screen.getByText('建立專屬虛擬人物與 LoRA，內容產量直接拉滿')).toBeInTheDocument()
    expect(screen.getByText('要同時養多組人設，產製量級遠超一般工作室')).toBeInTheDocument()
    expect(screen.getByText('為每組人設訓練獨立 LoRA，角色一致、互不混淆')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(24)
  })

  it('renders three CTAs all pointing to Telegram, opening in new tab', () => {
    renderZhHant()
    const inquiry = screen.getAllByRole('link', { name: '聊聊我的需求' })
    const dedicated = screen.getByRole('link', { name: '洽談專屬產線' })
    expect(inquiry).toHaveLength(2)
    for (const link of [...inquiry, dedicated]) {
      expect(link).toHaveAttribute('href', TELEGRAM_URL)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('keeps the #pricing anchor id (nav / snap / sitemap rely on it)', () => {
    const { container } = renderZhHant()
    expect(container.querySelector('section#pricing')).not.toBeNull()
  })

  it('does NOT render any price or old plan name', () => {
    renderZhHant()
    expect(screen.queryByText(/Mini Launch|Standard Launch|Pro Launch|Discovery Pack/)).not.toBeInTheDocument()
    expect(screen.queryByText(/NT\$|US\$|加購服務/)).not.toBeInTheDocument()
  })
})
