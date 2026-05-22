import { useState } from 'react'
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { TabSegment } from '@/components/TabSegment'
import { DemoCard } from '@/components/DemoCard'
import { useT } from '@/i18n/useT'
import { DEMO_IMAGES, DEMO_VIDEOS } from '@/data/content'

type TabId = 'image' | 'video'

export function Demo() {
  const { t } = useT()
  const [tab, setTab] = useState<TabId>('image')

  const tabs = [
    { id: 'image' as const, label: t.demo.tabs.image, icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'video' as const, label: t.demo.tabs.video, icon: <VideoIcon className="w-4 h-4" /> },
  ]

  return (
    <section id="demo" className="px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto">
        <SectionHeader badge={t.demo.badge} title={t.demo.title} subtitle={t.demo.subtitle} />
        <div className="flex justify-center my-8">
          <TabSegment tabs={tabs} value={tab} onChange={setTab} />
        </div>

        {tab === 'image' ? (
          <div className="grid grid-cols-1 mobile:grid-cols-2 desktop:grid-cols-3 gap-4">
            {DEMO_IMAGES.map((img, i) => (
              <DemoCard key={i} variant="image" src={img.src} alt={t.demo.imageCardAlt} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
            <DemoCard
              variant="video"
              posterUrl={DEMO_VIDEOS[0].posterUrl}
              youtubeId={DEMO_VIDEOS[0].youtubeId}
              durationSec={DEMO_VIDEOS[0].durationSec}
              title={t.demo.videoCard.title1}
              desc={t.demo.videoCard.desc1}
              playLabel={t.demo.videoCard.playLabel}
            />
            <DemoCard
              variant="video"
              posterUrl={DEMO_VIDEOS[1].posterUrl}
              youtubeId={DEMO_VIDEOS[1].youtubeId}
              durationSec={DEMO_VIDEOS[1].durationSec}
              title={t.demo.videoCard.title2}
              desc={t.demo.videoCard.desc2}
              playLabel={t.demo.videoCard.playLabel}
            />
          </div>
        )}

        {/* Tech explainer banner */}
        <div className="mt-10 rounded-xl p-5 tablet:p-6 border border-border-brand bg-brand-500/10 shadow-glow-md">
          <div className="flex items-center gap-2 text-white font-medium mb-2 text-lg">
            <VideoIcon className="w-4 h-4 text-brand-300" aria-hidden="true" />
            {t.demo.techBanner.title}
          </div>
          <p className="text-gray-400 text-base leading-relaxed">
            {t.demo.techBanner.description}
          </p>
        </div>
      </div>
    </section>
  )
}
