import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from '../src/App'

describe('App scaffold', () => {
  it('renders the studio title', () => {
    render(<App />)
    expect(screen.getByText(/AI 人像工作室/)).toBeInTheDocument()
  })
})
