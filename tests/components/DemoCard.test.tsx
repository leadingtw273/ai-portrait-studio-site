import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DemoCard } from '@/components/DemoCard'

describe('DemoCard', () => {
  describe('image variant', () => {
    it('renders an img with given src and alt', () => {
      render(<DemoCard variant="image" src="https://test.com/a.jpg" alt="人像 A" />)
      const img = screen.getByRole('img', { name: '人像 A' })
      expect(img).toHaveAttribute('src', 'https://test.com/a.jpg')
    })
  })

  describe('video variant', () => {
    it('renders poster image initially, no iframe', () => {
      render(
        <DemoCard
          variant="video"
          posterUrl="https://i.ytimg.com/vi/xxx/hqdefault.jpg"
          youtubeId="xxx"
          durationSec="3-5"
          title="電影級人像動態"
          desc="流暢自然"
          playLabel="點擊播放"
        />,
      )
      expect(screen.getByAltText(/電影級/)).toBeInTheDocument()
      expect(screen.queryByTitle(/youtube/i)).not.toBeInTheDocument()
      expect(screen.getByText('3-5 秒')).toBeInTheDocument()
    })

    it('clicking poster swaps in youtube nocookie iframe', () => {
      render(
        <DemoCard
          variant="video"
          posterUrl="https://i.ytimg.com/vi/xxx/hqdefault.jpg"
          youtubeId="xxx"
          durationSec="3-5"
          title="電影級人像動態"
          desc="流暢自然"
          playLabel="點擊播放"
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /點擊播放/ }))
      const iframe = screen.getByTitle(/電影級人像動態/) as HTMLIFrameElement
      expect(iframe.src).toMatch(/youtube-nocookie\.com\/embed\/xxx/)
    })
  })
})
