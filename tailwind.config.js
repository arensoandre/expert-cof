/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        dark: {
          bg: '#12161C',
          sidebar: '#0F141A',
          surface: '#1C232B',
          'surface-hover': '#232A33',
          border: '#2A313A',
          text: {
            primary: '#CBD3DC',
            secondary: '#8B96A3',
          }
        },
        brand: {
          blue: '#2E78FF',
          green: '#29D36A',
          yellow: '#F2C94C',
          red: '#FF3B3B',
        }
      }
    },
  },
  plugins: [],
};
