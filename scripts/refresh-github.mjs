// Regenerates the GitHub contribution heatmap + counts baked into index.html.
// Zero dependencies; auth comes from the `gh` CLI. Run: node scripts/refresh-github.mjs
// Then rebuild CSS if needed and eyeball the section before committing.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = join(ROOT, "index.html");
const LOGIN = "dishant-08";

const QUERY = `{ user(login: "${LOGIN}") { contributionsCollection { contributionCalendar {
  totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;

const raw = execFileSync("gh", ["api", "graphql", "-f", `query=${QUERY}`], {
  encoding: "utf8",
});
const cal = JSON.parse(raw).data.user.contributionsCollection.contributionCalendar;

// ── Build the SVG ────────────────────────────────────────────────────────────
const CELL = 11;
const GAP = 3;
const PITCH = CELL + GAP;
const LEFT = 30; // day labels
const TOP = 16; // month labels
const LEVEL = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const MONTHS_LONG =
  "January February March April May June July August September October November December".split(" ");

const monthOf = (iso) => Number(iso.slice(5, 7)) - 1;
const yearOf = (iso) => iso.slice(0, 4);
const pretty = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const weeks = cal.weeks;
const W = LEFT + weeks.length * PITCH - GAP;
const H = TOP + 7 * PITCH - GAP;

let cells = "";
let monthLabels = "";
let prevMonth = -1;
weeks.forEach((week, wi) => {
  const x = LEFT + wi * PITCH;
  const first = week.contributionDays[0];
  const m = monthOf(first.date);
  // Label a month at the first week it owns; skip a label crammed into the last column.
  if (m !== prevMonth && wi < weeks.length - 2) {
    monthLabels += `<text class="hm-label" x="${x}" y="10">${MONTHS[m]}</text>`;
  }
  prevMonth = m;
  week.contributionDays.forEach((day) => {
    const dow = new Date(day.date + "T00:00:00Z").getUTCDay();
    const y = TOP + dow * PITCH;
    const lvl = LEVEL[day.contributionLevel] ?? 0;
    const title =
      day.contributionCount > 0
        ? `<title>${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} · ${pretty(day.date)}</title>`
        : "";
    cells += `<rect class="hm-${lvl}" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5">${title}</rect>`;
  });
});

const dayLabels = [
  ["Mon", 1],
  ["Wed", 3],
  ["Fri", 5],
]
  .map(
    ([label, row]) =>
      `<text class="hm-label" x="0" y="${TOP + row * PITCH + CELL - 2}">${label}</text>`
  )
  .join("");

const firstDay = weeks[0].contributionDays[0].date;
const lastWeek = weeks[weeks.length - 1].contributionDays;
const lastDay = lastWeek[lastWeek.length - 1].date;
const range = `${MONTHS[monthOf(firstDay)]} ${yearOf(firstDay)} — ${MONTHS[monthOf(lastDay)]} ${yearOf(lastDay)}`;
const asOf = `${MONTHS_LONG[monthOf(lastDay)]} ${yearOf(lastDay)}`;
const total = cal.totalContributions;
const totalFmt = total.toLocaleString("en-US");
const rounded = Math.floor(total / 100) * 100;
const roundedFmt = rounded.toLocaleString("en-US");

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub contribution calendar, ${range}: ${totalFmt} contributions">${monthLabels}${dayLabels}${cells}</svg>`;

// ── Inject into index.html ───────────────────────────────────────────────────
let html = readFileSync(HTML, "utf8");
const before = html;

html = html.replace(
  /(<!-- GH-HEATMAP:START[^>]*-->)[\s\S]*?(<!-- GH-HEATMAP:END -->)/,
  `$1\n              ${svg}\n              $2`
);
html = html.replace(
  /(<span[^>]*data-gh-total[^>]*>)[^<]*(<\/span>)/,
  `$1${totalFmt}$2`
);
html = html.replace(
  /(<span data-gh-range>)[^<]*(<\/span>)/,
  `$1${range}$2`
);
html = html.replace(
  /(<span data-gh-asof>)[^<]*(<\/span>)/,
  `$1${asOf}$2`
);
// ponytail: attribute-order-sensitive regex; fine while this script owns the markup
html = html.replace(
  /(data-count=")\d+(" data-suffix="\+" data-gh-rounded>)[\s\S]*?(<\/p>)/,
  `$1${rounded}$2\n                ${roundedFmt}+\n              $3`
);

if (html === before) {
  console.error("No markers replaced — check index.html markers.");
  process.exit(1);
}
writeFileSync(HTML, html);
console.log(
  `Baked ${totalFmt} contributions (${range}); stat band shows ${roundedFmt}+.`
);
