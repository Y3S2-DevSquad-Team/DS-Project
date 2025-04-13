/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#06C167", // Uber Eats green
        secondary: "#262626", // Dark UI
        accent: "#ff5a5f", // Optional
      }
    },
  },
  plugins: [],
}