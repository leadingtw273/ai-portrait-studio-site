import { useState } from 'react'
import { Image as ImageIcon, Video as VideoIcon, Sparkles, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { TabSegment } from '@/components/TabSegment'
import { DemoCard } from '@/components/DemoCard'
import { useT } from '@/i18n/useT'
import { DEMO_VIDEOS } from '@/data/content'
import loraBefore from '@/assets/lora-before.jpg'
import loraAfter from '@/assets/lora-after.png'

type TabId = 'image' | 'video'

export function Demo() {
  const { t } = useT()
  const [tab, setTab] = useState<TabId>('image')

  const tabs = [
    { id: 'image' as const, label: t.demo.tabs.image, icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'video' as const, label: t.demo.tabs.video, icon: <VideoIcon className="w-4 h-4" /> },
  ]

  return (
    <section id="demo" className="min-h-screen flex flex-col justify-center px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader badge={t.demo.badge} title={t.demo.title} subtitle={t.demo.subtitle} />
        <div className="flex justify-center my-8">
          <TabSegment tabs={tabs} value={tab} onChange={setTab} />
        </div>

        {tab === 'image' ? (
          <div className="grid grid-cols-1 tablet:grid-cols-[1fr_auto_1fr] items-center gap-4 tablet:gap-6">
            <DemoCard variant="image" src={loraBefore} alt={t.demo.loraBefore} />
            <div
              className="flex items-center justify-center text-brand-300"
              role="img"
              aria-label={t.demo.loraArrowLabel}
            >
              <ArrowRight
                className="w-10 h-10 tablet:w-12 tablet:h-12 rotate-90 tablet:rotate-0"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>
            <DemoCard variant="image" src={loraAfter} alt={t.demo.loraAfter} />
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

        {/* Tech explainer banner — image / video tab 分別不同說明 */}
        <div className="mt-10 rounded-xl p-5 tablet:p-6 border border-border-brand bg-brand-500/10 shadow-glow-md">
          <div className="flex items-center gap-2 text-white font-medium mb-2 text-lg">
            {tab === 'image' ? (
              <Sparkles className="w-4 h-4 text-brand-300" aria-hidden="true" />
            ) : (
              <VideoIcon className="w-4 h-4 text-brand-300" aria-hidden="true" />
            )}
            {tab === 'image' ? t.demo.techBanner.image.title : t.demo.techBanner.video.title}
          </div>
          <p className="text-gray-400 text-base leading-relaxed">
            {tab === 'image' ? t.demo.techBanner.image.description : t.demo.techBanner.video.description}
          </p>
        </div>
      </div>
    </section>
  )
}
