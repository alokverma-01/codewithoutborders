(function () {
  const grid = document.getElementById("projectGrid");
  const filterBar = document.getElementById("filterBar");
  if (!grid) return;

  let allProjects = [];
  let activeFilter = "All";

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function cardTemplate(p) {
    const tags = (p.technologies || [])
      .slice(0, 4)
      .map((t) => `<span>${escapeHtml(t)}</span>`)
      .join("");
    return `
    <a class="project-card reveal" href="project.html?slug=${encodeURIComponent(p.slug)}" data-category="${escapeHtml(p.category)}">
      <div class="thumb">
        <img src="${p.image}" alt="Screenshot of the ${escapeHtml(p.title)} project" loading="lazy" onerror="this.src='assets/placeholder-project.svg'"/>
      </div>
      <div class="body">
        <span class="cat">${escapeHtml(p.category)}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="tags">${tags}</div>
      </div>
    </a>`;
  }

  function renderFilters(categories) {
    if (!filterBar) return;
    const cats = ["All", ...categories];
    filterBar.innerHTML = cats
      .map(
        (c) =>
          `<button class="filter-btn ${c === activeFilter ? "active" : ""}" data-cat="${escapeHtml(c)}" aria-pressed="${c === activeFilter}">${escapeHtml(c)}</button>`
      )
      .join("");

    filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-cat");
        filterBar.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const filtered =
      activeFilter === "All" ? allProjects : allProjects.filter((p) => p.category === activeFilter);

    if (!filtered.length) {
      grid.innerHTML = `<div class="empty-state">No projects in this category yet. Check back soon, or explore another filter.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(cardTemplate).join("");

    // Re-run reveal animation for freshly injected cards
    const items = grid.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      { threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));
  }

  async function loadProjects() {
    grid.innerHTML = `<div class="empty-state">Loading projects…</div>`;
    try {
      const res = await fetch("data/projects.json");
      if (!res.ok) throw new Error("Failed to load projects.json");
      allProjects = await res.json();
    } catch (err) {
      grid.innerHTML = `<div class="empty-state">Couldn't load the portfolio data right now. If you're opening this file directly from disk, run it through a local server instead (see README.md) — browsers block JSON loading from file:// URLs.</div>`;
      return;
    }
    const categories = [...new Set(allProjects.map((p) => p.category))];
    renderFilters(categories);
    renderGrid();
  }

  loadProjects();
})();
