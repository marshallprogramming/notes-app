/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        noteBackground: "#e6f2fe",
      },
    },
  },
  plugins: [],
};
