/* Injects the navbar, mobile menu, footer and floating WhatsApp button
   into every page from a single source, so editing one file updates
   the whole site. Each page sets `<body data-page="home">` etc. so the
   correct nav link gets the "active" state. */

(function () {
  const NAV_LINKS = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About", key: "about" },
    { href: "services.html", label: "Services", key: "services" },
    { href: "portfolio.html", label: "Portfolio", key: "portfolio" },
    { href: "payments.html", label: "Payments", key: "payments" },
    { href: "contact.html", label: "Contact", key: "contact" },
  ];

  function icon(name) {
    const icons = {
      whatsapp:
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06a8.1 8.1 0 0 1-4.14-1.13l-.3-.17-3.1.81.83-3.02-.19-.31a8.13 8.13 0 0 1-1.25-4.33c0-4.5 3.66-8.16 8.16-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.15-8.17 8.15Zm4.48-6.11c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14-.01-.3-.01-.47-.01-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34 1 2.5.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"/></svg>',
      mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/></svg>',
      phone:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.2a2 2 0 0 1 2.11-.45c.85.3 1.73.51 2.63.63A2 2 0 0 1 22 16.92Z"/></svg>',
      instagram:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    };
    return icons[name] || "";
  }

  function waNumber() {
    const n = SITE_CONFIG.whatsappNumber || "";
    return /^\d{6,15}$/.test(n) ? n : null;
  }
  function waLink(prefill) {
    const n = waNumber();
    if (!n) return null;
    const text = encodeURIComponent(prefill || "Hi! I found your site and I'd like to talk about a project.");
    return `https://wa.me/${n}?text=${text}`;
  }
  function telLink() {
    const p = SITE_CONFIG.phoneNumber || "";
    return p && !p.startsWith("REPLACE_ME") ? `tel:${p.replace(/\s+/g, "")}` : null;
  }
  function igLink() {
    return `https://www.instagram.com/${SITE_CONFIG.instagramUsername}/`;
  }

  function renderNavbar(activeKey) {
    const links = NAV_LINKS.map(
      (l) => `<a href="${l.href}" class="${l.key === activeKey ? "active" : ""}">${l.label}</a>`
    ).join("");

    return `
    <header class="navbar" id="navbar">
      <div class="container">
        <a href="index.html" class="brand">
          <span class="mark">&lt;/&gt;</span>
          ${SITE_CONFIG.brand.name}
        </a>
        <nav class="nav-links" aria-label="Primary">
          ${links}
        </nav>
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="contact.html" class="btn btn-primary nav-cta">Contact Me</a>
          <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path id="navIconPath" d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    </header>
    <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile">
      ${links}
      <a href="contact.html" class="btn btn-primary">Contact Me</a>
    </nav>`;
  }

  function renderFooter() {
    const wa = waLink();
    const tel = telLink();
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="brand"><span class="mark">&lt;/&gt;</span>${SITE_CONFIG.brand.name}</a>
            <p style="color:var(--text-muted); font-size:14.5px; margin-top:16px; max-width:320px;">${SITE_CONFIG.brand.description}</p>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul>
              ${NAV_LINKS.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="services.html">Web Design</a></li>
              <li><a href="services.html">Web Development</a></li>
              <li><a href="services.html">UI/UX Design</a></li>
              <li><a href="services.html">Website Optimization</a></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li><a href="${igLink()}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              ${wa ? `<li><a href="${wa}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>` : `<li><span style="color:var(--text-faint);">WhatsApp (add number)</span></li>`}
              ${tel ? `<li><a href="${tel}">${SITE_CONFIG.phoneNumber}</a></li>` : `<li><span style="color:var(--text-faint);">Phone (add number)</span></li>`}
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${SITE_CONFIG.brand.name}. All rights reserved.</span>
          <span>
            <a href="privacy.html" style="color:var(--text-faint);">Privacy Policy</a>
            &nbsp;·&nbsp;
            <a href="terms.html" style="color:var(--text-faint);">Terms</a>
          </span>
        </div>
      </div>
    </footer>`;
  }

  function renderFloatingWhatsApp() {
    const wa = waLink();
    if (!wa) return "";
    return `<a class="floating-wa" href="${wa}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${icon("whatsapp")}</a>`;
  }

  function mount() {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    const waSlot = document.getElementById("site-whatsapp");
    const activeKey = document.body.getAttribute("data-page") || "";

    if (header) header.innerHTML = renderNavbar(activeKey);
    if (footer) footer.innerHTML = renderFooter();
    if (waSlot) waSlot.innerHTML = renderFloatingWhatsApp();

    // Mobile menu toggle
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
      });
      menu.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        })
      );
    }

    // Navbar scroll effect
    const nav = document.getElementById("navbar");
    if (nav) {
      const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  window.SiteChrome = { mount, waLink, telLink, igLink, icon };
  document.addEventListener("DOMContentLoaded", mount);
})();
