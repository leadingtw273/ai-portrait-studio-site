import { useState } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'
import { useT } from '@/i18n/useT'
import type { Lang } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/cn'
import { buildLangUrl } from '@/lib/seo/langNav'

const LANGS: Lang[] = ['zh-Hant', 'zh-Hans', 'en']

export function Nav() {
  const { t, lang } = useT()
  const [open, setOpen] = useState(false)

  const openMenuLabel = lang === 'en' ? 'Open menu' : '開啟選單'
  const closeMenuLabel = lang === 'en' ? 'Close menu' : '關閉選單'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-30',
        'bg-bg-base/50 backdrop-blur-card border-b border-border-subtle',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8 h-14 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 text-white font-semibold">
          <Sparkles className="w-4 h-4 text-brand-300" aria-hidden="true" />
          <span className="text-base tablet:text-lg">{t.hero.title}</span>
        </a>

        {/* Desktop inline nav */}
        <nav
          aria-label="Desktop navigation"
          className="hidden desktop:flex items-center gap-6 text-gray-300 text-base"
        >
          <a href="#demo" className="hover:text-white">{t.nav.demo}</a>
          <a href="#pricing" className="hover:text-white">{t.nav.plans}</a>
          <a href="#contact" className="hover:text-white">{t.nav.contact}</a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => window.location.assign(buildLangUrl(l, window.location.hash))}
                className={cn(
                  'px-2 py-1 rounded min-w-[44px] min-h-[32px] transition-colors',
                  lang === l
                    ? 'text-white bg-brand-500/25 border border-border-brand'
                    : 'text-gray-400 hover:text-white hover:bg-surface',
                )}
              >
                {t.languageSwitcher[l]}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label={open ? closeMenuLabel : openMenuLabel}
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen((o) => !o)}
            className="desktop:hidden inline-flex items-center justify-center w-11 h-11 rounded text-gray-300 hover:text-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="nav-drawer"
          aria-label="Mobile navigation"
          className="desktop:hidden border-t border-border-subtle bg-bg-elevated"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col text-gray-300 text-base">
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="py-3 px-3 min-h-[44px] flex items-center hover:text-white border-b border-border-subtle"
            >
              {t.nav.demo}
            </a>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="py-3 px-3 min-h-[44px] flex items-center hover:text-white border-b border-border-subtle"
            >
              {t.nav.plans}
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="py-3 px-3 min-h-[44px] flex items-center hover:text-white"
            >
              {t.nav.contact}
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
