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
        background: '#ECFEFF',
        text: '#164E63',
        primary: '#0891B2',
        secondary: '#22D3EE',
        cta: '#22C55E',
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
