/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F5F2EC',
        primary: '#1C1C1C',
        accent: '#C9A84C',
        terracotta: '#B5522A',
        card: '#FFFFFF',
        muted: '#6B6B6B',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(28, 28, 28, 0.08)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
