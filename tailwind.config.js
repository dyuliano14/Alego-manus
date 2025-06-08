/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ou 'media'
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,md}',
  ],
  theme: { extend: {} },
  plugins: []
};