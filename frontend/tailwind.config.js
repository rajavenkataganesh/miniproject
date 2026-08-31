/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569'
        },
        cyber: {
          blue: '#38bdf8',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
          purple: '#a855f7'
        }
      }
    },
  },
  plugins: [],
}
