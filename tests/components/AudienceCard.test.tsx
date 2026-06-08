import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Megaphone } from 'lucide-react'
import { AudienceCard } from '@/components/AudienceCard'

const baseProps = {
  name: '品牌・廣告主',
  icon: <Megaphone className="w-4 h-4" aria-hidden="true" />,
  tagline: '需要形象與廣告素材的企業主、電商與在地商家',
  painTitle: '你是不是遇到——',
  pains: ['痛點一', '痛點二', '痛點三', '痛點四'],
  solutionTitle: '我們怎麼幫你——',
  solutions: ['解法一', '解法二', '解法三', '解法四'],
  ctaLabel: '聊聊我的需求',
  ctaHref: 'https://t.me/+test',
}

describe('AudienceCard', () => {
  it('renders name, tagline, 4 pains, 4 solutions, and section titles', () => {
    render(<AudienceCard {...baseProps} />)
    expect(screen.getByText('品牌・廣告主')).toBeInTheDocument()
    expect(screen.getByText(baseProps.tagline)).toBeInTheDocument()
    expect(screen.getByText('你是不是遇到——')).toBeInTheDocument()
    expect(screen.getByText('我們怎麼幫你——')).toBeInTheDocument()
    baseProps.pains.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument())
    baseProps.solutions.forEach((s) => expect(screen.getByText(s)).toBeInTheDocument())
  })

  it('CTA links to ctaHref in a new tab with noopener', () => {
    render(<AudienceCard {...baseProps} />)
    const cta = screen.getByRole('link', { name: '聊聊我的需求' })
    expect(cta).toHaveAttribute('href', 'https://t.me/+test')
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders a gold special badge when badge prop is provided', () => {
    render(<AudienceCard {...baseProps} badge={{ label: '特殊服務', variant: 'gold' }} />)
    expect(screen.getByText('特殊服務')).toBeInTheDocument()
  })
})
