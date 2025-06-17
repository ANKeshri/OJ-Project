/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2236',
          dark: '#10182a',
        },
        darkblue: '#0a192f',
        accentblue: '#2563eb', // Tailwind blue-600
        background: '#0d1117', // GitHub dark background
      },
    },
  },
  plugins: [],
}