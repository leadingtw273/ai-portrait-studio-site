import type { Config } from 'tailwindcss'
import containerQueries from '@tailwindcss/container-queries'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      mobile:  '425px',
      tablet:  '768px',
      desktop: '1024px',
      '4k':    '2560px',
    },
    extend: {
      colors: {
        bg: {
          base:     '#0E0B1F',
          elevated: '#1A0F2F',
        },
        brand: {
          500: '#7C3AED',
          400: '#8B5CF6',
          300: '#A855F7',
          accent: '#D946EF',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          hover:   'rgba(255,255,255,0.06)',
        },
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-brand':  'rgba(168,85,247,0.4)',
      },
      boxShadow: {
        'glow-md': '0 0 16px rgba(124,58,237,0.25)',
        'glow-lg': '0 8px 24px -4px rgba(124,58,237,0.4)',
        'glow-xl': '0 0 32px rgba(124,58,237,0.3)',
      },
      backdropBlur: { card: '12px' },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #A855F7, #7C3AED, #3F1A6F)',
      },
    },
  },
  plugins: [containerQueries],
} satisfies Config
