/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        lg900: "768px",
        sm500: "600px", // custom breakpoint at 900px
      },
    },
  },
  plugins: [],
};
