module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          light: '#f0f4f8', // Your light secondary color
        },
        primary: {
          text: '#1a202c', // Your primary text color
        }
      },
    },
  },
  plugins: [],
}