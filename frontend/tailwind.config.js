/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fantasy: {
          primary: '#6C5CE7',
          secondary: '#A29BFE',
          accent: '#FD79A8',
          dark: '#2D3436',
          light: '#F7F7F7',
          success: '#00B894',
          warning: '#FDCB6E',
          danger: '#D63031',
          kahoot: {
            purple: '#46178F',
            blue: '#1EA7E1',
            red: '#FF3C5F',
            green: '#28CC71',
            yellow: '#FFD166'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      }
    },
  },
  plugins: [],
}
