/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Look for class names in all JS, JSX, TS, and TSX files inside the src directory
  ],
  theme: {
    extend: {
      colors: {
        skyblue: {
          DEFAULT: '#87CEEB',
          light: '#B0E2FF',
          dark: '#00BFFF',
        },
      },
    },
  },
  plugins: [],
}
