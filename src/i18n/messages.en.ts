import type { Messages } from './messages.zh-hant'

export const en: Messages = {
  nav: {
    plans:   'Who We Serve',
    demo:    'Showcase',
    contact: 'Contact',
  },
  hero: {
    badge:        'AI ・ Innovation ・ Professional ・ Service',
    title:        'AI Imaging Studio',
    subtitle:     'Professional AI video & image generation',
    description:  'From AI video content to dedicated LoRA portraits — advanced generation crafting one-of-a-kind digital image assets for brands, creators, and teams',
    ctaPrimary:   'View Showcase',
    ctaSecondary: 'See How We Help',
    scrollHint:   'Scroll to explore',
  },
  demo: {
    badge:    'Showcase',
    title:    'AI Portrait Showcase',
    subtitle: 'Cutting-edge AI delivering professional-grade portraits',
    tabs: {
      image: 'LoRA Portrait Training',
      video: 'Video Content',
      shorts: 'Short-form Video',
    },
    imageCardAlt: 'AI-generated portrait sample',
    loraBefore: 'Before: source photo',
    loraAfter: 'After: same character across scenes, generated',
    loraArrowLabel: 'LoRA training flow: source photo transformed to trained output',
    loraAiGeneratedTag: 'AI Generated',
    videoCard: {
      title1: 'Product Commercial',
      desc1:  'Brand visual: AI face × tea garden × product in hand',
      title2: 'Brand KV Concept Film',
      desc2:  'Cinematic edit: AI talent × automotive KV × multi-shot narrative',
      playLabel: 'Click to play',
    },
    shortsCard: {
      title1: 'Branded Short · SOMA',
      desc1:  'AI virtual persona × product placement × rhythmic performance',
      title2: 'Dance Short',
      desc2:  'AI character dance: fluid motion × consistent identity',
    },
    techBanner: {
      image: {
        title:       'What is LoRA training?',
        description: 'LoRA (Low-Rank Adaptation) is an efficient AI model fine-tuning technique. We use your photos to train a personalized model that learns your unique facial features, expressions, and style. Once trained, it can generate professional portraits in various scenes, styles, and poses — all preserving your authentic appearance.',
      },
      video: {
        title:       'AI Video Content Generation',
        description: 'With advanced AI video generation, we transform static portraits into smooth, natural motion video. Smile, blink, head turn — delivered with cinematic quality, ideal for social media, digital avatars, virtual hosts, and more.',
      },
      shorts: {
        title:       'AI Short-form Video Generation',
        description: 'We generate vertical short-form videos entirely with AI — natural, fluid motion with a consistent character identity, no on-camera talent or location shoots required. Perfect for high-frequency content on TikTok, Reels and Shorts, keeping your virtual persona visible and your content pipeline running.',
      },
    },
  },
  audiences: {
    badge:         'Who We Serve',
    title:         'We serve these three types of clients',
    subtitle:      "These capabilities combine into entirely different solutions, tailored to each audience's needs.",
    painTitle:     'Sound familiar?',
    solutionTitle: 'How we help',
    cards: {
      brand: {
        name:    'Brands & Advertisers',
        tagline: 'Business owners, e-commerce, and local shops needing brand imagery and ad creatives',
        pains: [
          'Models, studio rentals, and shoots burn through your budget in one go',
          'Every new season or campaign means reshooting — content updates never keep up',
          "You want a spokesperson image for products but can't afford a long-term one",
          'Running ads means producing many creative variants for A/B testing',
        ],
        solutions: [
          'Build a dedicated brand persona — train once, use long-term',
          'One face, unlimited scenes and outfits — no reshoots between campaigns',
          'Product imagery + spokesperson visuals at a fraction of traditional shoot costs',
          'Batch-produce multiple ad variants to speed up delivery and testing',
        ],
        ctaLabel: "Let's Talk",
      },
      creator: {
        name:    'Creators, Agencies & Self-media',
        tagline: 'Creators, talent agencies, and MCNs monetizing through video content',
        pains: [
          "Content output can never keep up with the platform algorithm's appetite",
          'Real-person filming is limited by scheduling, likeness rights, and privacy',
          'You want to run a virtual persona but lack the tech and a stable pipeline',
          "Cross-platform differentiated content is simply too much for your team",
        ],
        solutions: [
          'Build a dedicated virtual persona and LoRA — max out your content output',
          'Portraits + video in one pipeline — a steady supply of shorts and post assets',
          'From persona and style sheets to publishing strategy, we grow your virtual IP',
          "Batch cross-platform differentiated content — one person, a team's output",
        ],
        ctaLabel: "Let's Talk",
      },
      operator: {
        name:    'Pro Operators & Multi-account Networks',
        tagline: 'Professional teams running multiple virtual personas and brand accounts at once',
        pains: [
          'Running many personas at once — output volume far beyond a regular studio',
          'Every persona must stay visually consistent, distinct, and never look alike',
          'Content demand is continuous — the moment the pipeline stops, content dries up',
          "Regular outsourcing can't meet confidentiality and dedicated-production needs",
        ],
        solutions: [
          'Train a separate LoRA per persona — consistent characters, never mixed up',
          'Scaled portrait + video pipeline supporting high-frequency, high-volume delivery',
          'Personas, styles, and scenes managed and separated systematically',
          'A dedicated, confidential partnership with custom projects scaled to your volume',
        ],
        ctaLabel: 'Discuss a Dedicated Line',
      },
    },
  },
  finalCta: {
    title:       'Not sure which type fits you?',
    description: 'Reach out on Telegram — we will provide tailored recommendations based on your needs',
    button:      'Free Consultation',
  },
  footer: {
    tagline:        'Professional AI portrait generation & video production. Building one-of-a-kind digital personas for you.',
    contactTitle:   'Contact Us',
    telegramButton: 'Telegram',
    responseTime:   'Response time: usually within 24 hours',
    qrCaption:      'Or scan QR to join',
    copyright:      '© 2026 AI Imaging Studio. All rights reserved.',
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
