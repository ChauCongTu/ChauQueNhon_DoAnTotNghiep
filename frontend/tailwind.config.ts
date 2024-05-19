import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: (() => {
        const spacing: { [key: string]: string } = {};
        for (let i = 1; i <= 1440; i++) {
          if (i <= 375) {
            spacing[`${i}xs`] = `calc(${i}/375*100vw)`;
          }
          spacing[`${i}md`] = `calc(${i}/1440*100vw)`;
        }
        return spacing;
      })(),
      fontSize: (() => {
        const fontSize: { [key: string]: string } = {};
        for (let i = 1; i <= 80; i++) {
          fontSize[`${i}xs`] = `calc(${i}/375*100vw)`;
          fontSize[`${i}md`] = `calc(${i}/1440*100vw)`;
        }
        return fontSize;
      })(),
      lineHeight: (() => {
        const lineHeight: { [key: string]: string } = {};
        for (let i = 1; i <= 100; i++) {
          lineHeight[`${i}xs`] = `calc(${i}/375*100vw)`;
          lineHeight[`${i}md`] = `calc(${i}/1440*100vw)`;
        }
        return lineHeight;
      })(),
      borderRadius: (() => {
        const borderRadius: { [key: string]: string } = {};
        for (let i = 1; i <= 20; i++) {
          borderRadius[`${i}xs`] = `calc(${i}/375*100vw)`;
          borderRadius[`${i}md`] = `calc(${i}/1440*100vw)`;
        }
        return borderRadius;
      })(),
      borderWidth: (() => {
        const borderWidth: { [key: string]: string } = {};
        for (let i = 1; i <= 20; i++) {
          borderWidth[`${i}xs`] = `calc(${i}/375*100vw)`;
          borderWidth[`${i}md`] = `calc(${i}/1440*100vw)`;
        }
        return borderWidth;
      })(),
      blur: (() => {
        const blur: { [key: string]: string } = {};
        for (let i = 1; i <= 5; i++) {
          blur[`${i}xs`] = `calc(${i}/375*100vw)`;
          blur[`${i}md`] = `calc(${i}/1440*100vw)`;
        }
        return blur;
      })(),
      strokeWidth: (() => {
        const stroke: { [key: string]: string } = {};
        for (let i = 1; i <= 30; i++) {
          stroke[`${i}xs`] = `calc(${i}/375*100vw)`;
          stroke[`${i}md`] = `calc(${i}/1440*100vw)`;
        }
        return stroke;
      })(),
      colors: {
        primary: "#f14600",
        secondary: "#40e2f9",
        link: "#3979E1",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          md: "0",
        },
      },
      fontFamily: {
        neue: [
          "Neue Haas Grotesk Display Pro",
          "Hiragino Kaku Gothic Pro",
        ],
        inter: ["Inter"],
      },
    },
    screens: {
      sm: "640px",
      md: "769px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      maxsm: {
        max: "767px",
      },
      maxmd: {
        max: "1023px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
