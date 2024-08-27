/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        "custom-hot-gradient":
          "linear-gradient(220deg, #FFE53B -40%, #FF2525 60%)",
        "custom-cold-gradient":
          "linear-gradient(330deg, #0093ff 40%, #80D0DA 100%)",
        "custom-hot-cold-gradient":
          "linear-gradient(80deg, #EF2525 20%, #FF5500 35%, #FF753B 45%, #00B3ff 60%, #0093ff 80%, #005EFE 100% )",
      },
      inset: {
        "-full-minus-1": "calc(-100% - 1px)", // Adjust `1rem` to the value you need
      },
      keyframes: {
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", visibility: "visible" },
          "100%": { transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", visibility: "visible" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)", visibility: "hidden" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)", visibility: "hidden" },
        },
      },
      animation: {
        slideInLeft: "slideInLeft 1s ease-out forwards",
        slideInRight: "slideInRight 1s ease-out forwards",
        slideOutLeft: "slideOutLeft 1s ease-out forwards",
        slideOutRight: "slideOutRight 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
