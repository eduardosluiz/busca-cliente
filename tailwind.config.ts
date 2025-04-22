import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-700
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#0ea5e9', // sky-500
          foreground: '#FFFFFF',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB', // gray-50
        },
        foreground: {
          DEFAULT: '#111827', // gray-900
          secondary: '#4B5563', // gray-600
        },
        border: {
          DEFAULT: '#E5E7EB', // gray-200
        },
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

export default config 