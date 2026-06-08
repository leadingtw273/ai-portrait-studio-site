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
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          hover:   'rgb(var(--color-surface-hover) / <alpha-value>)',
        },
        content: {
          DEFAULT: 'rgb(var(--color-content) / <alpha-value>)',
          muted:   'rgb(var(--color-content-muted) / <alpha-value>)',
          subtle:  'rgb(var(--color-content-subtle) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover:   'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
        focus:       'rgb(var(--color-focus) / <alpha-value>)',
      },
      boxShadow: {
        'soft':    '0 1px 2px rgba(43,36,32,0.06), 0 8px 24px -12px rgba(43,36,32,0.12)',
        'soft-lg': '0 2px 4px rgba(43,36,32,0.06), 0 16px 40px -16px rgba(43,36,32,0.16)',
      },
      backdropBlur: { card: '12px' },
      fontFamily: {
        sans:  ['Inter', 'Noto Sans TC', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [containerQueries],
} satisfies Config
