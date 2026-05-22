import { useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/cn'

type ImageProps = {
  variant: 'image'
  src: string
  alt: string
  className?: string
}

type VideoProps = {
  variant: 'video'
  posterUrl: string
  youtubeId: string
  durationSec: string
  title: string
  desc: string
  playLabel: string
  className?: string
}

type Props = ImageProps | VideoProps

export function DemoCard(props: Props) {
  if (props.variant === 'image') {
    const { src, alt, className } = props
    return (
      <div className={cn('rounded-xl overflow-hidden border border-border-subtle', className)}>
        <img src={src} alt={alt} className="w-full aspect-square block object-cover" loading="lazy" />
      </div>
    )
  }
  return <VideoDemoCard {...props} />
}

function VideoDemoCard({
  posterUrl, youtubeId, durationSec, title, desc, playLabel, className,
}: VideoProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={cn('rounded-xl overflow-hidden border border-border-subtle bg-bg-elevated', className)}>
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerated-2d-canvas; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={posterUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs">
              {durationSec} 秒
            </span>
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={playLabel}
              className={cn(
                'absolute inset-0 flex items-center justify-center group',
                'min-h-[44px]',
              )}
            >
              <span className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center shadow-glow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white" fill="currentColor" />
              </span>
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="text-white font-medium mb-1 text-lg">{title}</div>
        <div className="text-gray-400 text-base">{desc}</div>
      </div>
    </div>
  )
}
