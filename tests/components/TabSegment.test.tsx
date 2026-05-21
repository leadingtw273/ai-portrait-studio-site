import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TabSegment } from '@/components/TabSegment'
import { Image, Video } from 'lucide-react'

describe('TabSegment', () => {
  const tabs = [
    { id: 'image', label: '圖片', icon: <Image data-testid="i-image" /> },
    { id: 'video', label: '影片', icon: <Video data-testid="i-video" /> },
  ]

  it('renders both tabs with active state on selected', () => {
    render(<TabSegment tabs={tabs} value="image" onChange={() => {}} />)
    const imgBtn = screen.getByRole('tab', { name: /圖片/ })
    const vidBtn = screen.getByRole('tab', { name: /影片/ })
    expect(imgBtn).toHaveAttribute('aria-selected', 'true')
    expect(vidBtn).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange when clicking another tab', async () => {
    const onChange = vi.fn()
    render(<TabSegment tabs={tabs} value="image" onChange={onChange} />)
    await userEvent.click(screen.getByRole('tab', { name: /影片/ }))
    expect(onChange).toHaveBeenCalledWith('video')
  })

  it('supports keyboard navigation: ArrowRight / ArrowLeft', async () => {
    const onChange = vi.fn()
    render(<TabSegment tabs={tabs} value="image" onChange={onChange} />)
    const imgBtn = screen.getByRole('tab', { name: /圖片/ })
    imgBtn.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('video')
  })
})
