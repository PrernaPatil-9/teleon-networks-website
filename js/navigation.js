/* ==========================================================================
   Teleon Networks — navigation.js
   Desktop Services dropdown, mobile hamburger menu, mobile Services submenu,
   outside-click handling and active navigation states.

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
    var servicesItem = header.querySelector('[data-dropdown]');
    var servicesTrigger = header.querySelector('[data-dropdown-trigger]');
    var mobileServicesToggle = header.querySelector('#mobileServicesToggle');
    var mobileServicesPanel = header.querySelector('#mobileServicesPanel');

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
      closeMobileSubmenu();
    }

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function (event) {
        event.stopPropagation();
        if (isMenuOpen()) {
          closeMenu();
        } else {
          closeDropdown();
          openMenu();
        }
      });

      // Close after any navigation link is tapped.
      mobileNav.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
      });
    }

    /* ----------------------------------------------------------------
       Mobile Services submenu
       ---------------------------------------------------------------- */
    function openMobileSubmenu() {
      if (!mobileServicesPanel || !mobileServicesToggle) return;
      mobileServicesPanel.classList.add('is-open');
      mobileServicesToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileSubmenu() {
      if (!mobileServicesPanel || !mobileServicesToggle) return;
      mobileServicesPanel.classList.remove('is-open');
      mobileServicesToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileServicesToggle && mobileServicesPanel) {
      mobileServicesToggle.addEventListener('click', function () {
        if (mobileServicesPanel.classList.contains('is-open')) {
          closeMobileSubmenu();
        } else {
          openMobileSubmenu();
        }
      });
    }

    /* ----------------------------------------------------------------
       Desktop Services dropdown
       ---------------------------------------------------------------- */
    var hoverTimer = null;

    function openDropdown() {
      if (!servicesItem || !servicesTrigger) return;
      servicesItem.classList.add('is-open');
      servicesTrigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      if (!servicesItem || !servicesTrigger) return;
      servicesItem.classList.remove('is-open');
      servicesTrigger.setAttribute('aria-expanded', 'false');
    }

    if (servicesItem && servicesTrigger) {
      servicesTrigger.addEventListener('click', function (event) {
        event.stopPropagation();
        if (servicesItem.classList.contains('is-open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      // Hover intent on pointer devices only.
      servicesItem.addEventListener('mouseenter', function () {
        if (!DESKTOP_QUERY.matches) return;
        window.clearTimeout(hoverTimer);
        openDropdown();
      });

      servicesItem.addEventListener('mouseleave', function () {
        if (!DESKTOP_QUERY.matches) return;
        hoverTimer = window.setTimeout(closeDropdown, 140);
      });

      // Close once a service is chosen.
      servicesItem.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeDropdown();
      });

      // Keyboard: leaving the dropdown closes it.
      servicesItem.addEventListener('focusout', function (event) {
        if (!servicesItem.contains(event.relatedTarget)) closeDropdown();
      });
    }

    /* ----------------------------------------------------------------
       Outside click and Escape
       ---------------------------------------------------------------- */
    document.addEventListener('click', function (event) {
      if (servicesItem && !servicesItem.contains(event.target)) closeDropdown();

      if (isMenuOpen() &&
          !mobileNav.contains(event.target) &&
          !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      closeDropdown();
      if (isMenuOpen()) {
        closeMenu();
        if (toggle) toggle.focus();
      }
    });

    /* ----------------------------------------------------------------
       Viewport changes
       Leaving mobile width while the panel is open would otherwise strand
       the scroll lock.
       ---------------------------------------------------------------- */
    function handleBreakpoint(event) {
      if (event.matches) {
        closeMenu();
      } else {
        closeDropdown();
      }
    }

    if (typeof DESKTOP_QUERY.addEventListener === 'function') {
      DESKTOP_QUERY.addEventListener('change', handleBreakpoint);
    } else if (typeof DESKTOP_QUERY.addListener === 'function') {
      DESKTOP_QUERY.addListener(handleBreakpoint); // older Safari
    }

    /* ----------------------------------------------------------------
       Active navigation state
       Each page sets <body data-page="..."> and links carry data-nav.
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
