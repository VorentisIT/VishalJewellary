/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#102C24',
          dark: '#0A1D18',
          light: '#173D32'
        },
        ivory: {
          DEFAULT: '#F8F5EE',
          paper: '#F4EFEA',
          card: '#FFFFFF'
        },
        champagne: {
          DEFAULT: '#EFE7D8',
          light: '#F5EFE3'
        },
        gold: {
          DEFAULT: '#C49A5A',
          light: '#D9BC86',
          dark: '#A57E3F',
          hover: '#B38E46'
        },
        saffron: {
          DEFAULT: '#D96B27',
          light: '#E87D3E',
          dark: '#B85517',
          soft: '#FFF5EB'
        },
        charcoal: {
          DEFAULT: '#202522',
          muted: '#77736B'
        },
        warm: {
          border: '#DED8CC'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
