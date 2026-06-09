import type { Messages } from './messages.zh-hant'

export const zhHans: Messages = {
  nav: {
    plans:   '服务对象',
    demo:    '作品展示',
    contact: '联络',
  },
  hero: {
    badge:        'AI 智能 ・ 创新 ・ 专业 ・ 服务',
    title:        'AI 影像工作室',
    subtitle:     '专业的 AI 视频与影像生成服务',
    description:  '从 AI 视频内容到 LoRA 专属人像，以先进生成技术为品牌、创作者与团队打造独一无二的数位影像资产',
    ctaPrimary:   '查看作品展示',
    ctaSecondary: '看看我们怎么帮你',
    scrollHint:   '向下滚动探索',
  },
  demo: {
    badge:    '作品展示',
    title:    'AI 生成作品范例',
    subtitle: '透过先进的 AI 技术，为您打造专业级的人像作品',
    tabs: {
      image: 'LoRA 人像训练',
      video: '视频内容生成',
    },
    imageCardAlt: 'AI 生成人像示意图',
    loraBefore: '训练前：原始照片',
    loraAfter: '训练后：LoRA 生成范例',
    loraArrowLabel: 'LoRA 训练流程：原始照片转换为训练后输出',
    loraAiGeneratedTag: 'AI 生成',
    videoCard: {
      title1: '产品宣传短片',
      desc1:  '品牌代言视觉：AI 人脸 × 茶园实景 × 产品手持',
      title2: '品牌 KV 概念片',
      desc2:  '电影分镜叙事：AI 人物 × 汽车 KV × 多镜头剪辑',
      playLabel: '点击播放视频',
    },
    techBanner: {
      image: {
        title:       '什么是 LoRA 训练？',
        description: 'LoRA（Low-Rank Adaptation）是一种高效的 AI 模型微调技术。我们使用您提供的照片进行专属训练，让 AI 学习您的独特面部特征、表情和风格。训练完成后，即可生成各种场景、风格和姿态的专业人像照片，且都保持您的真实特征。',
      },
      video: {
        title:       'AI 视频内容生成',
        description: '透过先进的 AI 视频生成技术，我们可以将静态人像转换为流畅自然的动态视频。无论是微笑、眨眼、转头等动作，都能以电影级的品质呈现，适合用于社群媒体、数位分身、虚拟主播等多场景应用。',
      },
    },
  },
  audiences: {
    badge:         '服务对象',
    title:         '我们服务这三类客户',
    subtitle:      '以上这些专业能力，会依不同客群的需求，组成完全不同的解决方案',
    painTitle:     '你是不是遇到——',
    solutionTitle: '我们怎么帮你——',
    cards: {
      brand: {
        name:    '品牌・广告主',
        tagline: '需要形象与广告素材的企业主、电商与本地商家',
        pains: [
          '找Model、租棚、每次外拍烧掉大笔预算',
          '换档期就得重拍，素材量永远不够更新',
          '商品想要代言形象，却请不起长期代言人',
          '投广告需要大量不同版本素材做 A/B 测试',
        ],
        solutions: [
          '打造专属品牌形象人物，一次训练、长期沿用',
          '同一张脸产出无限场景与服装，换档期不必重拍',
          '商品形象写真 + 代言视觉，成本仅传统外拍的一小部分',
          '批量产出多版本广告素材，加速投放与测试',
        ],
        ctaLabel: '聊聊我的需求',
      },
      creator: {
        name:    '网红・经纪・自媒体',
        tagline: '想靠影音内容变现的创作者、经纪公司与 MCN',
        pains: [
          '内容产量永远追不上平台算法的胃口',
          '真人出镜有档期、肖像与隐私的层层限制',
          '想经营虚拟人设，却缺技术与稳定产线',
          '跨平台要做差异化内容，人力根本做不完',
        ],
        solutions: [
          '建立专属虚拟人物与 LoRA，内容产量直接拉满',
          '人像 + 视频一条龙，短视频与贴文素材稳定供应',
          '从人设、风格表到发布策略，帮你把虚拟 IP 养起来',
          '跨平台差异化内容批量产出，一人也能做出团队的量',
        ],
        ctaLabel: '聊聊我的需求',
      },
      operator: {
        name:    '专业操盘手・多账号矩阵',
        tagline: '需要同时经营多组虚拟人设与品牌账号的专业团队',
        pains: [
          '要同时养多组人设，产量远超一般工作室',
          '不同人设长相一致、风格独立、不能撞脸',
          '素材需求是持续性的，产线一停内容就断',
          '一般外包无法配合保密与专属产制的需求',
        ],
        solutions: [
          '为每组人设训练独立 LoRA，角色一致、互不混淆',
          '规模化人像 + 视频产线，支持高频、大批量交付',
          '人设、风格与场景可系统化区隔与管理',
          '专属保密合作模式，依产量级距定制专案',
        ],
        ctaLabel: '洽谈专属产线',
      },
    },
  },
  finalCta: {
    title:       '不确定你属于哪一类客户？',
    description: '欢迎透过 Telegram 与我们联系，我们将根据您的需求提供专业建议',
    button:      '免费咨询',
  },
  footer: {
    tagline:        '专业的 AI 人像生成与视频制作服务，为您打造独一无二的数位形象',
    contactTitle:   '联络我们',
    telegramButton: 'Telegram 咨询',
    responseTime:   '回复时间：通常 24 小时内',
    qrCaption:      '或扫 QR 加入',
    copyright:      '© 2026 AI 影像工作室. All rights reserved.',
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
