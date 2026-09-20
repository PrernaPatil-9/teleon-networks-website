# Teleon Networks Pvt Ltd — Corporate Website

Frontend-only corporate website for Teleon Networks Pvt Ltd (IT &amp; Infrastructure Solutions).
Built with HTML5, Tailwind CSS (CDN) and vanilla JavaScript. No frameworks, no backend, no database.

## Running the site

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

The header and footer are loaded at runtime with `fetch()`. Browsers block `fetch()` on
`file://` URLs, so `js/components.js` also carries an inlined copy of both components as an
offline fallback — the site therefore works either way. Use a local server during development
so the real component files are the ones being loaded.

## Structure

```
teleon-networks/
├── index.html                  Home
├── pages/
│   ├── about.html              About Us
│   ├── services.html           All 8 services
│   ├── contact.html            Enquiry form
│   └── services/               8 service detail pages
├── components/
│   ├── header.html             Shared header (logo, nav, services dropdown, mobile menu)
│   └── footer.html             Shared footer
├── css/style.css               Design tokens and all component styles
├── js/
│   ├── components.js           Loads header/footer, resolves relative paths
│   ├── navigation.js           Dropdown, hamburger, submenu, active states
│   └── main.js                 Scroll reveal, header state, back-to-top, form validation
├── assets/
│   ├── images/teleon-logo.jpeg
│   └── icons/                  (icons are inline SVG in the markup)
└── tools/build-components.py   Regenerates components.js (see below)
```

## Editing the header or footer

`components/header.html` and `components/footer.html` are the single source of truth.
After editing either one, regenerate the offline fallback:

```bash
python3 tools/build-components.py
```

This rewrites `js/components.js` from `js/components.template.js` with the new markup inlined.
Do not hand-edit the fallback strings inside `js/components.js`.

### Path handling

Components use a `{{base}}` token in every URL. `js/components.js` works out how deep the
current page sits (root, `pages/`, or `pages/services/`) and replaces the token with ``,
`../` or `../../`. Each page also declares its own depth via `<body data-base="...">`, which
takes precedence, so the pages work from any hosting path.

## Adding contact details

Contact information was not supplied, so placeholders are used in two places:

- `components/footer.html` — phone, email and office rows
- `pages/contact.html` — the contact details panel

Replace the placeholder text with the real values. The enquiry form is frontend-only: it
validates input and shows a success state, but nothing is transmitted and no email is sent.
Connect it to an email service or backend endpoint to receive enquiries.

## Content source

All company and service content comes from the eight supplied Teleon Networks service PDFs
and the supplied logo. No history, founders, clients, statistics, years of experience,
certifications, awards, locations, testimonials, pricing or contact details have been invented.

## Browser notes

- Tailwind CSS is loaded from the CDN for utility classes; `css/style.css` carries the full
  design system, so the site still renders correctly if the CDN is unavailable.
- Fonts (Manrope, Inter) load from Google Fonts with system fallbacks.
- `prefers-reduced-motion` is respected throughout.
