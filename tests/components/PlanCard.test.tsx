import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PlanCard } from '@/components/PlanCard'

describe('PlanCard', () => {
  const base = {
    name: '專業方案',
    tagline: '最受歡迎的選擇',
    price: 2800,
    deliverables: ['A', 'B', 'C'],
    ctaLabel: '立即諮詢',
    ctaHref: 'https://t.me/test',
  }

  it('renders name, price, deliverables, cta', () => {
    render(<PlanCard {...base} />)
    expect(screen.getByText('專業方案')).toBeInTheDocument()
    expect(screen.getByText(/2,800/)).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '立即諮詢' })).toHaveAttribute('href', 'https://t.me/test')
  })

  it('shows "最熱門" badge when highlighted', () => {
    render(<PlanCard {...base} highlighted hottestLabel="最熱門" />)
    expect(screen.getByText('最熱門')).toBeInTheDocument()
  })

  it('does not show badge when not highlighted', () => {
    render(<PlanCard {...base} hottestLabel="最熱門" />)
    expect(screen.queryByText('最熱門')).not.toBeInTheDocument()
  })

  it('opens TG link in new tab with noopener', () => {
    render(<PlanCard {...base} />)
    const link = screen.getByRole('link', { name: '立即諮詢' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
