/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        organic: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg-void': '#000000',
        'bg-deep': '#0a0a0f',
        'bg-charcoal': '#12121c',
        'bg-midnight': '#1a1a2e',
      },
    },
  },
  plugins: [],
}
