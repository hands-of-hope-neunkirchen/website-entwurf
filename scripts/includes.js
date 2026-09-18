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
   * Liefert das Pfad-Präfix zur Seitenwurzel ("./", "../", "../../").
   *
   * Abgeleitet aus dem Stylesheet-Link der Seite: jede Seite bindet
   * "…/styles/main.css" mit dem korrekten relativen Pfad ein. Das ist exakt –
   * anders als ein Raten über die URL, das unter file:// (Doppelklick auf
   * index.html) an der Verzeichnistiefe der Festplatte scheitert.
   */
  function getRootPrefix() {
    const link = document.querySelector('link[rel="stylesheet"][href*="styles/main.css"]');
    if (link) {
      const href = link.getAttribute('href') || '';
      const i = href.indexOf('styles/main.css');
      if (i !== -1) return href.slice(0, i) || './';
    }

    // Rückfallebene, falls das Stylesheet einmal anders eingebunden wird.
    const path = window.location.pathname;
    const parts = path.replace(/\/[^/]*\.html$/, '').replace(/\/$/, '').split('/').filter(Boolean);
    const isGithubPages = window.location.hostname.endsWith('.github.io');
    const depth = isGithubPages ? Math.max(0, parts.length - 1) : parts.length;
    return depth === 0 ? './' : '../'.repeat(depth);
  }

  const R = getRootPrefix(); // e.g.  "./"  or  "../"  or  "../../"

  /* ─────────────────────────────────────────
     2. Header HTML
     ───────────────────────────────────────── */

  /* Logo je Marke – Dachmarke, Straßencafé oder Dienstleistungen.
     Gesteuert über <body data-brand="…">. */
  const LOGOS = {
    dachmarke:        { datei: 'dachmarke-claim', alt: 'Hands of Hope – living hope.', ratio: 2949 / 546 },
    strassencafe:     { datei: 'strassencafe',    alt: 'Straßencafé',                  ratio: 2391 / 546 },
    dienstleistungen: { datei: 'dienstleistungen', alt: 'Hands of Hope Dienstleistungen', ratio: 2110 / 546 }
  };

  function marke() {
    const b = document.body.getAttribute('data-brand');
    return LOGOS[b] ? b : 'dachmarke';
  }

  function logoTag(hoehe, weiss) {
    const l = LOGOS[marke()];
    const datei = weiss ? l.datei + '-weiss' : l.datei;
    return `<img src="${R}assets/logos/${datei}.webp" alt="${l.alt}"
      width="${Math.round(hoehe * l.ratio)}" height="${hoehe}">`;
  }

  function buildHeader() {
    return `
<a class="skip-link" href="#main-content">Zum Inhalt springen</a>

<nav id="main-nav" aria-label="Hauptnavigation">
  <a class="nav-logo" href="${R}" aria-label="Hands of Hope – Startseite">
    ${logoTag(52, false)}
  </a>

  <ul class="nav-links" id="nav-links" role="list">
    <li><a href="${R}ueber-uns/">Über uns</a></li>
    <li><a href="${R}#bereiche">Arbeitsbereiche</a></li>
    <li><a href="${R}blog/">Blog</a></li>
    <li><a href="${R}medien/">Medien</a></li>
  </ul>

  <div class="nav-right">
    <a class="nav-donate" href="${R}ueber-uns/#spenden">Spenden</a>
    <button
      class="burger"
      id="burger"
      aria-label="Menü öffnen"
      aria-expanded="false"
      aria-controls="nav-menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>

<div class="nav-menu" id="nav-menu" aria-label="Alle Bereiche" role="dialog" aria-modal="true">
  <div class="nav-menu-inner">
    <div class="nav-menu-col">
      <h2>Arbeitsbereiche</h2>
      <ul role="list">
        <li><a href="${R}praevention/">Prävention</a></li>
        <li><a href="${R}rehabilitation/">Rehabilitation</a></li>
        <li><a href="${R}rehabilitation/#nachsorgehaus">Wohngruppe</a></li>
      </ul>
    </div>

    <div class="nav-menu-col">
      <h2>Eigenmarken</h2>
      <ul role="list">
        <li><a href="${R}strassencafe/">Straßencafé</a></li>
        <li><a href="${R}dienstleistungen/">Dienstleistungen</a></li>
      </ul>
    </div>

    <div class="nav-menu-col">
      <h2>Über uns</h2>
      <ul role="list">
        <li><a href="${R}ueber-uns/">Wer wir sind</a></li>
        <li><a href="${R}ueber-uns/#team">Team</a></li>
        <li><a href="${R}ueber-uns/#geschichte">Geschichte</a></li>
        <li><a href="${R}ueber-uns/#mitarbeit">Mitarbeiten</a></li>
        <li><a href="${R}ueber-uns/jobs/">Stellenangebote</a></li>
      </ul>
    </div>

    <div class="nav-menu-col">
      <h2>Aktuelles</h2>
      <ul role="list">
        <li><a href="${R}blog/">Blog</a></li>
        <li><a href="${R}medien/">Medien</a></li>
        <li><a href="${R}ueber-uns/#kontaktformular">Kontakt</a></li>
      </ul>
    </div>

    <div class="nav-menu-cta">
      <a class="btn btn-primary" href="${R}ueber-uns/#spenden">Jetzt spenden</a>
      <a class="btn btn-ghost" href="${R}ueber-uns/#kontaktformular">Kontakt aufnehmen</a>
    </div>
  </div>
</div>`;
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
        ${logoTag(48, true)}
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
        <li><a href="${R}praevention/">Prävention</a></li>
        <li><a href="${R}rehabilitation/">Rehabilitation</a></li>
        <li><a href="${R}rehabilitation/#nachsorgehaus">Wohngruppe</a></li>
        <li><a href="${R}strassencafe/">Straßencafé</a></li>
        <li><a href="${R}dienstleistungen/">Dienstleistungen</a></li>
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
        <li><a href="${R}medien/">Medien</a></li>
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
    background: var(--brand-dunkel);
    color: rgba(255,255,255,0.72);
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
    color: rgba(255,255,255,0.62);
    margin-bottom: 1.25rem;
  }
  .footer-social { display: flex; gap: 0.75rem; }
  .footer-social a {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.75);
    transition: background var(--transition), color var(--transition);
  }
  .footer-social a:hover { background: rgba(255,255,255,0.16); color: var(--white); }
  .footer-col h4 {
    font-family: var(--font-hand);
    font-weight: 400; font-size: 1.25rem;
    letter-spacing: 0; text-transform: none;
    color: rgba(255,255,255,0.75);
    margin-bottom: 0.9rem;
  }
  .footer-col ul { list-style: none; }
  .footer-col li { margin-bottom: 0.5rem; }
  .footer-col a {
    font-size: 14px; color: rgba(255,255,255,0.72);
    text-decoration: none; transition: color var(--transition);
  }
  .footer-col a:hover { color: var(--white); }
  .footer-col address {
    font-style: normal; font-size: 14px;
    color: rgba(255,255,255,0.72);
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
  .footer-links a { color: rgba(255,255,255,0.62); text-decoration: none; transition: color var(--transition); }
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
      // Anker-Links (z. B. "#bereiche") markieren keine Seite als aktiv –
      // sonst leuchtet auf der Startseite ein Menüpunkt ohne eigene Seite.
      if (href.indexOf('#') !== -1) return;
      try {
        const abs = new URL(href, window.location.href).pathname;
        if (abs !== '/' && currentPath.startsWith(abs) && abs.length > 1) {
          a.classList.add('active');
        }
      } catch (e) { /* ignore */ }
    });

    // "Arbeitsbereiche" markieren, wenn eine Bereichs- oder Eigenmarken-Seite offen ist
    var areaPaths = ['rehabilitation', 'dienstleistungen', 'strassencafe', 'praevention'];
    var isAreaPage = areaPaths.some(function (seg) { return currentPath.indexOf('/' + seg) !== -1; });
    if (isAreaPage) {
      document.querySelectorAll('.nav-links a').forEach(function (a) {
        if ((a.getAttribute('href') || '').indexOf('#bereiche') !== -1) a.classList.add('active');
      });
    }

    // ── Burger + Vollbild-Menü ──
    const burger = document.getElementById('burger');
    const menu = document.getElementById('nav-menu');

    if (burger && menu) {
      var setMenu = function (offen) {
        menu.classList.toggle('open', offen);
        burger.classList.toggle('open', offen);
        burger.setAttribute('aria-expanded', String(offen));
        burger.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
        document.body.style.overflow = offen ? 'hidden' : '';
        if (offen) {
          // Erst nach dem Sichtbarwerden fokussieren – ein Element mit
          // visibility:hidden nimmt keinen Fokus an.
          requestAnimationFrame(function () {
            var ersterLink = menu.querySelector('a');
            if (ersterLink) ersterLink.focus();
          });
        } else {
          burger.focus();
        }
      };

      burger.addEventListener('click', function () {
        setMenu(!menu.classList.contains('open'));
      });

      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });

      document.addEventListener('keydown', function (e) {
        if (!menu.classList.contains('open')) return;

        if (e.key === 'Escape') {
          setMenu(false);
          return;
        }

        // Fokus im geöffneten Menü halten
        if (e.key === 'Tab') {
          var ziele = [burger].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
          var erster = ziele[0];
          var letzter = ziele[ziele.length - 1];
          if (e.shiftKey && document.activeElement === erster) {
            e.preventDefault();
            letzter.focus();
          } else if (!e.shiftKey && document.activeElement === letzter) {
            e.preventDefault();
            erster.focus();
          }
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
