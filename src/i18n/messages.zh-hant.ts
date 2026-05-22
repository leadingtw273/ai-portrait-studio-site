export const zhHant = {
  nav: {
    plans:   '方案',
    demo:    'Demo',
    contact: '聯絡',
  },
  hero: {
    badge:        'AI 智能 ・ 創新 ・ 專業 ・ 服務',
    title:        'AI 人像工作室',
    subtitle:     '專業的 AI 人像生成與影片製作服務',
    description:  '透過先進的 LoRA 訓練技術與 AI 影片生成，為您打造獨一無二的數位人像作品',
    ctaPrimary:   '查看作品展示',
    ctaSecondary: '方案諮詢',
    scrollHint:   '向下滾動探索',
  },
  demo: {
    badge:    '作品展示',
    title:    'AI 生成作品範例',
    subtitle: '透過先進的 AI 技術，為您打造專業級的人像作品',
    tabs: {
      image: 'LoRA 人像訓練',
      video: '影片人像生成',
    },
    imageCardAlt: 'AI 生成人像示意圖',
    loraBefore: '訓練前：原始照片',
    loraAfter: '訓練後：LoRA 生成範例',
    loraArrowLabel: 'LoRA 訓練流程：原始照片轉換為訓練後輸出',
    loraAiGeneratedTag: 'AI 生成',
    videoCard: {
      title1: '電影級人像動態',
      desc1:  '流暢自然的人像動態影片',
      title2: '動態表情生成',
      desc2:  '逼真的微笑與表情變化',
      playLabel: '點擊播放影片',
    },
    techBanner: {
      image: {
        title:       '什麼是 LoRA 訓練？',
        description: 'LoRA（Low-Rank Adaptation）是一種高效的 AI 模型微調技術。我們使用您提供的照片進行專屬訓練，讓 AI 學習您的獨特面部特徵、表情和風格。訓練完成後，即可生成各種場景、風格和姿態的專業人像照片，且都保持您的真實特徵。',
      },
      video: {
        title:       'AI 影片人像生成',
        description: '透過先進的 AI 影片生成技術，我們可以將靜態人像轉換為流暢自然的動態影片。無論是微笑、眨眼、轉頭等動作，都能以電影級的品質呈現，適合用於社群媒體、數位分身、虛擬主播等多場景應用。',
      },
    },
    pricingCta: '精選方案',
  },
  pricing: {
    badge:    '服務方案',
    title:    '選擇適合您的方案',
    subtitle: '專業的 AI 人像服務，滿足不同需求與預算',
    hottest:  '最熱門',
    ctaInquiry: '立即諮詢',
    basic: {
      name:        '基礎方案',
      tagline:     '適合個人嘗試體驗',
      deliverables: [
        '10 張 LoRA 訓練人像',
        '基礎風格選擇 (3 種)',
        '標準解析度輸出',
        '48 小時交付',
        '基礎修圖調整',
      ],
    },
    pro: {
      name:        '專業方案',
      tagline:     '最受歡迎的選擇',
      deliverables: [
        '30 張 LoRA 訓練人像',
        '專屬風格選擇 (10 種)',
        '高解析度輸出',
        '2 支 AI 動態影片 (3-5 秒)',
        '24 小時快速交付',
        '專業修圖調整',
        '專屬訓練模型保留',
      ],
    },
    enterprise: {
      name:        '企業方案',
      tagline:     '完整的專業服務',
      deliverables: [
        '100 張 LoRA 訓練人像',
        '全風格自由選擇 (無限制)',
        '超高解析度輸出',
        '5 支 AI 動態影片 (3-5 秒)',
        '12 小時極速交付',
        '頂級專業修圖',
        '永久模型保留',
        '商業授權使用',
        '一對一專屬服務',
      ],
    },
    priceLabel: 'NT$',
  },
  addons: {
    title:    '加購服務',
    subtitle: '根據您的需求，靈活地增加額外服務',
    extraVideo: {
      name: '額外 AI 影片',
      desc: '3-5 秒高品質人像動態影片',
      unit: '/ 支',
    },
    rushDelivery: {
      name: '加速交付',
      desc: '縮短至 6 小時內完成',
      unit: '/ 次',
    },
    extraTrainingPhotos: {
      name: '額外訓練照片',
      desc: '在現有方案基礎上增加照片數量',
      unit: '/ 張',
    },
  },
  finalCta: {
    title:       '不確定哪個方案適合您？',
    description: '歡迎透過 Telegram 與我們聯繫，我們將根據您的需求提供專業建議',
    button:      '免費諮詢',
  },
  footer: {
    tagline:        '專業的 AI 人像生成與影片製作服務，為您打造獨一無二的數位形象',
    contactTitle:   '聯絡我們',
    telegramButton: 'Telegram 諮詢',
    responseTime:   '回覆時間：通常 24 小時內',
    copyright:      '© 2026 AI 人像工作室. All rights reserved.',
  },
  scrollToTop: {
    label: '回到頂部',
  },
  languageSwitcher: {
    'zh-Hant': '繁中',
    'zh-Hans': '简中',
    'en':      'EN',
  },
} as const

// DeepString: recursively replace all leaf string-literal types with `string`
// so that zh-Hans / en can hold different translations while still enforcing the same shape.
type DeepString<T> = T extends readonly string[]
  ? readonly string[]
  : T extends string
  ? string
  : { readonly [K in keyof T]: DeepString<T[K]> }

export type Messages = DeepString<typeof zhHant>
