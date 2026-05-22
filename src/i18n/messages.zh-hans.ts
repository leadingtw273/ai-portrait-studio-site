import type { Messages } from './messages.zh-hant'

export const zhHans: Messages = {
  nav: {
    plans:   '方案',
    demo:    'Demo',
    contact: '联络',
  },
  hero: {
    badge:        'AI 智能 ・ 创新 ・ 专业 ・ 服务',
    title:        'AI 人像工作室',
    subtitle:     '专业的 AI 人像生成与视频制作服务',
    description:  '透过先进的 LoRA 训练技术与 AI 视频生成，为您打造独一无二的数位人像作品',
    ctaPrimary:   '查看作品展示',
    ctaSecondary: '方案咨询',
    scrollHint:   '向下滚动探索',
  },
  demo: {
    badge:    '作品展示',
    title:    'AI 生成作品范例',
    subtitle: '透过先进的 AI 技术，为您打造专业级的人像作品',
    tabs: {
      image: 'LoRA 人像训练',
      video: '视频人像生成',
    },
    imageCardAlt: 'AI 生成人像示意图',
    loraBefore: '训练前：原始照片',
    loraAfter: '训练后：LoRA 生成范例',
    loraArrowLabel: 'LoRA 训练流程：原始照片转换为训练后输出',
    loraAiGeneratedTag: 'AI 生成',
    videoCard: {
      title1: '电影级人像动态',
      desc1:  '流畅自然的人像动态视频',
      title2: '动态表情生成',
      desc2:  '逼真的微笑与表情变化',
      playLabel: '点击播放视频',
    },
    techBanner: {
      image: {
        title:       '什么是 LoRA 训练？',
        description: 'LoRA（Low-Rank Adaptation）是一种高效的 AI 模型微调技术。我们使用您提供的照片进行专属训练，让 AI 学习您的独特面部特征、表情和风格。训练完成后，即可生成各种场景、风格和姿态的专业人像照片，且都保持您的真实特征。',
      },
      video: {
        title:       'AI 视频人像生成',
        description: '透过先进的 AI 视频生成技术，我们可以将静态人像转换为流畅自然的动态视频。无论是微笑、眨眼、转头等动作，都能以电影级的品质呈现，适合用于社群媒体、数位分身、虚拟主播等多场景应用。',
      },
    },
    pricingCta: '精选方案',
  },
  pricing: {
    badge:    '服务方案',
    title:    '选择适合您的方案',
    subtitle: '专业的 AI 人像服务，满足不同需求与预算',
    hottest:  '最热门',
    ctaInquiry: '立即咨询',
    basic: {
      name:        '基础方案',
      tagline:     '适合个人尝试体验',
      deliverables: [
        '10 张 LoRA 训练人像',
        '基础风格选择 (3 种)',
        '标准解析度输出',
        '48 小时交付',
        '基础修图调整',
      ],
    },
    pro: {
      name:        '专业方案',
      tagline:     '最受欢迎的选择',
      deliverables: [
        '30 张 LoRA 训练人像',
        '专属风格选择 (10 种)',
        '高解析度输出',
        '2 支 AI 动态视频 (3-5 秒)',
        '24 小时快速交付',
        '专业修图调整',
        '专属训练模型保留',
      ],
    },
    enterprise: {
      name:        '企业方案',
      tagline:     '完整的专业服务',
      deliverables: [
        '100 张 LoRA 训练人像',
        '全风格自由选择 (无限制)',
        '超高解析度输出',
        '5 支 AI 动态视频 (3-5 秒)',
        '12 小时极速交付',
        '顶级专业修图',
        '永久模型保留',
        '商业授权使用',
        '一对一专属服务',
      ],
    },
    priceLabel: 'NT$',
  },
  addons: {
    title:    '加购服务',
    subtitle: '根据您的需求，灵活地增加额外服务',
    extraVideo: {
      name: '额外 AI 视频',
      desc: '3-5 秒高品质人像动态视频',
      unit: '/ 支',
    },
    rushDelivery: {
      name: '加速交付',
      desc: '缩短至 6 小时内完成',
      unit: '/ 次',
    },
    extraTrainingPhotos: {
      name: '额外训练照片',
      desc: '在现有方案基础上增加照片数量',
      unit: '/ 张',
    },
  },
  finalCta: {
    title:       '不确定哪个方案适合您？',
    description: '欢迎透过 Telegram 与我们联系，我们将根据您的需求提供专业建议',
    button:      '免费咨询',
  },
  footer: {
    tagline:        '专业的 AI 人像生成与视频制作服务，为您打造独一无二的数位形象',
    contactTitle:   '联络我们',
    telegramButton: 'Telegram 咨询',
    responseTime:   '回复时间：通常 24 小时内',
    copyright:      '© 2026 AI 人像工作室. All rights reserved.',
  },
  scrollToTop: {
    label: '回到顶部',
  },
  languageSwitcher: {
    'zh-Hant': '繁中',
    'zh-Hans': '简中',
    'en':      'EN',
  },
}
