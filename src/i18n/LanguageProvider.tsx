import { createContext, useEffect, useState, type ReactNode } from 'react'
import { zhHant, type Messages } from './messages.zh-hant'
import { zhHans } from './messages.zh-hans'
import { en } from './messages.en'

export type Lang = 'zh-Hant' | 'zh-Hans' | 'en'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Messages }
export const LanguageCtx = createContext<Ctx | null>(null)

const STORAGE_KEY = 'ai-portrait-studio-lang'

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh-Hant'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'zh-Hant' || stored === 'zh-Hans' || stored === 'en') return stored
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
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])
  const t = DICTIONARY[lang]
  return <LanguageCtx.Provider value={{ lang, setLang, t }}>{children}</LanguageCtx.Provider>
}
