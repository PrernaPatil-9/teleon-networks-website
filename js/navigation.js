/* ==========================================================================
   Teleon Networks — navigation.js
   Desktop dropdowns (Services, Industries), mobile hamburger menu, mobile
   submenus, outside-click handling and active navigation states.

   Runs after components.js has injected the header markup.
   Component loading is not duplicated here.
   ========================================================================== */
(function () {
  'use strict';

  var DESKTOP_QUERY = window.matchMedia('(min-width: 1024px)');

  function initNavigation() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var toggle = header.querySelector('#navToggle');
    var mobileNav = header.querySelector('#mobileNav');

    /* ----------------------------------------------------------------
       Mobile menu
       ---------------------------------------------------------------- */
    function isMenuOpen() {
      return !!mobileNav && mobileNav.classList.contains('is-open');
    }

    function openMenu() {
      if (!mobileNav || !toggle) return;
      mobileNav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      document.body.classList.add('nav-locked');
    }

    function closeMenu() {
      if (!mobileNav || !toggle) return;
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('nav-locked');
      closeAllMobileSubmenus();
    }

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function (event) {
        event.stopPropagation();
        if (isMenuOpen()) {
          closeMenu();
        } else {
          closeAllDropdowns();
          openMenu();
        }
      });

      mobileNav.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
      });
    }

    /* ----------------------------------------------------------------
       Mobile submenus (Services + Industries)
       Generic: any toggle with aria-controls pointing to a panel.
       ---------------------------------------------------------------- */
    var mobileTogglePairs = [
      ['#mobileServicesToggle',   '#mobileServicesPanel'],
      ['#mobileIndustriesToggle', '#mobileIndustriesPanel']
    ];

    var mobileSubmenus = [];

    mobileTogglePairs.forEach(function (pair) {
      var btn = header.querySelector(pair[0]);
      var panel = header.querySelector(pair[1]);
      if (!btn || !panel) return;

      mobileSubmenus.push({ btn: btn, panel: panel });

      btn.addEventListener('click', function () {
        if (panel.classList.contains('is-open')) {
          panel.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          // close siblings
          mobileSubmenus.forEach(function (other) {
            if (other.panel !== panel) {
              other.panel.classList.remove('is-open');
              other.btn.setAttribute('aria-expanded', 'false');
            }
          });
          panel.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    function closeAllMobileSubmenus() {
      mobileSubmenus.forEach(function (m) {
        m.panel.classList.remove('is-open');
        m.btn.setAttribute('aria-expanded', 'false');
      });
    }

    /* ----------------------------------------------------------------
       Desktop dropdowns — generic over ALL [data-dropdown] elements
       ---------------------------------------------------------------- */
    var dropdowns = Array.prototype.slice.call(
      header.querySelectorAll('[data-dropdown]')
    );

    // Attach hover/click handlers to every dropdown
    dropdowns.forEach(function (item) {
      var trigger = item.querySelector('[data-dropdown-trigger]');
      if (!trigger) return;

      var hoverTimer = null;

      function open() {
        // close others first
        dropdowns.forEach(function (d) {
          if (d !== item) {
            d.classList.remove('is-open');
            var t = d.querySelector('[data-dropdown-trigger]');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function close() {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      trigger.addEventListener('click', function (event) {
        event.stopPropagation();
        if (item.classList.contains('is-open')) {
          close();
        } else {
          open();
        }
      });

      // Hover intent on pointer devices only
      item.addEventListener('mouseenter', function () {
        if (!DESKTOP_QUERY.matches) return;
        window.clearTimeout(hoverTimer);
        open();
      });

      item.addEventListener('mouseleave', function () {
        if (!DESKTOP_QUERY.matches) return;
        hoverTimer = window.setTimeout(close, 140);
      });

      // Close once a menu item is chosen
      item.addEventListener('click', function (event) {
        if (event.target.closest('a')) close();
      });

      // Keyboard: leaving the dropdown closes it
      item.addEventListener('focusout', function (event) {
        if (!item.contains(event.relatedTarget)) close();
      });

      // Stash refs for global close helpers
      item._closeFn = close;
    });

    function closeAllDropdowns() {
      dropdowns.forEach(function (d) {
        d.classList.remove('is-open');
        var t = d.querySelector('[data-dropdown-trigger]');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }

    /* ----------------------------------------------------------------
       Outside click and Escape
       ---------------------------------------------------------------- */
    document.addEventListener('click', function (event) {
      dropdowns.forEach(function (d) {
        if (!d.contains(event.target)) {
          d.classList.remove('is-open');
          var t = d.querySelector('[data-dropdown-trigger]');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      if (isMenuOpen() &&
          !mobileNav.contains(event.target) &&
          !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      closeAllDropdowns();
      if (isMenuOpen()) {
        closeMenu();
        if (toggle) toggle.focus();
      }
    });

    /* ----------------------------------------------------------------
       Viewport changes
       ---------------------------------------------------------------- */
    function handleBreakpoint(event) {
      if (event.matches) {
        closeMenu();
      } else {
        closeAllDropdowns();
      }
    }

    if (typeof DESKTOP_QUERY.addEventListener === 'function') {
      DESKTOP_QUERY.addEventListener('change', handleBreakpoint);
    } else if (typeof DESKTOP_QUERY.addListener === 'function') {
      DESKTOP_QUERY.addListener(handleBreakpoint); // older Safari
    }

    /* ----------------------------------------------------------------
       Active navigation state
       ---------------------------------------------------------------- */
    var page = document.body.getAttribute('data-page');
    if (page) {
      var links = header.querySelectorAll('[data-nav="' + page + '"]');
      Array.prototype.forEach.call(links, function (link) {
        link.classList.add('is-active');
        if (link.tagName === 'A') link.setAttribute('aria-current', 'page');
      });
    }
  }

  document.addEventListener('components:loaded', initNavigation);
})();