/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ou 'media'
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,md}"],
  theme: {
    extend: {
      colors: { "primary-blue": "#3b82f6", "secondary-blue-hover": "#2563eb" },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
