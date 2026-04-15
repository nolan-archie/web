const menuButton = document.getElementById("menu");
const closeButton = document.getElementById("close-mobile");
const mobileNav = document.getElementById("nav-mobile");
const navLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const finishClosingMenu = () => {
  if (mobileNav && !mobileNav.classList.contains("is-open")) {
    mobileNav.hidden = true;
  }
};

const openMenu = () => {
  if (!mobileNav) {
    return;
  }

  mobileNav.hidden = false;
  requestAnimationFrame(() => {
    mobileNav.classList.add("is-open");
  });
  menuButton?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
};

const closeMenu = () => {
  if (!mobileNav) {
    return;
  }

  mobileNav.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  if (prefersReducedMotion) {
    finishClosingMenu();
    return;
  }

  window.setTimeout(finishClosingMenu, 320);
};

menuButton?.addEventListener("click", openMenu);
closeButton?.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

mobileNav?.addEventListener("click", (event) => {
  if (event.target === mobileNav) {
    closeMenu();
  }
});

mobileNav?.addEventListener("transitionend", (event) => {
  if (event.target === mobileNav && !mobileNav.classList.contains("is-open")) {
    finishClosingMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav && !mobileNav.hidden) {
    closeMenu();
  }
});

revealItems.forEach((item) => {
  const delay = item.getAttribute("data-delay");

  if (delay) {
    item.style.setProperty("--reveal-delay", `${delay}ms`);
  }
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}
