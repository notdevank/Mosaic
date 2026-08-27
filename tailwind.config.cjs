/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#F8F7F3',
          'bg-dark': '#0D0D0D',
          card: '#FFFFFF',
          'card-dark': '#161616',
          border: '#E6E4DC',
          'border-dark': '#2A2A2A',
          subtle: '#EFEFEA',
          'subtle-dark': '#222222',
        },
        sage: {
          50: '#F4F6F2',
          100: '#E6EAE1',
          200: '#CFD7C8',
          300: '#9BB088',
          400: '#849274',
          500: '#68735C',
          600: '#545E4A',
          700: '#424B3A',
        },
        primary: {
          text: '#191919',
          'text-dark': '#FFFFFF',
          secondary: '#666666',
          'secondary-dark': '#A1A1AA',
        }
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'elevated': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
