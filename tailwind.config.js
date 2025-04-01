/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "bg-blue-600", "hover:bg-blue-700", "focus:ring-blue-400",
    "bg-red-600", "hover:bg-red-700", "focus:ring-red-400",
    "bg-green-600", "hover:bg-green-700", "focus:ring-green-400",
    "bg-yellow-500", "hover:bg-yellow-600", "focus:ring-yellow-300"
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          blue: "#3B82F6",
          red: "#EF4444",
          green: "#10B981",
          yellow: "#F59E0B",
        },
      },
      // 🔽 Agrega esto para la animación del selector de íconos
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}