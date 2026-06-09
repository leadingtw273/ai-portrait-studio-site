import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { Demo } from '@/sections/Demo'
import { LanguageProvider } from '@/i18n/LanguageProvider'

describe('Demo', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true })
  })

  it('defaults to video tab (影片內容生成) — video cards visible', () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    expect(screen.getByRole('tab', { name: /影片內容生成/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('產品宣傳短片')).toBeInTheDocument()
  })

  it('renders video tech banner on default (video) tab', () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    expect(screen.getByText('AI 影片內容生成')).toBeInTheDocument()
    expect(screen.getByText(/我們可以將靜態人像/)).toBeInTheDocument()
  })

  it('clicking image tab switches grid and banner to LoRA', async () => {
    render(<LanguageProvider><Demo /></LanguageProvider>)
    await userEvent.click(screen.getByRole('tab', { name: /LoRA 人像訓練/ }))
    expect(screen.getByRole('tab', { name: /LoRA 人像訓練/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByAltText(/訓練前/)).toBeInTheDocument()
    expect(screen.getByAltText(/訓練後/)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /LoRA 訓練流程/ })).toBeInTheDocument()
    expect(screen.getByText('什麼是 LoRA 訓練？')).toBeInTheDocument()
    // video banner 不再顯示
    expect(screen.queryByText('AI 影片內容生成')).not.toBeInTheDocument()
  })
})
