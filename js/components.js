/* ==========================================================================
   Teleon Networks — components.js
   Loads the shared header and footer into every page and resolves relative
   paths so the same markup works from the site root, /pages/ and
   /pages/services/.

   Responsibilities: fetching and injecting components only.
   Navigation behaviour lives in navigation.js; page behaviour in main.js.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Base path
     Works out how many directory levels the current page sits below the
     project root, so {{base}} can be replaced with '', '../' or '../../'.
     ------------------------------------------------------------------ */
  function getBasePath() {
    var path = window.location.pathname;

    // Allow a page to state its own depth: <body data-base="../">
    var declared = document.body && document.body.getAttribute('data-base');
    if (declared !== null && declared !== undefined) return declared;

    if (/\/pages\/services\/[^/]*$/.test(path)) return '../../';
    if (/\/pages\/[^/]*$/.test(path)) return '../';
    return '';
  }

  var BASE = getBasePath();

  /* ------------------------------------------------------------------
     Offline fallback markup
     Browsers block fetch() on the file:// protocol, so the site would show
     no header or footer when the HTML files are opened by double-clicking.
     These strings are generated from components/header.html and
     components/footer.html by tools/build-components.py — edit those files,
     then re-run the script. Do not hand-edit the strings below.
     ------------------------------------------------------------------ */
  var FALLBACK = {
    header: `<!--
  Teleon Networks — shared site header.
  {{base}} is replaced at runtime by js/components.js with the correct
  relative path prefix for the page that is loading this file.
-->
<header class="site-header" id="siteHeader">
  <div class="header-bar">

    <a class="brand" href="{{base}}index.html" aria-label="Teleon Networks Pvt Ltd — home">
      <img src="{{base}}assets/images/teleon-logo.jpeg"
           alt="Teleon Networks Pvt Ltd logo"
           width="190" height="44">
    </a>

    <!-- Desktop navigation -->
    <nav class="nav-desktop" aria-label="Main navigation">
      <a class="nav-link" href="{{base}}index.html" data-nav="home">Home</a>
      <a class="nav-link" href="{{base}}pages/about.html" data-nav="about">About Us</a>

      <div class="nav-item" data-dropdown>
        <button type="button"
                class="nav-link"
                id="servicesTrigger"
                data-dropdown-trigger
                aria-expanded="false"
                aria-controls="servicesDropdown"
                data-nav="services">
          Services
          <svg class="nav-caret" width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
               stroke-linejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </button>

        <div class="dropdown" id="servicesDropdown" role="menu" aria-labelledby="servicesTrigger">
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/cloud-services.html">
            <span class="dropdown__num">01</span>
            <span>
              <span class="dropdown__title">Cloud Services</span>
              <span class="dropdown__desc">Backup, storage, cloud server, email and migration</span>
            </span>
          </a>
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/it-infrastructure-management.html">
            <span class="dropdown__num">02</span>
            <span>
              <span class="dropdown__title">IT Infrastructure Management</span>
              <span class="dropdown__desc">Monitoring, maintenance, security and support</span>
            </span>
          </a>
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/network-solutions.html">
            <span class="dropdown__num">03</span>
            <span>
              <span class="dropdown__title">Network Solutions</span>
              <span class="dropdown__desc">LAN/WAN, Wi-Fi, router, switch and firewall</span>
            </span>
          </a>
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/cyber-security.html">
            <span class="dropdown__num">04</span>
            <span>
              <span class="dropdown__title">Cyber Security Services</span>
              <span class="dropdown__desc">Endpoint, network, identity and email security</span>
            </span>
          </a>
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/internet-management.html">
            <span class="dropdown__num">05</span>
            <span>
              <span class="dropdown__title">Internet Management &amp; Monitoring</span>
              <span class="dropdown__desc">Leased line, WAN and bandwidth monitoring</span>
            </span>
          </a>
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/it-procurement.html">
            <span class="dropdown__num">06</span>
            <span>
              <span class="dropdown__title">IT Procurement &amp; Hardware Supply</span>
              <span class="dropdown__desc">Requirement analysis, BOQ, supply and delivery</span>
            </span>
          </a>
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/it-support-amc.html">
            <span class="dropdown__num">07</span>
            <span>
              <span class="dropdown__title">IT Support &amp; AMC Services</span>
              <span class="dropdown__desc">Remote and on-site support with AMC</span>
            </span>
          </a>
          <a class="dropdown__link" role="menuitem" href="{{base}}pages/services/project-implementation.html">
            <span class="dropdown__num">08</span>
            <span>
              <span class="dropdown__title">Project Implementation Services</span>
              <span class="dropdown__desc">Survey, installation, testing and handover</span>
            </span>
          </a>
        </div>
      </div>

      <a class="nav-link" href="{{base}}pages/services.html" data-nav="services-all">All Services</a>
      <a class="nav-link" href="{{base}}pages/contact.html" data-nav="contact">Contact Us</a>
    </nav>

    <div class="nav-actions">
      <a class="btn btn--primary" href="{{base}}pages/contact.html">Get in touch</a>
    </div>

    <!-- Mobile hamburger -->
    <button type="button"
            class="nav-toggle"
            id="navToggle"
            aria-expanded="false"
            aria-controls="mobileNav"
            aria-label="Open navigation menu">
      <span></span><span></span><span></span>
    </button>
  </div>

  <!-- Mobile navigation panel -->
  <nav class="nav-mobile" id="mobileNav" aria-label="Mobile navigation">
    <a class="nav-mobile__link" href="{{base}}index.html" data-nav="home">Home</a>
    <a class="nav-mobile__link" href="{{base}}pages/about.html" data-nav="about">About Us</a>

    <button type="button"
            class="nav-mobile__toggle"
            id="mobileServicesToggle"
            aria-expanded="false"
            aria-controls="mobileServicesPanel">
      Services
      <svg class="nav-caret" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
           stroke-linejoin="round" aria-hidden="true">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    </button>

    <div class="nav-mobile__panel" id="mobileServicesPanel">
      <a class="nav-mobile__sublink" href="{{base}}pages/services.html">All Services</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/cloud-services.html">Cloud Services</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/it-infrastructure-management.html">IT Infrastructure Management</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/network-solutions.html">Network Solutions</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/cyber-security.html">Cyber Security Services</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/internet-management.html">Internet Management &amp; Monitoring</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/it-procurement.html">IT Procurement &amp; Hardware Supply</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/it-support-amc.html">IT Support &amp; AMC Services</a>
      <a class="nav-mobile__sublink" href="{{base}}pages/services/project-implementation.html">Project Implementation Services</a>
    </div>

    <a class="nav-mobile__link" href="{{base}}pages/contact.html" data-nav="contact">Contact Us</a>

    <div class="nav-mobile__cta">
      <a class="btn btn--primary btn--block" href="{{base}}pages/contact.html">Get in touch</a>
    </div>
  </nav>
</header>`,
    footer: `<!--
  Teleon Networks — shared site footer.
  {{base}} is replaced at runtime by js/components.js.
  Contact values are placeholders only — no contact details were supplied.
-->
<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">

      <div class="footer-brand">
        <img src="{{base}}assets/images/teleon-logo.jpeg"
             alt="Teleon Networks Pvt Ltd logo"
             width="210" height="46">
        <p>
          Teleon Networks Pvt Ltd provides IT &amp; Infrastructure Solutions — managing and supporting
          business IT through proactive monitoring, maintenance, troubleshooting, security, backup and
          on-site or remote support.
        </p>
        <p class="footer-tagline">WE MANAGE IT. YOU GROW IT.</p>
      </div>

      <div>
        <h2 class="footer-title">Company</h2>
        <ul class="footer-list">
          <li><a href="{{base}}index.html">Home</a></li>
          <li><a href="{{base}}pages/about.html">About Us</a></li>
          <li><a href="{{base}}pages/services.html">Services</a></li>
          <li><a href="{{base}}pages/contact.html">Contact Us</a></li>
        </ul>
      </div>

      <div>
        <h2 class="footer-title">Services</h2>
        <ul class="footer-list">
          <li><a href="{{base}}pages/services/cloud-services.html">Cloud Services</a></li>
          <li><a href="{{base}}pages/services/it-infrastructure-management.html">IT Infrastructure Management</a></li>
          <li><a href="{{base}}pages/services/network-solutions.html">Network Solutions</a></li>
          <li><a href="{{base}}pages/services/cyber-security.html">Cyber Security Services</a></li>
          <li><a href="{{base}}pages/services/internet-management.html">Internet Management &amp; Monitoring</a></li>
          <li><a href="{{base}}pages/services/it-procurement.html">IT Procurement &amp; Hardware Supply</a></li>
          <li><a href="{{base}}pages/services/it-support-amc.html">IT Support &amp; AMC Services</a></li>
          <li><a href="{{base}}pages/services/project-implementation.html">Project Implementation Services</a></li>
        </ul>
      </div>

      <div>
        <h2 class="footer-title">Contact</h2>
        <div class="footer-contact">
          <div class="footer-contact__row">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.26-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>
              <span class="footer-contact__label">Phone</span>
              <span class="footer-placeholder">Phone number to be added</span>
            </span>
          </div>

          <div class="footer-contact__row">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m2 7 10 6 10-6"></path>
            </svg>
            <span>
              <span class="footer-contact__label">Email</span>
              <span class="footer-placeholder">Email address to be added</span>
            </span>
          </div>

          <div class="footer-contact__row">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>
              <span class="footer-contact__label">Office</span>
              <span class="footer-placeholder">Address to be added</span>
            </span>
          </div>

          <a class="textlink" href="{{base}}pages/contact.html" style="color:#18A9E8">
            Send an enquiry
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"></path>
            </svg>
          </a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <p>&copy; <span data-current-year>2026</span> Teleon Networks Pvt Ltd. All rights reserved.</p>
      <p>IT &amp; Infrastructure Solutions</p>
    </div>
  </div>
</footer>`
  };

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function applyBase(markup) {
    return markup.replace(/\{\{base\}\}/g, BASE);
  }

  function inject(mount, markup) {
    mount.innerHTML = applyBase(markup);
  }

  function loadComponent(mount, file, fallbackKey) {
    var url = BASE + 'components/' + file;

    return fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(function (markup) {
        inject(mount, markup);
      })
      .catch(function () {
        // file:// protocol, or the component file is unreachable.
        inject(mount, FALLBACK[fallbackKey]);
      });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function init() {
    var headerMount = document.getElementById('site-header');
    var footerMount = document.getElementById('site-footer');
    var jobs = [];

    if (headerMount) jobs.push(loadComponent(headerMount, 'header.html', 'header'));
    if (footerMount) jobs.push(loadComponent(footerMount, 'footer.html', 'footer'));

    Promise.all(jobs).then(function () {
      // Tell navigation.js and main.js that the shared markup is in the DOM.
      document.dispatchEvent(new CustomEvent('components:loaded', {
        detail: { base: BASE }
      }));
    });
  }

  // Expose the resolved base path for any other script that needs it.
  window.TELEON = window.TELEON || {};
  window.TELEON.base = BASE;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
