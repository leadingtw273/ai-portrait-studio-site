import { useContext } from 'react'
import { LanguageCtx } from './LanguageProvider'

export function useT() {
  const ctx = useContext(LanguageCtx)
  if (!ctx) throw new Error('useT must be used within <LanguageProvider>')
  return ctx
}
