import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '@/components/Badge'

describe('Badge', () => {
  it('renders children with sparkle icon prefix', () => {
    const { container } = render(<Badge>AI 服務</Badge>)
    expect(screen.getByText(/AI 服務/)).toBeInTheDocument()
    // lucide-react Sparkles renders as <svg>
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
