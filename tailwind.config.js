/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js}", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        mute: "rgb(var(--c-mute) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        "accent-deep": "rgb(var(--c-accent-deep) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        sans: ["Hanken Grotesk", "system-ui", "sans-serif"],
        mono: ["Fragment Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        prose2: "44rem",
        shell: "64rem",
      },
    },
  },
  plugins: [],
};
