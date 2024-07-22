/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ['"Comic Neue"', "cursive"],
      },
      backgroundImage: {
        "custom-hot-gradient":
          "linear-gradient(220deg, #FFE53B -40%, #FF2525 60%)",
        "custom-cold-gradient":
          "linear-gradient(330deg, #0093ff 40%, #80D0DA 100%)",
      },
      inset: {
        "-full-minus-1": "calc(-100% - 1px)", // Adjust `1rem` to the value you need
      },
    },
  },
  plugins: [],
};
