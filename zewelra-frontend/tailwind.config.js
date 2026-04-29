/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD6C9",   // light peach
        soft: "#FFF5F2",
        accent: "#ff8a65"
      }
    },
  },
  plugins: [],
}