/**
 * includes.js
 * Injects shared header and footer directly via JS template strings.
 * No fetch() needed – works with file:// and GitHub Pages.
 *
 * How it works:
 *   - Detects the page's depth below the site root
 *   - Builds a root prefix (e.g. "../" for depth-1 pages)
 *   - Inserts header/footer HTML with all links correctly prefixed
 *
 * Usage in HTML:
 *   <div data-include="header"></div>
 *   <div data-include="footer"></div>
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. Depth Detection
     ───────────────────────────────────────── */

  /**
   * Returns a path prefix like "" (root), "../" (depth 1), "../../" (depth 2).
   * Works for both file:// and http(s):// protocols.
   */
  function getRootPrefix() {
    const path = window.location.pathname;

    // Strip a trailing "/index.html" or any other "/*.html" filename (e.g.
    // root-level impressum.html, datenschutz.html) before counting folder
    // depth, then strip a trailing slash and split.
    const parts = path.replace(/\/[^/]*\.html$/, '').replace(/\/$/, '').split('/').filter(Boolean);

    // On GitHub Pages the first segment is the repo name (e.g. "handsofhope").
    // On a custom domain or local file:// the root is at depth 0.
    // We detect GitHub Pages by checking if the origin ends with .github.io
    const isGithubPages = window.location.hostname.endsWith('.github.io');
    const depth = isGithubPages ? Math.max(0, parts.length - 1) : parts.length;

    if (depth === 0) return './';
    return '../'.repeat(depth);
  }

  const R = getRootPrefix(); // e.g.  "./"  or  "../"  or  "../../"

  /* ─────────────────────────────────────────
     2. Header HTML
     ───────────────────────────────────────── */

  function buildHeader() {
    return `
<a class="skip-link" href="#main-content">Zum Inhalt springen</a>

<nav id="main-nav" aria-label="Hauptnavigation">
  <a class="nav-logo" href="${R}" aria-label="Hands of Hope – Startseite">
    <img src="${R}assets/logos/handsofhope-logo.webp" alt="Hands of Hope" width="140" height="40">
  </a>

  <ul class="nav-links" id="nav-links" role="list">
    <li><a href="${R}ueber-uns/">Über uns</a></li>
    <li class="nav-has-dropdown">
      <a href="${R}#bereiche">Arbeitsbereiche</a>
      <ul class="nav-dropdown" role="list">
        <li><a href="${R}rehabilitation/">🏠 Wohngruppe</a></li>
        <li><a href="${R}dienstleistungen/">🌳 Dienstleistungen</a></li>
        <li><a href="${R}strassencafe/">☕ Straßencafé</a></li>
        <li><a href="${R}praevention/">🛡 Prävention</a></li>
        <li><a href="${R}medien/">🎬 Medien</a></li>
      </ul>
    </li>
    <li><a href="${R}blog/">Blog</a></li>
    <li class="nav-cta">
      <a href="${R}ueber-uns/#spenden">❤ Spenden</a>
    </li>
  </ul>

  <button
    class="burger"
    id="burger"
    aria-label="Menü öffnen"
    aria-expanded="false"
    aria-controls="nav-links"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</nav>`;
  }

  /* ─────────────────────────────────────────
     3. Footer HTML
     ───────────────────────────────────────── */

  function buildFooter() {
    return `
<footer>
  <div class="footer-main">
    <div class="footer-brand">
      <a class="footer-logo-img" href="${R}" aria-label="Hands of Hope – Startseite">
        <img src="${R}assets/logos/handsofhope_logo_schriftzug_weiss.webp" alt="Hands of Hope" width="180" loading="lazy">
      </a>
      <div class="footer-social">
        <a href="https://www.instagram.com/handsofhopesiegen/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href="https://www.facebook.com/handsofhopesiegen" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="https://www.youtube.com/@handsofhopesiegen" target="_blank" rel="noopener" aria-label="YouTube">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
        </a>
      </div>
    </div>

    <div class="footer-col">
      <h4>Arbeitsbereiche</h4>
      <ul>
        <li><a href="${R}rehabilitation/">Wohngruppe</a></li>
        <li><a href="${R}dienstleistungen/">Dienstleistungen</a></li>
        <li><a href="${R}strassencafe/">Straßencafé</a></li>
        <li><a href="${R}praevention/">Prävention</a></li>
        <li><a href="${R}medien/">Medien</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Organisation</h4>
      <ul>
        <li><a href="${R}ueber-uns/">Über uns</a></li>
        <li><a href="${R}ueber-uns/#team">Team</a></li>
        <li><a href="${R}ueber-uns/#geschichte">Geschichte</a></li>
        <li><a href="${R}ueber-uns/#mitarbeit">Mitarbeiten</a></li>
        <li><a href="${R}ueber-uns/jobs/">Stellenangebote</a></li>
        <li><a href="${R}blog/">Blog</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Kontakt</h4>
      <address>
        <p>Hands of Hope gGmbH<br>Siegen / Neunkirchen</p>
      </address>
      <ul>
        <li><a href="${R}ueber-uns/#kontaktformular">Kontakt</a></li>
        <li><a href="${R}ueber-uns/#spenden">Spenden</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <span>© 2025 Hands of Hope gGmbH · Urheberrecht bei Hands of Hope</span>
      <nav class="footer-links" aria-label="Rechtliches">
        <a href="${R}impressum.html">Impressum</a>
        <a href="${R}datenschutz.html">Datenschutz</a>
        <a href="${R}ueber-uns/#spenden">Spenden</a>
      </nav>
    </div>
  </div>
</footer>

<style>
  footer {
    background: #0a1e28;
    color: rgba(255,255,255,0.55);
  }
  .footer-main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 4rem var(--section-pad-h) 3rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
  }
  .footer-logo-img {
    display: block;
    margin-bottom: 0.5rem;
  }
  .footer-logo-img img {
    height: 48px;
    width: auto;
    display: block;
  }
  .footer-tagline {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 1.25rem;
  }
  .footer-social { display: flex; gap: 0.75rem; }
  .footer-social a {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.55);
    transition: background var(--transition), color var(--transition);
  }
  .footer-social a:hover { background: rgba(255,255,255,0.16); color: var(--white); }
  .footer-col h4 {
    font-family: 'Nunito', sans-serif;
    font-weight: 700; font-size: 12px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 1rem;
  }
  .footer-col ul { list-style: none; }
  .footer-col li { margin-bottom: 0.5rem; }
  .footer-col a {
    font-size: 14px; color: rgba(255,255,255,0.55);
    text-decoration: none; transition: color var(--transition);
  }
  .footer-col a:hover { color: var(--white); }
  .footer-col address {
    font-style: normal; font-size: 14px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 0.75rem; line-height: 1.6;
  }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); }
  .footer-bottom-inner {
    max-width: var(--max-width); margin: 0 auto;
    padding: 1.25rem var(--section-pad-h);
    display: flex; align-items: center; justify-content: space-between;
    gap: 1.5rem; flex-wrap: wrap; font-size: 13px;
  }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-links a { color: rgba(255,255,255,0.4); text-decoration: none; transition: color var(--transition); }
  .footer-links a:hover { color: rgba(255,255,255,0.8); }
  @media (max-width: 900px) {
    .footer-main { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 3rem 2rem 2rem; }
    .footer-brand { grid-column: 1 / -1; }
    .footer-bottom-inner { padding: 1.25rem 2rem; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
  }
  @media (max-width: 600px) {
    .footer-main { grid-template-columns: 1fr; padding: 2.5rem 1.25rem 1.5rem; }
    .footer-bottom-inner { padding: 1.25rem; }
    .footer-links { flex-wrap: wrap; gap: 1rem; }
  }
</style>`;
  }

  /* ─────────────────────────────────────────
     4. Injection
     ───────────────────────────────────────── */

  function inject() {

    // Step 1: Replace each [data-include] placeholder via outerHTML setter.
    // outerHTML is the most reliable single-step element replacement –
    // no NodeList spread, no fragment juggling, works in every modern browser.
    var headerEl = document.querySelector('[data-include="header"]');
    if (headerEl) {
      headerEl.outerHTML = buildHeader();
    }

    var footerEl = document.querySelector('[data-include="footer"]');
    if (footerEl) {
      footerEl.outerHTML = buildFooter();
    }

    // Step 2: Fallback – inject directly into <body> if nav/footer are
    // still missing (e.g. placeholder was absent or outerHTML silently failed).
    if (!document.querySelector('nav')) {
      document.body.insertAdjacentHTML('afterbegin', buildHeader());
    }
    if (!document.querySelector('footer')) {
      document.body.insertAdjacentHTML('beforeend', buildFooter());
    }

    initNav();
  }

  /* ─────────────────────────────────────────
     5. Nav Behaviour
     ───────────────────────────────────────── */

  function initNav() {
    // ── Active link ──
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      const href = a.getAttribute('href') || '';
      try {
        const abs = new URL(href, window.location.href).pathname;
        if (abs !== '/' && currentPath.startsWith(abs) && abs.length > 1) {
          a.classList.add('active');
        } else if (abs === currentPath) {
          a.classList.add('active');
        }
      } catch (e) { /* ignore */ }
    });

    // Mark parent "Arbeitsbereiche" active when on any sub-area page
    var areaPaths = ['rehabilitation', 'dienstleistungen', 'strassencafe', 'praevention', 'medien'];
    var isAreaPage = areaPaths.some(function (seg) { return currentPath.indexOf('/' + seg) !== -1; });
    if (isAreaPage) {
      var parentLink = document.querySelector('.nav-has-dropdown > a');
      if (parentLink) parentLink.classList.add('active');
    }

    // ── Burger ──
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');

    if (burger && navLinks) {
      burger.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('open') &&
            !burger.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

    }

    // ── Scroll shadow ──
    const nav = document.querySelector('nav');
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('scrolled', window.scrollY > 10);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* ─────────────────────────────────────────
     6. Boot
     ───────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
