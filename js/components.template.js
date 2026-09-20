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
    header: __HEADER__,
    footer: __FOOTER__
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
