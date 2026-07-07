// Theme, menu, scrollspy, reveals, smooth scroll, progress bar, stat count-up.

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
        lenis.scrollTo(target, { offset: -80 });
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
      if (label) label.textContent = dark ? "Switch to light mode" : "Switch to dark mode";
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

  // ── Scroll progress hairline ───────────────────────────────────────────────
  const progress = document.getElementById("progress");
  if (progress) {
    let ticking = false;
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(paint);
        }
      },
      { passive: true }
    );
    paint();
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
    ["journey", "work", "github", "experience", "skills", "contact"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) spy.observe(el);
      }
    );
  }

  // ── Scroll reveals (.reveal fade-rise; nested .wipe follows via CSS) ───────
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

  // ── Stat count-up ──────────────────────────────────────────────────────────
  // Final values live in the HTML (no-JS and reduced-motion users see them
  // untouched); with motion allowed, animate 0 → value on first view.
  const stats = document.querySelectorAll(".stat-num[data-count]");
  if (stats.length && !reducedMotion && "IntersectionObserver" in window) {
    const fmt = (n, suffix) => n.toLocaleString("en-US") + (suffix || "");
    const runCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      if (!Number.isFinite(target)) return;
      const t0 = performance.now();
      const dur = 900;
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased), suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach((el) => io.observe(el));
  }

  // ── Footer year ────────────────────────────────────────────────────────────
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
