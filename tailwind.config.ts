import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      mobile:  '425px',
      tablet:  '768px',
      desktop: '1024px',
      '4k':    '2560px',
    },
  },
  plugins: [],
} satisfies Config
