/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090E17",
        sidebar: "#0D131C",
        card: "#111923",
        border: "#25313F",
        active: "#132E30",
        accent: "#55D6BE",
        mutedText: "#6E8298",
        subtext: "#9AAABB",
        iceWhite: "#E6EDF5",
      },
    },
  },
  plugins: [],
};
