/* ==========================================================================
   Teleon Networks — main.js
   Global site behaviour: scroll reveal, header scroll state, back-to-top,
   smooth in-page scrolling, current year and contact form validation.

   Hamburger and dropdown behaviour lives in navigation.js.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Header scroll state and back-to-top
     ------------------------------------------------------------------ */
  function initScrollEffects() {
    var toTop = document.getElementById('toTop');
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var header = document.querySelector('.site-header');

      if (header) header.classList.toggle('is-stuck', y > 8);
      if (toTop) toTop.classList.toggle('is-visible', y > 620);

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    }
  }

  /* ------------------------------------------------------------------
     Smooth in-page scrolling for hash links
     ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------------
     Current year (runs again once the footer is injected)
     ------------------------------------------------------------------ */
  function setCurrentYear() {
    var slots = document.querySelectorAll('[data-current-year]');
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(slots, function (slot) {
      slot.textContent = year;
    });
  }

  /* ------------------------------------------------------------------
     Contact form validation
     The site is frontend-only: nothing is transmitted and no email is sent.
     ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById('enquiryForm');
    if (!form) return;

    var status = document.getElementById('formStatus');
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_PATTERN = /^[0-9+()\s-]{7,20}$/;

    function fieldOf(input) {
      return input.closest('.field');
    }

    function setError(input, message) {
      var field = fieldOf(input);
      if (!field) return;
      var slot = field.querySelector('.field__error');
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (slot) slot.textContent = message;
    }

    function clearError(input) {
      var field = fieldOf(input);
      if (!field) return;
      var slot = field.querySelector('.field__error');
      field.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      if (slot) slot.textContent = '';
    }

    function validate(input) {
      var value = (input.value || '').trim();
      var name = input.name;

      if (input.hasAttribute('required') && !value) {
        setError(input, 'This field is required.');
        return false;
      }

      if (name === 'name' && value && value.length < 2) {
        setError(input, 'Enter your full name.');
        return false;
      }

      if (name === 'email' && value && !EMAIL_PATTERN.test(value)) {
        setError(input, 'Enter a valid email address, for example name@company.com.');
        return false;
      }

      if (name === 'phone' && value && !PHONE_PATTERN.test(value)) {
        setError(input, 'Enter a valid phone number using digits, spaces, + or -.');
        return false;
      }

      if (name === 'message' && value && value.length < 10) {
        setError(input, 'Add a little more detail — at least 10 characters.');
        return false;
      }

      clearError(input);
      return true;
    }

    var inputs = form.querySelectorAll('input, select, textarea');

    Array.prototype.forEach.call(inputs, function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) validate(input);
      });
      input.addEventListener('change', function () {
        if (input.tagName === 'SELECT') validate(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      Array.prototype.forEach.call(inputs, function (input) {
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        if (status) status.classList.remove('is-visible');
        firstInvalid.focus();
        return;
      }

      if (status) {
        status.classList.add('is-visible');
        status.setAttribute('tabindex', '-1');
        status.focus({ preventScroll: true });
        status.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center'
        });
      }

      form.reset();
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function init() {
    initReveal();
    initScrollEffects();
    initSmoothScroll();
    setCurrentYear();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Header and footer arrive after the initial paint.
  document.addEventListener('components:loaded', function () {
    setCurrentYear();
    initScrollEffects();
  });
})();
