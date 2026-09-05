/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf7e2",
          100: "#f9e7b0",
          200: "#f5d77e",
          300: "#f1c84d",
          400: "#edb81c",
          500: "#d4a316",
          600: "#a57f10",
          700: "#775b0b",
          800: "#493706",
          900: "#1f1602",
        },
        silver: {
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#cccccc",
          300: "#b5b5b5",
          400: "#9e9e9e",
          500: "#888888",
          600: "#6e6e6e",
          700: "#555555",
          800: "#3d3d3d",
          900: "#272727",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};