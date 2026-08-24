# CodeWithoutBorders — Portfolio Website

A complete, responsive, animated portfolio website for a web design &amp;
development brand. Built as plain **HTML, CSS and JavaScript** — no build
step, no framework install, works anywhere a static site can be hosted
(Vercel, Netlify, GitHub Pages, or any web host).

## Why a static site, and what "backend" means here

The brief asked for backend functionality (contact form handling, a
portfolio "database", admin management, payment verification). Real
server-side code needs a server with a database and secret environment
variables — something that has to run on infrastructure you choose
(Vercel, Render, your own host, etc.), not inside a set of static files.

So this build gives you the **full frontend**, wired up to a clean,
swappable "backend layer":

- **Portfolio data** lives in [`data/projects.json`](data/projects.json) —
  edit that one file to add, edit or remove projects. No code changes
  needed. (This is the "database" — see "Going further" below for how to
  upgrade it to a real one.)
- **Contact form** is fully validated in the browser and ready to submit
  to any endpoint you configure in `js/config.js` — see **Connecting the
  contact form** below for two ready options.
- **Payments** page shows public payment identifiers/links only (never a
  secret key) and is explicit that a payment is only confirmed once it's
  verified server-side — see **Payments** below.

Nothing fake is wired up: every phone number, WhatsApp number, email,
and payment ID is a clearly marked `REPLACE_ME` placeholder until you
add the real value in **`js/config.js`**.

## Project structure

```
site/
├── index.html          Home
├── about.html
├── services.html
├── portfolio.html       Filterable project grid
├── project.html         Project detail (reads ?slug=...)
├── payments.html
├── contact.html
├── privacy.html
├── terms.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/styles.css       All styling and design tokens
├── js/
│   ├── config.js         ← EDIT THIS: your real contact/payment info
│   ├── components.js      Navbar + footer + WhatsApp button (shared)
│   ├── main.js             Scroll-reveal + hero animation
│   ├── portfolio.js        Portfolio filtering/rendering
│   ├── project-detail.js   Single project page
│   ├── payments.js         Payment cards + copy buttons
│   └── contact.js          Form validation + submission
├── data/projects.json   ← EDIT THIS: your real projects
└── assets/               Images (placeholder SVG included)
```

## 1. Run it locally

Because the portfolio and project pages load `data/projects.json` with
`fetch()`, opening `index.html` directly from disk (`file://…`) will
**block that request** in most browsers. Serve the folder instead:

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```

(Any static server works — `npx serve`, VS Code's "Live Server", etc.)

## 2. Add your real information (one file)

Open **`js/config.js`** and replace every `REPLACE_ME_…` value:

- `whatsappNumber` — digits only with country code, e.g. `"919876543210"`
- `phoneNumber` — with `+`, e.g. `"+919876543210"`
- `contactEmail`
- `instagramUsername` (already set to `codewithborders`)
- `payments.*` — set the real ID/link for each method you accept, and
  flip its `enabled` flag to `true`. Leave `enabled: false` for any
  method you don't offer — its card will show as "Not set up" instead
  of a broken link.

None of these are secret values — they're public identifiers, safe to
ship in frontend code. **Never** put a private API key (e.g. a Razorpay
*key secret*, a database password) in this file.

## 3. Add your real projects

Edit **`data/projects.json`**. Each project is one object:

```json
{
  "id": 4,
  "slug": "my-project",
  "title": "My Project",
  "category": "Web Development",
  "description": "One sentence for the card.",
  "details": "A longer paragraph for the detail page.",
  "image": "assets/my-project.png",
  "technologies": ["React", "Tailwind CSS"],
  "liveUrl": "https://example.com",
  "githubUrl": "",
  "featured": true,
  "createdAt": "2026-08-01"
}
```

Drop real screenshots into `assets/` and point `image` at them. The
`category` field drives the filter buttons on the Portfolio page
automatically — add a new category by just using it on a project.

## 4. Connecting the contact form

The form validates fully client-side already (required fields, email
format, phone format, minimum message length, loading/success/error
states). To actually receive submissions, pick one:

**Option A — Formspree (fastest, no backend to run)**
1. Create a free form at [formspree.io](https://formspree.io).
2. Set `contactFormEndpoint` in `js/config.js` to your form URL.
Done — submissions arrive by email.

**Option B — your own backend**
Point `contactFormEndpoint` at any API route that accepts a JSON POST
of `{ name, email, phone, message }` and returns a 2xx status. If you
add a Next.js/Node backend later, this is where its `/api/contact`
route plugs in — the frontend code doesn't need to change.

Until you set `contactFormEndpoint`, the form runs in **demo mode**: it
validates and shows a success message, but doesn't send anywhere. This
is intentional — see the message it displays.

## 5. Payments

Cards only ever show a public ID or payment **link** — a UPI ID, a
PayPal.me handle, a Razorpay *Payment Link* URL. That's safe to expose.

What this page deliberately does **not** do: claim a payment succeeded
based on the browser alone. If you wire up Razorpay's checkout, verify
the payment server-side (Razorpay webhook or order-status API) before
treating it as paid — that verification has to live in a backend, since
frontend code can always be spoofed.

## 6. Deploying

Any static host works. Two common options:

- **Vercel / Netlify**: drag-and-drop the `site/` folder, or connect the
  git repo — both auto-detect a static site, no config needed.
- **GitHub Pages**: push `site/`'s contents to a repo and enable Pages
  on the `main` branch.

After deploying, update the `REPLACE_ME_DOMAIN.com` placeholders in each
page's `<link rel="canonical">`/`og:url` tags, `robots.txt` and
`sitemap.xml` to your real domain.

## Going further (optional upgrades)

- **Real database**: replace `data/projects.json` with calls to a
  headless CMS (Sanity, Contentful) or a small database-backed API —
  the `Projects` shape (id, title, slug, description, image, category,
  technologies, liveUrl, githubUrl, featured, createdAt) is already
  designed to map onto a `projects` table/collection directly.
- **Admin dashboard**: once there's a real backend, add authenticated
  create/edit/delete routes for projects and gate them behind login —
  never ship admin write access in a static frontend, since there's no
  server there to check permissions.
- **Framework migration**: if you want React/Next.js specifically (for
  server rendering, an API layer, etc.), this HTML/CSS/JS structure
  maps cleanly onto components — `components.js` → a `<Navbar>`/
  `<Footer>`, each page → a route, `projects.json` → a data-fetching
  function.

## What was tested

- All navigation links (desktop + mobile menu) point to real pages.
- Portfolio filters, empty-state message, and project detail linking.
- Contact form: empty submit, invalid email, short message, valid
  submit (demo mode), all show the correct message.
- Payment copy buttons (clipboard, with a manual-copy fallback message).
- WhatsApp/phone/Instagram links resolve to `#` with a visible "add your
  number" label until configured, so nothing looks broken pre-launch.
- Responsive layout at 320/375/390/414/768/1024/1280/1440/1920px widths.
- `prefers-reduced-motion` disables hero entrance animation, floating
  particles and scroll-reveal (content shows immediately instead).
- Keyboard navigation and visible focus states on all interactive
  elements; skip-to-content link on every page.
- Custom 404 page for any dead link.
