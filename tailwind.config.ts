import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1E3932', // Starbucks House Green (Deep Dark Green)
        text: '#FFFFFF',
        primary: '#00704A',   // Starbucks Primary Green
        secondary: '#D4E9E2', // Starbucks Light Accent Green
        cta: '#C2A64D',       // Starbucks Warm Gold/Coffee Accent
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        marker: ['var(--font-marker)', 'cursive'],
      },
    },
  },
  plugins: [],
}
export default config
