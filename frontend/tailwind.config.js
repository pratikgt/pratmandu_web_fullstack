/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E53935",
          dark: "#C62828",
        },
      },
    },
  },
  plugins: [],
};