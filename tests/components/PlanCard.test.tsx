import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PlanCard } from '@/components/PlanCard'

describe('PlanCard', () => {
  const base = {
    name: 'Standard Launch',
    tagline: '最受歡迎的選擇',
    price: 78800,
    deliverables: ['A', 'B', 'C'],
    ctaLabel: '立即諮詢',
    ctaHref: 'https://t.me/test',
  }

  it('renders name, price, deliverables, cta', () => {
    render(<PlanCard {...base} />)
    expect(screen.getByText('Standard Launch')).toBeInTheDocument()
    expect(screen.getByText(/78,800/)).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '立即諮詢' })).toHaveAttribute('href', 'https://t.me/test')
  })

  it('shows brand badge when provided', () => {
    render(<PlanCard {...base} badge={{ label: '最熱門', variant: 'brand' }} />)
    expect(screen.getByText('最熱門')).toBeInTheDocument()
  })

  it('shows gold badge with #D4AF37 styling when variant is gold', () => {
    const { container } = render(<PlanCard {...base} badge={{ label: '每月限 3 位', variant: 'gold' }} />)
    const badge = screen.getByText('每月限 3 位')
    expect(badge).toBeInTheDocument()
    // gold variant 套用 bg-[#D4AF37]
    expect(badge.className).toMatch(/bg-\[#D4AF37\]/)
    expect(container).toBeTruthy()
  })

  it('does not show badge when not provided', () => {
    render(<PlanCard {...base} />)
    expect(screen.queryByText('最熱門')).not.toBeInTheDocument()
    expect(screen.queryByText('每月限 3 位')).not.toBeInTheDocument()
  })

  it('opens TG link in new tab with noopener', () => {
    render(<PlanCard {...base} />)
    const link = screen.getByRole('link', { name: '立即諮詢' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
