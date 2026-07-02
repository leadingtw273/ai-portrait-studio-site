import { useState } from 'react'
import { Image as ImageIcon, Video as VideoIcon, Sparkles, ChevronRight, ChevronDown, Zap, Smartphone } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { TabSegment } from '@/components/TabSegment'
import { DemoCard } from '@/components/DemoCard'
import { useT } from '@/i18n/useT'
import loraBefore from '@/assets/lora-before.jpg'
import loraAfter from '@/assets/lora-after-grid.jpg'
import teaPromo from '@/assets/tea-product-promo.mp4'
import automotiveKv from '@/assets/automotive-kv-promo.mp4'
import shortsSoma from '@/assets/shorts-soma-demo.mp4'
import shortsDance from '@/assets/shorts-dance-demo.mp4'

type TabId = 'image' | 'video' | 'shorts'

export function Demo() {
  const { t } = useT()
  const [tab, setTab] = useState<TabId>('video')

  const tabs = [
    { id: 'video' as const, label: t.demo.tabs.video, icon: <VideoIcon className="w-4 h-4" /> },
    { id: 'shorts' as const, label: t.demo.tabs.shorts, icon: <Smartphone className="w-4 h-4" /> },
    { id: 'image' as const, label: t.demo.tabs.image, icon: <ImageIcon className="w-4 h-4" /> },
  ]

  return (
    <section id="demo" className="min-h-screen flex flex-col justify-center px-4 py-16 tablet:py-24">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader badge={t.demo.badge} title={t.demo.title} subtitle={t.demo.subtitle} />
        {/* 三個 tab 在窄螢幕會超出視寬：外層可橫向捲動、內層 min-w-max 讓寬螢幕維持置中 */}
        <div className="my-8 overflow-x-auto">
          <div className="flex justify-center min-w-max px-4 py-1">
            <TabSegment tabs={tabs} value={tab} onChange={setTab} />
          </div>
        </div>

        {/* tab 切換時 key 變動觸發 fade-in-slide 動畫（含 grid + tech banner 同步淡入）*/}
        <div key={tab} className="animate-fade-in-slide">
          {tab === 'image' ? (
            <div className="grid grid-cols-1 tablet:grid-cols-[1fr_auto_1fr] items-center gap-2 tablet:gap-3">
              <DemoCard variant="image" src={loraBefore} alt={t.demo.loraBefore} />
              <div
                className="flex items-center justify-center text-primary"
                role="img"
                aria-label={t.demo.loraArrowLabel}
              >
                {/* mobile: 雙下箭頭、光點由上到下 */}
                <div className="tablet:hidden flex flex-col items-center">
                  <ChevronDown className="w-10 h-10 animate-chev-step-1 -mb-8" strokeWidth={2.5} aria-hidden="true" />
                  <ChevronDown className="w-10 h-10 animate-chev-step-2" strokeWidth={2.5} aria-hidden="true" />
                </div>
                {/* tablet+: 雙右箭頭、光點由左到右 */}
                <div className="hidden tablet:inline-flex items-center">
                  <ChevronRight className="w-12 h-12 desktop:w-14 desktop:h-14 animate-chev-step-1 -mr-9" strokeWidth={2.5} aria-hidden="true" />
                  <ChevronRight className="w-12 h-12 desktop:w-14 desktop:h-14 animate-chev-step-2" strokeWidth={2.5} aria-hidden="true" />
                </div>
              </div>
              <div className="relative">
                <DemoCard variant="image" src={loraAfter} alt={t.demo.loraAfter} />
                <span
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.15] text-xs text-white shadow-soft"
                >
                  <Zap className="w-3.5 h-3.5 text-on-primary" fill="currentColor" aria-hidden="true" />
                  {t.demo.loraAiGeneratedTag}
                </span>
              </div>
            </div>
          ) : tab === 'shorts' ? (
            <div className="grid grid-cols-2 gap-4 tablet:gap-6 max-w-xl tablet:max-w-2xl mx-auto">
              <DemoCard
                variant="video"
                orientation="portrait"
                source={{ type: 'mp4', src: shortsSoma }}
                durationSec="15"
                title={t.demo.shortsCard.title1}
                desc={t.demo.shortsCard.desc1}
                playLabel={t.demo.videoCard.playLabel}
              />
              <DemoCard
                variant="video"
                orientation="portrait"
                source={{ type: 'mp4', src: shortsDance }}
                durationSec="15"
                title={t.demo.shortsCard.title2}
                desc={t.demo.shortsCard.desc2}
                playLabel={t.demo.videoCard.playLabel}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
              <DemoCard
                variant="video"
                source={{ type: 'mp4', src: teaPromo }}
                durationSec="10"
                title={t.demo.videoCard.title1}
                desc={t.demo.videoCard.desc1}
                playLabel={t.demo.videoCard.playLabel}
              />
              <DemoCard
                variant="video"
                source={{ type: 'mp4', src: automotiveKv }}
                durationSec="15"
                title={t.demo.videoCard.title2}
                desc={t.demo.videoCard.desc2}
                playLabel={t.demo.videoCard.playLabel}
              />
            </div>
          )}

          {/* Tech explainer banner — image / shorts / video tab 分別不同說明 */}
          <div className="mt-10 rounded-xl p-5 tablet:p-6 border border-primary/25 bg-primary/[0.08] shadow-soft">
            <div className="flex items-center gap-2 text-content font-medium mb-2 text-lg">
              {tab === 'image' ? (
                <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              ) : (
                <VideoIcon className="w-4 h-4 text-primary" aria-hidden="true" />
              )}
              {tab === 'image'
                ? t.demo.techBanner.image.title
                : tab === 'shorts'
                ? t.demo.techBanner.shorts.title
                : t.demo.techBanner.video.title}
            </div>
            <p className="text-content-muted text-base leading-relaxed">
              {tab === 'image'
                ? t.demo.techBanner.image.description
                : tab === 'shorts'
                ? t.demo.techBanner.shorts.description
                : t.demo.techBanner.video.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
