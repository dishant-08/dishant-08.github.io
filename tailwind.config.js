/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js}", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        paper2: "rgb(var(--c-paper2) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        mute: "rgb(var(--c-mute) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        accent2: "rgb(var(--c-accent2) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Instrument Sans", "system-ui", "sans-serif"],
        mono: ["Spline Sans Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        prose2: "44rem",
      },
    },
  },
  plugins: [],
};
