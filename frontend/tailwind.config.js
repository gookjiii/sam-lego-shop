/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
      colors: {
        'pastel-pink': '#FFB399',
        'hot-pink': '#FF9A86',
        'soft-bg': '#FFF0BE',
        'text-main': '#475569',
        'text-heading': '#1E293B',
        'lavender': '#FFD6A6',
        'lego-red': '#E3000B',
        'lego-yellow': '#FFCF00',
        'lego-blue': '#005596',
        'lego-black': '#1E293B',
        'lego-white': '#F8FAFC',
        'primary-dark': '#0F172A',
        'accent-pink': '#FF6B6B',
        'accent-yellow': '#FFCF00',
      },
      fontFamily: {
        heading: ['"Be Vietnam Pro"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'clay-sm': 'inset -2px -2px 4px rgba(255, 154, 134, 0.2), 4px 4px 8px rgba(0, 0, 0, 0.04)',
        'clay-md': 'inset -4px -4px 8px rgba(255, 154, 134, 0.3), 8px 8px 16px rgba(0, 0, 0, 0.06)',
        'clay-lg': 'inset -6px -6px 12px rgba(255, 154, 134, 0.4), 12px 12px 24px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
      },
      borderRadius: {
        'clay': '24px',
        'neo': '12px',
      }
    },
  },
  plugins: [],
}
