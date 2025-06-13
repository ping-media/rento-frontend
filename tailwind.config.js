/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "lighter-gray": "#F5F7FB",
        "light-gray": "#FAFBFD",
        // theme: "#e23844",
        theme: "#DE2A1B",
        "theme-dark": "#c32d3b",
        "theme-seconday-dark": "#8f1b28",
        "theme-black": "#1E201E",
      },
    },
  },
  plugins: [],
};
