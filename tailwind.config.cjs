/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0a0a0a',
        primary: '#4A90E2',
        secondary: '#2C3E50',
        accent: '#E8B84D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        japanese: ['Noto Sans JP', 'sans-serif'],
        gangofthree: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}
