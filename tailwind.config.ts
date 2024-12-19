import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1C1917', // Main background
          secondary: '#292524', // Cards, sidebars
          overlay: '#1C1917F2', // Modals, 95% opacity
          hover: '#2B2523', // Hover states
          active: '#1F1D1B', // Active/pressed states
        },
        accent: {
          DEFAULT: 'rgb(217, 119, 6)', // Amber-600
          muted: 'rgba(217, 119, 6, 0.2)', // Borders
          hover: 'rgba(217, 119, 6, 0.3)', // Hover states
          active: 'rgba(217, 119, 6, 0.4)', // Active states
        },
        text: {
          primary: 'rgb(245, 245, 244)', // stone-100
          secondary: 'rgb(214, 211, 209)', // stone-300
          muted: 'rgb(168, 162, 158)', // stone-400
          inverse: '#1C1917', // For light backgrounds
        },
      },
      fontFamily: {
        display: ['var(--font-crimson)'],
        body: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
