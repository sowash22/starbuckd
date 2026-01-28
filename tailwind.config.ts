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
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#525252',
            '[class~="lead"]': {
              color: '#737373',
            },
            a: {
              color: '#171717',
              textDecoration: 'none',
              fontWeight: '600',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            strong: {
              color: '#171717',
              fontWeight: '700',
            },
            'ol > li::before': {
              color: '#737373',
            },
            'ul > li::before': {
              backgroundColor: '#d4d4d4',
            },
            hr: {
              borderColor: '#e5e5e5',
            },
            blockquote: {
              color: '#171717',
              borderLeftColor: '#e5e5e5',
            },
            h1: {
              color: '#171717',
              fontWeight: '900',
            },
            h2: {
              color: '#171717',
              fontWeight: '900',
            },
            h3: {
              color: '#171717',
              fontWeight: '800',
            },
            h4: {
              color: '#171717',
              fontWeight: '700',
            },
            'figure figcaption': {
              color: '#737373',
            },
            code: {
              color: '#171717',
              backgroundColor: '#f5f5f5',
              fontWeight: '500',
            },
            'a code': {
              color: '#171717',
            },
            pre: {
              color: '#e5e5e5',
              backgroundColor: '#171717',
            },
            thead: {
              color: '#171717',
              borderBottomColor: '#d4d4d4',
            },
            'tbody tr': {
              borderBottomColor: '#e5e5e5',
            },
          },
        },
        invert: {
          css: {
            color: '#d4d4d4',
            '[class~="lead"]': {
              color: '#a3a3a3',
            },
            a: {
              color: '#f5f5f5',
            },
            strong: {
              color: '#f5f5f5',
            },
            'ol > li::before': {
              color: '#a3a3a3',
            },
            'ul > li::before': {
              backgroundColor: '#525252',
            },
            hr: {
              borderColor: '#404040',
            },
            blockquote: {
              color: '#f5f5f5',
              borderLeftColor: '#404040',
            },
            h1: {
              color: '#f5f5f5',
            },
            h2: {
              color: '#f5f5f5',
            },
            h3: {
              color: '#f5f5f5',
            },
            h4: {
              color: '#f5f5f5',
            },
            'figure figcaption': {
              color: '#a3a3a3',
            },
            code: {
              color: '#f5f5f5',
              backgroundColor: '#262626',
            },
            'a code': {
              color: '#f5f5f5',
            },
            pre: {
              color: '#e5e5e5',
              backgroundColor: '#0a0a0a',
            },
            thead: {
              color: '#f5f5f5',
              borderBottomColor: '#404040',
            },
            'tbody tr': {
              borderBottomColor: '#262626',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
