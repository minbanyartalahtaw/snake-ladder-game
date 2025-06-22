// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 4. Add the custom font families
        sans: ["var(--font-body)"], // This makes Nunito the default font
        heading: ["var(--font-heading)"], // This creates a new 'font-heading' utility class
      },
    },
  },
  plugins: [],
};
