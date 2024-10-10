/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors
        lightGray: '#F5F5F5',
        darkGray: '#5C5C5C',
        hoverGray: '#D8D8D8',
        buttonGray: '#303030',
        buttonCyan: '#E11BB6',
      },
    },
  },
  plugins: [],
}