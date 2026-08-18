/* =========================================================
   NOVA — interactions
   Everything is progressive: if JS fails, the page still reads
   correctly (reveal elements are un-hidden in the fallback below).
   ========================================================= */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. NAV — stays pinned at all times; only its surface changes.
     Content scrolls underneath and is frosted by the backdrop blur,
     so the pill must never be hidden or translated away.
     --------------------------------------------------------- */
  const nav = document.getElementById("nav");

  function onScroll() {
    const y = window.scrollY;

    nav.classList.toggle("is-scrolled", y > 20);
    toTop.classList.toggle("is-visible", y > 600);
  }

  /* ---------------------------------------------------------
     2. MOBILE MENU
     --------------------------------------------------------- */
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("mobileMenu");

  function openMenu() {
    menu.hidden = false;

    void menu.offsetHeight;
    menu.classList.add("is-open");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    document.body.classList.add("is-locked");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("is-locked");


    const done = () => { menu.hidden = true; };
    if (prefersReducedMotion) done();
    else setTimeout(done, 280);
  }

  burger.addEventListener("click", function () {
    burger.classList.contains("is-open") ? closeMenu() : openMenu();
  });


  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && burger.classList.contains("is-open")) {
      closeMenu();
      burger.focus();
    }
  });


  document.addEventListener("click", function (e) {
    if (!burger.classList.contains("is-open")) return;
    if (menu.contains(e.target) || burger.contains(e.target)) return;
    closeMenu();
  });


  window.matchMedia("(min-width: 861px)").addEventListener("change", function (e) {
    if (e.matches && burger.classList.contains("is-open")) closeMenu();
  });

  /* ---------------------------------------------------------
     3. SCROLL REVEAL
     Elements fade/slide in once, then stop being observed.
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");


  revealEls.forEach(function (el) {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
  });

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, {

      rootMargin: "0px 0px -12% 0px",
      threshold: 0.05
    });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {

    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     4. HERO CHART — bars grow when the mockup first appears
     --------------------------------------------------------- */
  const chart = document.getElementById("chart");

  if (chart) {
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      chart.classList.add("is-playing");
    } else {
      const chartObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          setTimeout(function () { chart.classList.add("is-playing"); }, 220);
          obs.disconnect();
        });
      }, { threshold: 0.3 });

      chartObserver.observe(chart);
    }
  }

  /* ---------------------------------------------------------
     5. FAQ ACCORDION
     max-height is animated from 0 to the panel's measured height —
     `auto` isn't animatable, so the value is read at open time.
     --------------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq__item");

  function closeItem(item) {
    const btn = item.querySelector(".faq__q");
    const panel = item.querySelector(".faq__a");
    item.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = null;
  }

  faqItems.forEach(function (item) {
    const btn = item.querySelector(".faq__q");
    const panel = item.querySelector(".faq__a");

    btn.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");


      faqItems.forEach(function (other) {
        if (other !== item) closeItem(other);
      });

      if (isOpen) {
        closeItem(item);
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });


    window.addEventListener("resize", function () {
      if (item.classList.contains("is-open")) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------
     6. BACK TO TOP
     --------------------------------------------------------- */
  const toTop = document.getElementById("toTop");

  toTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });

  /* ---------------------------------------------------------
     7. SCROLL LISTENER
     Throttled with rAF so the handler runs at most once a frame.
     --------------------------------------------------------- */
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  onScroll();
})();