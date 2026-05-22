import type { Messages } from './messages.zh-hant'

export const en: Messages = {
  nav: {
    plans:   'Plans',
    demo:    'Demo',
    contact: 'Contact',
  },
  hero: {
    badge:        'AI ・ Innovation ・ Professional ・ Service',
    title:        'AI Portrait Studio',
    subtitle:     'Professional AI portrait generation & video production',
    description:  'Custom LoRA training and AI video generation, crafted to create a one-of-a-kind digital persona for you',
    ctaPrimary:   'View Showcase',
    ctaSecondary: 'View Plans',
    scrollHint:   'Scroll to explore',
  },
  demo: {
    badge:    'Showcase',
    title:    'AI Portrait Showcase',
    subtitle: 'Cutting-edge AI delivering professional-grade portraits',
    tabs: {
      image: 'LoRA Portrait Training',
      video: 'Video Portraits',
    },
    imageCardAlt: 'AI-generated portrait sample',
    loraBefore: 'Before: source photo',
    loraAfter: 'After: LoRA-generated samples',
    loraArrowLabel: 'LoRA training flow: source photo transformed to trained output',
    loraAiGeneratedTag: 'AI Generated',
    videoCard: {
      title1: 'Cinematic Portrait Motion',
      desc1:  'Smooth, natural motion for portrait video',
      title2: 'Dynamic Expression',
      desc2:  'Realistic smiles and facial expressions',
      playLabel: 'Click to play',
    },
    techBanner: {
      image: {
        title:       'What is LoRA training?',
        description: 'LoRA (Low-Rank Adaptation) is an efficient AI model fine-tuning technique. We use your photos to train a personalized model that learns your unique facial features, expressions, and style. Once trained, it can generate professional portraits in various scenes, styles, and poses — all preserving your authentic appearance.',
      },
      video: {
        title:       'AI Video Portrait Generation',
        description: 'With advanced AI video generation, we transform static portraits into smooth, natural motion video. Smile, blink, head turn — delivered with cinematic quality, ideal for social media, digital avatars, virtual hosts, and more.',
      },
    },
    pricingCta: 'See Plans',
  },
  pricing: {
    badge:    'Plans',
    title:    'Choose the plan that fits',
    subtitle: 'Professional AI portrait services, tailored to your budget',
    hottest:  'Most Popular',
    limited:  'Monthly limit: 3',
    ctaInquiry: 'Contact Us',
    basic: {
      name:        'Mini Launch',
      tagline:     'For creators just starting out',
      deliverables: [
        '120 LoRA-trained portraits',
        '5 AI motion videos (5-15 sec)',
        'Basic LoRA model training',
        'Customer provides 20-30 source photos',
        '10 business days delivery',
        '1 revision round',
      ],
    },
    pro: {
      name:        'Standard Launch',
      tagline:     'Most popular choice',
      deliverables: [
        '560 LoRA-trained portraits',
        '28 short videos + 4 mid videos (30-60 sec)',
        'Dedicated LoRA model training',
        'Full style sheet + 30 prompt templates',
        'Platform publishing strategy (30 min)',
        '3 weeks delivery',
        '2 revision rounds',
      ],
    },
    enterprise: {
      name:        'Pro Launch',
      tagline:     'We become your AI content director',
      ctaLabel:    'Book Pro Consultation',
      deliverables: [
        '1,500 LoRA-trained portraits',
        '70 short videos + 12 mid/long videos',
        'Duo composition + narrative shorts unlocked',
        'Monthly analytics + quarterly competitor report',
        'Cross-platform differentiation strategy',
        '24h priority response + unlimited revisions',
        'Quarterly LoRA upgrades',
        'Non-compete exclusivity',
        '120-day direct Telegram line',
      ],
    },
    priceLabel: 'NT$',
  },
  addons: {
    title:    'Add-ons',
    subtitle: 'Flexibly add extra services based on your needs',
    extraVideo: {
      name: 'Extra AI Video',
      desc: '3-5 sec high-quality portrait motion video',
      unit: '/ video',
    },
    rushDelivery: {
      name: 'Rush Delivery',
      desc: 'Shortened to 6-hour turnaround',
      unit: '/ order',
    },
    extraTrainingPhotos: {
      name: 'Extra Training Photos',
      desc: 'Add more photos to your existing plan',
      unit: '/ photo',
    },
  },
  finalCta: {
    title:       'Not sure which plan suits you?',
    description: 'Reach out on Telegram — we will provide tailored recommendations based on your needs',
    button:      'Free Consultation',
  },
  footer: {
    tagline:        'Professional AI portrait generation & video production. Building one-of-a-kind digital personas for you.',
    contactTitle:   'Contact Us',
    telegramButton: 'Telegram',
    responseTime:   'Response time: usually within 24 hours',
    copyright:      '© 2026 AI Portrait Studio. All rights reserved.',
  },
  scrollToTop: {
    label: 'Back to top',
  },
  languageSwitcher: {
    'zh-Hant': '繁中',
    'zh-Hans': '简中',
    'en':      'EN',
  },
}
