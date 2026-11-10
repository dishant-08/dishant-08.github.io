// Theme toggle, mobile menu, scrollspy, heatmap scroll position, footer year.

(function () {
  const html = document.documentElement;

  // ── Theme toggle ───────────────────────────────────────────────────────────
  // The inline head script sets data-theme before first paint; CSS swaps the icons.
  const toggles = document.querySelectorAll(".theme-toggle");

  function syncToggleUI() {
    const dark = html.dataset.theme === "dark";
    toggles.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(dark));
      const label = btn.querySelector(".toggle-label");
      if (label) label.textContent = dark ? "Switch to light mode" : "Switch to dark mode";
    });
  }

  toggles.forEach((btn) =>
    btn.addEventListener("click", () => {
      const dark = html.dataset.theme !== "dark";
      html.dataset.theme = dark ? "dark" : "light";
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch (e) {}
      syncToggleUI();
    })
  );
  syncToggleUI();

  // ── Mobile menu ────────────────────────────────────────────────────────────
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    const setOpen = (open) => {
      mobileMenu.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menuToggle.addEventListener("click", () => {
      const open = !mobileMenu.classList.contains("is-open");
      setOpen(open);
      if (open) mobileMenu.querySelector("a").focus();
    });
    mobileMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setOpen(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        setOpen(false);
        menuToggle.focus();
      }
    });
  }

  // ── Scrollspy (top nav) ────────────────────────────────────────────────────
  const spyLinks = document.querySelectorAll("[data-spy]");
  if (spyLinks.length && "IntersectionObserver" in window) {
    const byId = {};
    spyLinks.forEach((l) => (byId[l.dataset.spy] = l));

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          spyLinks.forEach((l) => l.removeAttribute("aria-current"));
          const link = byId[entry.target.id];
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    // #top and #github carry no nav link; observing them clears the marker there.
    ["top", "experience", "projects", "github", "skills", "education", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  // ── Heatmap: on narrow screens it scrolls sideways; start at the latest week.
  const chart = document.querySelector(".chart__scroll");
  if (chart) chart.scrollLeft = chart.scrollWidth;

  // ── Footer year ────────────────────────────────────────────────────────────
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
