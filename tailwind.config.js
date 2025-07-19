/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0057a3",
          light: "#3b82cb",
          dark: "#003f75",
        },
        secondary: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#b45309",
        },
        accent: {
          DEFAULT: "#10b981",
          light: "#34d399",
          dark: "#059669",
        },
        neutral: {
          DEFAULT: "#6b7280",
          light: "#9ca3af",
          dark: "#4b5563",
        },
      },
    },
  },
  plugins: [],
}
