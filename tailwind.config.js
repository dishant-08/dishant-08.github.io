/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js}", "./js/**/*.js"],
  darkMode: ["selector", '[data-theme="dark"]'],
  // base.css is the reset, and `.container` is its own class there. Utilities
  // that lean on Tailwind's base-layer variables (ring, shadow, transform)
  // need `@tailwind base` restored in src/input.css before they are used.
  corePlugins: { preflight: false, container: false },
  theme: {
    extend: {
      // Every value is a token from src/tokens.css, so utilities follow the theme.
      colors: {
        paper: "var(--color-paper)",
        surface: "var(--color-paper-2)",
        ink: "var(--color-ink)",
        mute: "var(--color-muted)",
        line: "var(--color-rule)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-body)",
        mono: "var(--font-outlier)",
      },
    },
  },
  plugins: [],
};
