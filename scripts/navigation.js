/**
 * navigation.js
 * Additional nav enhancements (keyboard nav, hide-on-scroll).
 * Loaded after includes.js has injected the header.
 */

(function () {
  'use strict';

  // Escape und das Schließen des Menüs liegen in includes.js (initNav),
  // damit Fokusverwaltung und Menüzustand an einer Stelle bleiben.

  // ── Hide nav on scroll down, reveal on scroll up ──
  (function initScrollNav() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;

    var lastY     = window.scrollY;
    var ticking   = false;
    var THRESHOLD = 80; // px scrolled before we hide

    function update() {
      var currentY = window.scrollY;
      var delta    = currentY - lastY;
      var menu     = document.getElementById('nav-menu');

      if (menu && menu.classList.contains('open')) {
        nav.classList.remove('nav-hidden');
        lastY   = currentY;
        ticking = false;
        return;
      }

      if (currentY < THRESHOLD) {
        // Always show near the top
        nav.classList.remove('nav-hidden');
      } else if (delta > 4) {
        // Scrolling down – hide
        nav.classList.add('nav-hidden');
      } else if (delta < -4) {
        // Scrolling up – reveal
        nav.classList.remove('nav-hidden');
      }

      lastY    = currentY;
      ticking  = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  })();

})();
