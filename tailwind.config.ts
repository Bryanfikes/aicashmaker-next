import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './collections/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0ea5e9',
          secondary: '#10b981',
        },
        dark: {
          DEFAULT: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          400: '#94a3b8',
          300: '#cbd5e1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}

export default config
