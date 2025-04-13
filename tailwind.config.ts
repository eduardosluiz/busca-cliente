import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-600
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#06B6D4', // cyan-500
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
    },
  },
  plugins: [],
}

export default config 