/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        thai: ['"Prompt"', '"Sarabun"', '"Kanit"', 'sans-serif'],
        display: ['"Prompt"', '"Sarabun"', 'sans-serif'],
        playful: ['"Mali"', 'cursive', 'sans-serif'],
      },
      colors: {
        game: {
          bg: '#0f172a',
          board: '#1e293b',
          accent: '#f59e0b',
          danger: '#ef4444',
          success: '#10b981',
          primary: '#6366f1',
          secondary: '#ec4899',
        }
      },
      animation: {
        'bounce-short': 'bounce 0.5s ease-in-out 1',
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
