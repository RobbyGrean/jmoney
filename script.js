const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");
const pageLinks = document.querySelectorAll('a[href="./guide.html"], a[href="./index.html"]');

menuToggle?.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden", isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealTargets = document.querySelectorAll(
  ".hero-panel, .cta-card, .panel-card, .metric-card, .idea-card, .ai-step, .section-head"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.transitionDelay = `${Math.min(index * 60, 320)}ms`;
  observer.observe(target);
});

const transitionOverlay = document.createElement("div");
transitionOverlay.className = "page-transition-overlay";
document.body.appendChild(transitionOverlay);

requestAnimationFrame(() => {
  document.body.classList.add("page-ready");
});

let isNavigating = false;

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || isNavigating) {
      return;
    }

    event.preventDefault();
    isNavigating = true;
    transitionOverlay.classList.add("is-active");
    document.body.classList.add("page-leaving");

    window.setTimeout(() => {
      window.location.href = href;
    }, 320);
  });
});
