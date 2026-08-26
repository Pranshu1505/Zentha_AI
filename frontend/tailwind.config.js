/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0F1115",
        surface: "#171A21",
        surface2: "#1F232C",
        border: "#2A2F3A",
        accent: "#7C5CFC",
        accent2: "#F5A623",
        text: "#E7E9EE",
        muted: "#8B92A3",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
