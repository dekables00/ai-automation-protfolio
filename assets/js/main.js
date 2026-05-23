const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const siteHeader = document.querySelector(".site-header");
const initialHash = window.location.hash;
const initialSection = new URLSearchParams(window.location.search).get("section");

const THEME_STORAGE_KEY = "agent-dex-theme-v2";

function setTheme(theme) {
  const isLight = theme === "light";

  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (themeToggle && themeLabel) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
    themeLabel.textContent = isLight ? "Dark" : "Light";
  }
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

setTheme(getInitialTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(currentTheme === "light" ? "dark" : "light");
  });
}

function closeMenu() {
  if (navToggle && navLinks) {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
}

let lastScrollY = window.pageYOffset;
let tickingHeader = false;
let scrollAnimationFrame = null;

function updateHeaderVisibility() {
  if (!(siteHeader instanceof HTMLElement)) {
    return;
  }

  const currentScrollY = window.pageYOffset;
  const isMenuOpen = navLinks?.classList.contains("is-open");
  const scrollingDown = currentScrollY > lastScrollY;

  if (currentScrollY < 120 || isMenuOpen) {
    siteHeader.classList.remove("is-hidden");
  } else if (scrollingDown && currentScrollY - lastScrollY > 4) {
    siteHeader.classList.add("is-hidden");
  } else if (!scrollingDown && lastScrollY - currentScrollY > 4) {
    siteHeader.classList.remove("is-hidden");
  }

  lastScrollY = Math.max(0, currentScrollY);
  tickingHeader = false;
}

window.addEventListener("scroll", () => {
  if (!tickingHeader) {
    requestAnimationFrame(updateHeaderVisibility);
    tickingHeader = true;
  }
}, { passive: true });

function animateScrollTo(targetTop) {
  if (scrollAnimationFrame) {
    cancelAnimationFrame(scrollAnimationFrame);
  }

  const startTop = window.pageYOffset;
  const distance = targetTop - startTop;
  const duration = Math.min(820, Math.max(420, Math.abs(distance) * 0.42));
  const startTime = performance.now();

  function easeOutCubic(progress) {
    return 1 - Math.pow(1 - progress, 3);
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startTop + distance * easeOutCubic(progress));

    if (progress < 1) {
      scrollAnimationFrame = requestAnimationFrame(step);
    } else {
      scrollAnimationFrame = null;
    }
  }

  step(startTime);
}

function cleanHashFromUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("section");

  if (window.location.href !== url.href) {
    history.replaceState(null, "", url.pathname + url.search);
  }
}

function getSectionTop(targetId) {
  const target = document.querySelector(targetId);

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const header = document.querySelector(".site-header");
  const headerOffset = targetId === "#top" ? 0 : header instanceof HTMLElement ? header.offsetHeight + 28 : 108;
  return targetId === "#top" ? 0 : target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
}

function scrollToSection(anchor) {
  const targetId = anchor.getAttribute("href");

  if (!targetId || !targetId.startsWith("#") || targetId === "#") {
    return false;
  }

  const target = document.querySelector(targetId);

  if (!(target instanceof HTMLElement)) {
    return false;
  }

  closeMenu();
  siteHeader?.classList.remove("is-hidden");

  const targetTop = getSectionTop(targetId);

  if (targetTop === null) {
    return false;
  }

  animateScrollTo(Math.max(0, targetTop));
  cleanHashFromUrl();
  return true;
}

document.addEventListener("click", (event) => {
  const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;

  if (anchor instanceof HTMLAnchorElement && scrollToSection(anchor)) {
    event.preventDefault();
  }
}, true);

cleanHashFromUrl();
window.addEventListener("load", () => {
  window.setTimeout(() => {
    const initialTargetId = initialHash || (initialSection ? `#${initialSection}` : "");
    const targetTop = initialTargetId ? getSectionTop(initialTargetId) : null;

    if (targetTop !== null) {
      window.scrollTo(0, Math.max(0, targetTop));
    }

    cleanHashFromUrl();
  }, 0);
});

if (navToggle && navLinks) {
  // Keep the mobile menu state reflected in aria-expanded for accessibility.
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    siteHeader?.classList.remove("is-hidden");
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
