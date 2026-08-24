(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (prefersReduced) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function initFloaters() {
    const container = document.querySelector(".floaters");
    if (!container || prefersReduced) return;
    const count = window.innerWidth < 720 ? 5 : 10;
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.style.left = Math.random() * 100 + "%";
      span.style.top = Math.random() * 100 + "%";
      span.style.animationDelay = Math.random() * 6 + "s";
      span.style.animationDuration = 7 + Math.random() * 5 + "s";
      span.style.opacity = String(0.25 + Math.random() * 0.4);
      container.appendChild(span);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initFloaters();
  });
})();
