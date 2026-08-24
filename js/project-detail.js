(function () {
  const mount = document.getElementById("projectDetail");
  if (!mount) return;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function notFound() {
    mount.innerHTML = `
      <div class="empty-state">
        <h2 style="font-family:var(--font-display); color:var(--text); font-size:22px; margin-bottom:10px;">Project not found</h2>
        <p>We couldn't find a project with that link. It may have been renamed or removed.</p>
        <a href="portfolio.html" class="btn btn-primary" style="margin-top:20px;">Back to Portfolio</a>
      </div>`;
    document.title = "Project not found — " + (window.SITE_CONFIG?.brand?.name || "");
  }

  async function init() {
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) return notFound();

    let projects = [];
    try {
      const res = await fetch("data/projects.json");
      if (!res.ok) throw new Error();
      projects = await res.json();
    } catch {
      mount.innerHTML = `<div class="empty-state">Couldn't load project data. If you're opening this file directly from disk, run it through a local server instead (see README.md).</div>`;
      return;
    }

    const project = projects.find((p) => p.slug === slug);
    if (!project) return notFound();

    document.title = `${project.title} — ${SITE_CONFIG.brand.name}`;

    const techBadges = (project.technologies || [])
      .map((t) => `<span class="tech-badge"><span class="dot"></span>${escapeHtml(t)}</span>`)
      .join("");

    const liveBtn = project.liveUrl
      ? `<a class="btn btn-primary" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Visit Live Site</a>`
      : `<span class="btn btn-secondary" aria-disabled="true" style="opacity:.5; pointer-events:none;">Live link coming soon</span>`;

    const githubBtn = project.githubUrl
      ? `<a class="btn btn-secondary" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">View Source</a>`
      : "";

    mount.innerHTML = `
      <div class="breadcrumb"><a href="portfolio.html">Portfolio</a> / ${escapeHtml(project.title)}</div>
      <span class="eyebrow">${escapeHtml(project.category)}</span>
      <h1 style="font-size:clamp(30px,5vw,48px); margin-bottom:18px;">${escapeHtml(project.title)}</h1>
      <div class="thumb" style="border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border); margin-bottom:36px;">
        <img src="${project.image}" alt="Screenshot of ${escapeHtml(project.title)}" onerror="this.src='assets/placeholder-project.svg'" style="width:100%; display:block;"/>
      </div>
      <div class="grid" style="grid-template-columns: 2fr 1fr; gap:48px;" id="detailGrid">
        <div>
          <h2 style="font-size:22px; margin-bottom:14px;">Overview</h2>
          <p style="color:var(--text-muted); font-size:16px; line-height:1.7;">${escapeHtml(project.description)}</p>
          <p style="color:var(--text-muted); font-size:16px; line-height:1.7; margin-top:14px;">${escapeHtml(project.details || "")}</p>
        </div>
        <div>
          <h2 style="font-size:16px; margin-bottom:14px; color:var(--text-faint); text-transform:uppercase; letter-spacing:.06em;">Technologies</h2>
          <div class="tech-badges">${techBadges}</div>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:28px;">
            ${liveBtn}
            ${githubBtn}
          </div>
        </div>
      </div>`;

    const style = document.createElement("style");
    style.textContent = "@media (max-width:820px){ #detailGrid{ grid-template-columns: 1fr !important; } }";
    document.head.appendChild(style);
  }

  init();
})();
