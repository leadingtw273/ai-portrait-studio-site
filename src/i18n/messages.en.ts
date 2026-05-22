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
    ctaInquiry: 'Contact Us',
    basic: {
      name:        'Basic',
      tagline:     'Perfect for individuals',
      deliverables: [
        '10 LoRA-trained portraits',
        'Basic style selection (3 styles)',
        'Standard resolution output',
        '48-hour delivery',
        'Basic retouching',
      ],
    },
    pro: {
      name:        'Pro',
      tagline:     'Most popular choice',
      deliverables: [
        '30 LoRA-trained portraits',
        'Premium style selection (10 styles)',
        'High-resolution output',
        '2 AI motion videos (3-5 sec)',
        '24-hour fast delivery',
        'Professional retouching',
        'Dedicated trained model retained',
      ],
    },
    enterprise: {
      name:        'Enterprise',
      tagline:     'Complete professional service',
      deliverables: [
        '100 LoRA-trained portraits',
        'Unlimited style selection',
        'Ultra-high resolution output',
        '5 AI motion videos (3-5 sec)',
        '12-hour express delivery',
        'Top-tier retouching',
        'Permanent model retention',
        'Commercial license',
        'Dedicated 1-on-1 service',
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
