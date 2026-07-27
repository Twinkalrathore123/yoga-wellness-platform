/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, earthy palette suited to a yoga/wellness product
        sage: {
          50: '#f4f6f2',
          100: '#e5ebe0',
          200: '#c9d6bf',
          400: '#8ba876',
          600: '#5a7a45',
          700: '#456035',
        },
        clay: {
          400: '#d8916a',
          600: '#b96f45',
        },
        ink: '#2b2a26',
      },
      fontFamily: {
        // Add these via Google Fonts link in index.html
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
