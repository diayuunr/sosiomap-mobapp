/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // Primary
        primary: "#007BE5",
        "primary-dark": "#050F32",
        "primary-light": "#D9D9D9",

        // Accent
        accent: "#FDD216",
        "accent-dark": "#ecc204",
        "accent-light": "#EACE2A",

        // Backgrounds
        bg: "#F1F5F9",
        card: "#FFFFFF",

        // Text
        "text-primary": "#000000",
        "text-second": "#4FB8F8",
        "text-muted": "#898989",

        // Status
        success: "#0AA34F",
        warning: "#EACE2A",
        danger: "#C20B0D",

        // Border
        border: "#D9D9D9",

        // Extras
        green: "#0AA24F",
        "green-light": "#DCFCE7",

        yellow: "#FDD216",
        "yellow-light": "#FEF9C3",

        red: "#C20B0D",
        "red-light": "#FEE2E2",

        "blue-sky": "#4FB8F8",
        navy: "#050F32",
        gray: "#898989",
      },

      fontFamily: {
        "mplus-black": ["MplusBlack"],
        "mplus-extrabold": ["MplusExtraBold"],
        "mplus-bold": ["MplusBold"],
        "mplus-medium": ["MplusMedium"],
        "mplus-regular": ["MplusRegular"],
        "mplus-light": ["MplusLight"],
        "mplus-thin": ["MplusThin"],
      },
    },
  },

  plugins: [],
};