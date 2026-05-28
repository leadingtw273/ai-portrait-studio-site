import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hydrateRoot, createRoot } from 'react-dom/client'

vi.mock('react-dom/client', () => ({
  hydrateRoot: vi.fn(),
  createRoot: vi.fn(() => ({ render: vi.fn() })),
}))

// Mock CSS imports (vitest doesn't process them)
vi.mock('@fontsource/inter/600.css', () => ({}))
vi.mock('@fontsource/inter/700.css', () => ({}))
vi.mock('@fontsource/noto-sans-tc/400.css', () => ({}))
vi.mock('@fontsource/noto-sans-tc/600.css', () => ({}))
vi.mock('@fontsource/noto-sans-tc/700.css', () => ({}))
vi.mock('../src/styles/globals.css', () => ({}))

import { mountApp } from '@/main'

describe('mountApp (Task 12)', () => {
  beforeEach(() => {
    vi.mocked(hydrateRoot).mockClear()
    vi.mocked(createRoot).mockClear()
  })

  it('uses hydrateRoot when container has children (prerendered HTML)', () => {
    const container = document.createElement('div')
    container.innerHTML = '<nav>prerendered</nav>'
    mountApp(container)
    expect(hydrateRoot).toHaveBeenCalledTimes(1)
    expect(createRoot).not.toHaveBeenCalled()
  })

  it('uses createRoot when container is empty (dev mode / SPA shell)', () => {
    const container = document.createElement('div')
    // No children
    mountApp(container)
    expect(createRoot).toHaveBeenCalledTimes(1)
    expect(hydrateRoot).not.toHaveBeenCalled()
  })
})
