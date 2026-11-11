# dishant-08.github.io

Personal portfolio — live at **https://dishant-08.github.io**

Hand-built static site: semantic HTML + Tailwind CSS, no framework. Light/dark theme, a GitHub contribution heatmap baked in at build time from real API data, and a LaTeX resume.

## Stack

- HTML + [Tailwind CSS](https://tailwindcss.com) (compiled to `dist/output.css`)
- Vanilla JS (`js/main.js`) — theme toggle, mobile menu, scrollspy
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

## Resume

`Dishant_resume.tex` is the source for `Dishant_resume.pdf` (single column, no tables or icons, so applicant tracking systems parse it). Rebuild with any of:

```bash
tectonic Dishant_resume.tex
xelatex Dishant_resume.tex
pdflatex Dishant_resume.tex
```

## Structure

```
index.html          the site (single page)
src/tokens.css      design tokens (colours, type, spacing; light and dark)
src/base.css        reset and element defaults
src/input.css       page styles; imports the two files above
js/main.js          interactions
scripts/            GitHub data refresh
dist/output.css     compiled CSS (committed for GitHub Pages)
Dishant_resume.tex  resume source
Dishant_resume.pdf  resume, linked from the site
images/             product screenshots (WebP, two widths each)
```
