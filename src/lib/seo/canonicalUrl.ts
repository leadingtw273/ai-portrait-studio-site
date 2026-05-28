import type { Lang } from '@/i18n/LanguageProvider'

// build 時透過 vite define / env 注入；目前 hardcoded、上線確認 GH username 後改 env
export const SITE_ORIGIN = 'https://leadingtw273.github.io'
export const BASE_PATH = '/ai-portrait-studio-site'

function joinUrl(...parts: string[]): string {
  return parts
    .map((p, i) => (i === 0 ? p.replace(/\/$/, '') : p.replace(/^\/+|\/+$/g, '')))
    .filter(Boolean)
    .join('/')
}

export function canonical(lang: Lang): string {
  return `${joinUrl(SITE_ORIGIN, BASE_PATH, lang)}/`
}

export function siteRoot(): string {
  return `${joinUrl(SITE_ORIGIN, BASE_PATH)}/`
}

export function asset(relativeFromRoot: string): string {
  return joinUrl(SITE_ORIGIN, BASE_PATH, relativeFromRoot)
}

export function ogImage(lang: Lang): string {
  return asset(`og/og-${lang}.jpg`)
}

export function videoPoster(name: string): string {
  return asset(`video-posters/${name}.jpg`)
}
