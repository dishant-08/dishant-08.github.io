# dishant-08.github.io

Personal portfolio — live at **https://dishant-08.github.io**

Hand-built static site: semantic HTML + Tailwind CSS, no framework. Light/dark theme, Lenis smooth scroll, and a GitHub contribution heatmap baked in at build time from real API data.

## Stack

- HTML + [Tailwind CSS](https://tailwindcss.com) (compiled to `dist/output.css`)
- Vanilla JS (`js/main.js`) — theme toggle, scrollspy, reveals, scroll progress, stat count-up
- [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll (CDN)
- Type: Newsreader · Hanken Grotesk · Fragment Mono

## Develop

```bash
npm install
npm run watch   # rebuild CSS on change
python3 -m http.server 8000   # serve locally
```

## Build

```bash
npm run build
```

## Refresh GitHub data

The contribution heatmap and counts in `index.html` are generated, not live-fetched (no rate limits, no third-party proxy, no layout shift). To refresh:

```bash
node scripts/refresh-github.mjs   # needs the `gh` CLI, authenticated
```

## Structure

```
index.html        the site (single page)
src/input.css     design tokens + components
js/main.js        interactions
scripts/          GitHub data refresh
dist/output.css   compiled CSS (committed for GitHub Pages)
```
