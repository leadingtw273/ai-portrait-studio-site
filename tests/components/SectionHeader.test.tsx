import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionHeader } from '@/components/SectionHeader'

describe('SectionHeader', () => {
  it('renders badge, title, subtitle when all provided', () => {
    render(<SectionHeader badge="服務" title="選擇方案" subtitle="符合需求" />)
    expect(screen.getByText(/服務/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '選擇方案' })).toBeInTheDocument()
    expect(screen.getByText('符合需求')).toBeInTheDocument()
  })

  it('renders without badge when omitted', () => {
    render(<SectionHeader title="加購服務" subtitle="額外" />)
    expect(screen.getByRole('heading', { name: '加購服務' })).toBeInTheDocument()
  })
})
