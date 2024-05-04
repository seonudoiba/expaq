/** @type {import('tailwindcss').Config} */
import themer from "@tailus/themer";
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./node_modules/@tailus/themer-**/**/*.{js,ts}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.{js,ts}"

  ],
  darkMode: "media",
  safelist: ["isToggled"],
  theme: {
    colors: ({ colors }) => ({
      primary: "#3F7FB5",
      secondary: colors.lime,
      lighter: "#71A0D0",
      accent: colors.pink,
      success: colors.lime,
      danger: colors.red,
      warning: colors.yellow,
      info: colors.blue,
      gray: colors.zinc,
      white: colors.white,
      black: colors.black,
      transparent: colors.transparent,
    }),
    fontFamily: {
      'body': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ]
    },
    keyframes: {
      loop: {
        to: {
          "offset-distance": "100%",
        },
      },
    },
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/pc2.jpg')",
        'footer-texture': "url('/pc1.jpg')",
      }
    }

  },
  plugins: [
    require("daisyui"),
    themer({
      radius: "smoothest",
      background: "lighter",
      border: "light",
      padding: "large",
      components: {
        button: {
          rounded: "2xl"
        }
      }
    }),
    require('flowbite/plugin')
  ],
};


