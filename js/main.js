// Theme, menu, scrollspy, reveals, smooth scroll.

(function () {
  const html = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Smooth scroll (Lenis) ──────────────────────────────────────────────────
  // Inertial scrolling; skipped entirely for reduced-motion users, who get
  // the browser's native behavior instead.
  let lenis = null;
  if (!reducedMotion && typeof window.Lenis === "function") {
    lenis = new window.Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Route same-page anchor clicks through Lenis so easing + offset match.
    document.querySelectorAll('a[href^="#"]').forEach((link) =>
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72 });
        history.pushState(null, "", link.getAttribute("href"));
        // Keep keyboard/screen-reader focus in sync with the visual jump
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      })
    );
  }

  // ── Theme toggle ───────────────────────────────────────────────────────────
  const toggles = document.querySelectorAll(".theme-toggle");

  function syncToggleUI() {
    const dark = html.classList.contains("dark");
    toggles.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(dark));
      const label = btn.querySelector(".toggle-label");
      if (label) label.textContent = dark ? "Light mode" : "Dark mode";
      const sun = btn.querySelector(".icon-sun");
      const moon = btn.querySelector(".icon-moon");
      if (sun) sun.style.display = dark ? "block" : "none";
      if (moon) moon.style.display = dark ? "none" : "block";
    });
  }

  toggles.forEach((btn) =>
    btn.addEventListener("click", () => {
      const dark = html.classList.toggle("dark");
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
    menuToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("hidden") === false;
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mobileMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ── Scrollspy (desktop rail) ───────────────────────────────────────────────
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
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ["work", "experience", "skills", "education", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  // ── Scroll reveals ─────────────────────────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("revealed"));
  }

  // ── Footer year ────────────────────────────────────────────────────────────
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
