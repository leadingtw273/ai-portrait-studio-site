// src/lib/seo/langNav.ts
// 純函式：產生語言切換目標 URL；不碰 window.location。
// caller (Nav.tsx) 用 window.location.assign(buildLangUrl(...)) 觸發 navigation。
// 抽成純函式以利 unit test（jsdom 不能 spy window.location.href setter）。

import type { Lang } from '@/i18n/LanguageProvider'
import { BASE_PATH } from '@/lib/seo/canonicalUrl'

export function buildLangUrl(targetLang: Lang, hash: string): string {
  return `${BASE_PATH}/${targetLang}/${hash}`
}
