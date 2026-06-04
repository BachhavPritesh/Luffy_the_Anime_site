/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'luffy-red':    '#e63946',
        'luffy-gold':   '#ffd166',
        'luffy-teal':   '#06d6a0',
        'luffy-bg':     '#0a0a0f',
        'luffy-surface':'#12121a',
        'luffy-surface2':'#1a1a26',
        'luffy-offset': '#1f1f30',
        'luffy-text':   '#f0f0f5',
        'luffy-muted':  '#8888aa',
        'luffy-faint':  '#4a4a6a',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body:    ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        shimmer:     'shimmer 1.5s ease-in-out infinite',
        'glow-pulse':'glow-pulse 2s ease-in-out infinite',
        float:       'float 3s ease-in-out infinite',
        'slide-up':  'slide-up 0.3s ease-out forwards',
        'fade-in':   'fade-in 0.4s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%,100%': { backgroundPosition: '-200% 0' },
          '50%':     { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%,100%': { boxShadow: '0 0 0px #e63946' },
          '50%':     { boxShadow: '0 0 24px rgba(230,57,70,0.667)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      backdropBlur: { xs: '2px' },
      borderRadius: {
        DEFAULT: '8px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'glow-red':  '0 0 20px rgba(230,57,70,0.4)',
        'glow-gold': '0 0 20px rgba(255,209,102,0.4)',
        'card':      '0 4px 24px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
