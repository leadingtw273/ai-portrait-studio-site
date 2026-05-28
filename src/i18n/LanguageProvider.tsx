import { createContext, useState, useEffect, type ReactNode } from 'react'
import { zhHant, type Messages } from './messages.zh-hant'
import { zhHans } from './messages.zh-hans'
import { en } from './messages.en'
import { BASE_PATH } from '@/lib/seo/canonicalUrl'

export type Lang = 'zh-Hant' | 'zh-Hans' | 'en'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Messages }
export const LanguageCtx = createContext<Ctx | null>(null)

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh-Hant'

  // 1) URL pathname 是 truth source
  const path = window.location.pathname
  // trailing slash is always present on GH Pages prod URLs (vite base + 3-lang routes)
  if (path.includes(`${BASE_PATH}/zh-Hant/`)) return 'zh-Hant'
  if (path.includes(`${BASE_PATH}/zh-Hans/`)) return 'zh-Hans'
  if (path.includes(`${BASE_PATH}/en/`)) return 'en'

  // 2) root path（沒 lang prefix）才 fallback 到 navigator.language
  //    這個 fallback 主要給 dev mode `localhost:5173` 用、prod 上 root 是 redirect 頁
  const nav = navigator.language.toLowerCase()
  if (nav === 'zh-cn' || nav.startsWith('zh-hans') || nav === 'zh-sg' || nav === 'zh-my') return 'zh-Hans'
  if (nav.startsWith('zh')) return 'zh-Hant'
  if (nav.startsWith('en')) return 'en'
  return 'zh-Hant'
}

const DICTIONARY: Record<Lang, Messages> = {
  'zh-Hant': zhHant,
  'zh-Hans': zhHans,
  'en':      en,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectInitialLang)
  useEffect(() => {
    // sync html[lang] attribute for accessibility / a11y tools
    document.documentElement.lang = lang
  }, [lang])
  const t = DICTIONARY[lang]
  return <LanguageCtx.Provider value={{ lang, setLang, t }}>{children}</LanguageCtx.Provider>
}
