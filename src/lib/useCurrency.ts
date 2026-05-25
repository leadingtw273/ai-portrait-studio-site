// React hook：依當前語言決定幣別、自動拉匯率、提供 format/convert helper
// TWD 是 base、不發 API 直接 rate=1；其他幣別 lazy fetch + cache

import { useEffect, useState } from 'react'
import { useT } from '@/i18n/useT'
import {
  LANG_TO_CURRENCY,
  CURRENCY_SYMBOL,
  fetchRates,
  formatPrice,
  type Currency,
} from './currency'

export function useCurrency() {
  const { lang } = useT()
  const currency: Currency = LANG_TO_CURRENCY[lang]
  const [rate, setRate] = useState<number | null>(currency === 'TWD' ? 1 : null)
  const [prevCurrency, setPrevCurrency] = useState<Currency>(currency)

  // 切換語言時 reset rate — 在 render 中即時調整避免 effect 內 setState (react-hooks/set-state-in-effect)
  if (currency !== prevCurrency) {
    setPrevCurrency(currency)
    setRate(currency === 'TWD' ? 1 : null)
  }

  useEffect(() => {
    if (currency === 'TWD') return
    let cancelled = false
    fetchRates()
      .then((rates) => {
        if (cancelled) return
        const r = rates[currency]
        if (typeof r === 'number') setRate(r)
      })
      .catch(() => {
        // 拉不到匯率 → format() 會 fallback 回 TWD 原價、避免空白
      })
    return () => {
      cancelled = true
    }
  }, [currency])

  const symbol = CURRENCY_SYMBOL[currency]

  const format = (twd: number): string => {
    if (rate === null) {
      // 匯率尚未載入、fallback 顯示 TWD 原價避免閃白
      return `NT$ ${twd.toLocaleString()}`
    }
    return formatPrice(twd, currency, rate)
  }

  return { currency, symbol, rate, format }
}
