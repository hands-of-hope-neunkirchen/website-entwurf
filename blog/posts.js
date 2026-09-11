/**
 * posts.js – Central post registry for the Hands of Hope blog.
 *
 * To add a new post: append one object to POSTS (newest first).
 * All sidebar "Weitere Beiträge" and the blog overview page are
 * rendered automatically from this array.
 */
(function () {
  'use strict';

  var POSTS = [
    {
      slug:     'mikes-geschichte',
      title:    '„Ich dachte, es gibt kein Zurück mehr" – Mikes Geschichte',
      excerpt:  'Zwölf Jahre Sucht, drei gescheiterte Therapieversuche, eine zerbrochene Familie. Als Mike zu uns kam, glaubte er selbst nicht mehr an eine Veränderung. Heute lebt er seit anderthalb Jahren clean – und engagiert sich bei uns als Mentor.',
      category: 'Wohngruppe',
      badgeClass: 'badge-rehab',
      date:     '14. Mai 2025',
      author:   'Christian Brück',
      authorRole: 'Leitung Wohngruppe',
      readMin:  6,
      thumb:    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
      thumbAlt: 'Männer sitzen zusammen am Tisch',
    },
    {
      slug:     'schulprojekt-neunkirchen',
      title:    'Wenn ein Vortrag ein Leben verändert – ein Schulprojekt in Neunkirchen',
      excerpt:  'Eigentlich wollten die Schülerinnen und Schüler nur ihre Mittagspause verbringen. Dann betrat Ciprian den Raum – und 45 Minuten später war es still. Kein Handy, kein Raunen. Nur echte Stille.',
      category: 'Prävention',
      badgeClass: 'badge-prev',
      date:     '28. April 2025',
      author:   'Ciprian Mihai',
      authorRole: 'Prävention & Schulprojekte',
      readMin:  5,
      thumb:    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      thumbAlt: 'Jugendliche beim gemeinsamen Gespräch in der Schule',
    },
    {
      slug:     'donnerstag-fuer-donnerstag',
      title:    'Donnerstag für Donnerstag – was uns nach 16 Jahren noch immer trägt',
      excerpt:  'Seit 2009 öffnen wir jeden Donnerstag unsere Türen. Was das bedeutet, lässt sich in Zahlen nur schwer fassen: etwa 100 Gäste, Hunderte ehrenamtliche Stunden – und unzählige Momente, die niemand vergisst.',
      category: 'Straßencafé',
      badgeClass: 'badge-cafe',
      date:     '3. April 2025',
      author:   'Nils Erner',
      authorRole: 'Leitung Straßencafé',
      readMin:  4,
      thumb:    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
      thumbAlt: 'Menschen beim gemeinsamen Kochen und Helfen',
    },
    {
      slug:     'heizung-nachsorgehaus',
      title:    'Wärme für einen Neuanfang: Die Heizung im Nachsorgehaus',
      excerpt:  'Im Nachsorgehaus in Steckenstein wird die komplette Heizungsanlage erneuert – ein wichtiger Baustein, damit die künftigen Bewohner ab dem geplanten Einzug ein warmes, verlässliches Zuhause haben.',
      category: 'Wohngruppe',
      badgeClass: 'badge-rehab',
      date:     'Baustellen-Update',
      author:   'Matthias Kreutz',
      authorRole: 'Baumission',
      readMin:  3,
      thumb:    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
      thumbAlt: 'Umbauarbeiten an einem Haus',
    },
    {
      slug:     'wg-kueche',
      title:    'Eine Küche, die zusammenbringt',
      excerpt:  'Im Nachsorgehaus entsteht ein gemeinsamer Küchen- und Essbereich für die künftige Wohngemeinschaft – ein Ort für Gemeinschaft, der über den Alltag hinaus trägt.',
      category: 'Wohngruppe',
      badgeClass: 'badge-rehab',
      date:     'Baustellen-Update',
      author:   'Verena Mackel',
      authorRole: 'Hausmutter / Hauswirtschaft',
      readMin:  3,
      thumb:    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
      thumbAlt: 'Leere Küche im Rohbau',
    },
  ];

  /* ── helpers ── */

  function postUrl(post, depth) {
    // depth 1 = from blog/index.html  → "slug/"
    // depth 2 = from blog/slug/index.html → "../slug/"
    return depth === 2 ? ('../' + post.slug + '/') : (post.slug + '/');
  }

  /* ── sidebar ──
   * Usage: place  <div data-blog-sidebar></div>  in the post's aside.
   * The script auto-detects the current slug from the URL.
   */
  function renderSidebar() {
    var el = document.querySelector('[data-blog-sidebar]');
    if (!el) return;

    var parts   = window.location.pathname.replace(/\/$/, '').split('/');
    var current = parts[parts.length - 1];   // e.g. "mikes-geschichte"

    var others = POSTS.filter(function (p) { return p.slug !== current; });

    // same-category first, then fill with remaining newest
    var currentPost = POSTS.find(function (p) { return p.slug === current; });
    var sameCategory = currentPost
      ? others.filter(function (p) { return p.category === currentPost.category; })
      : [];
    var rest = others.filter(function (p) { return p.category !== (currentPost && currentPost.category); });

    var picks = sameCategory.concat(rest).slice(0, 2);

    var html = '<h4>Weitere Beiträge</h4>';
    picks.forEach(function (p) {
      html += '<a href="' + postUrl(p, 2) + '" class="sidebar-post">'
        + '<div class="sidebar-post-thumb"><img src="' + p.thumb + '" alt="' + p.thumbAlt + '" loading="lazy"></div>'
        + '<div>'
        + '<div class="sidebar-post-title">' + p.title + '</div>'
        + '<div class="sidebar-post-date">' + p.date + ' · ' + p.category + '</div>'
        + '</div>'
        + '</a>';
    });

    el.innerHTML = html;
    if (window.observeReveal) window.observeReveal();
  }

  /* ── blog overview ──
   * Usage: place  <div data-blog-featured></div>  and  <div data-blog-grid></div>
   * in blog/index.html.
   */
  function renderOverview() {
    var featuredEl = document.querySelector('[data-blog-featured]');
    var gridEl     = document.querySelector('[data-blog-grid]');
    var filterEl   = document.querySelector('[data-blog-filter]');
    if (!featuredEl && !gridEl) return;

    var featured = POSTS[0];
    var rest     = POSTS.slice(1);

    // ── Kategoriefilter (Story 9.2) ──
    if (filterEl) {
      var categories = ['Alle'];
      rest.forEach(function (p) {
        if (categories.indexOf(p.category) === -1) categories.push(p.category);
      });

      var activeCategory = 'Alle';

      var renderFilterButtons = function () {
        filterEl.innerHTML = categories.map(function (cat) {
          var isActive = cat === activeCategory ? ' active' : '';
          return '<button type="button" class="blog-filter-btn' + isActive + '" data-category="' + cat + '">' + cat + '</button>';
        }).join('');

        filterEl.querySelectorAll('.blog-filter-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            activeCategory = btn.getAttribute('data-category');
            renderFilterButtons();
            renderGrid(activeCategory === 'Alle' ? rest : rest.filter(function (p) { return p.category === activeCategory; }));
          });
        });
      };

      renderFilterButtons();
    }

    if (featuredEl) {
      featuredEl.innerHTML = '<div class="blog-label reveal">Aktueller Beitrag</div>'
        + '<a href="' + postUrl(featured, 1) + '" class="featured-card reveal">'
        + '<div class="featured-photo">'
        + '<img src="' + featured.thumb + '" alt="' + featured.thumbAlt + '" loading="lazy">'
        + '<div class="featured-photo-overlay"></div>'
        + '</div>'
        + '<div class="featured-content">'
        + '<div class="featured-meta">'
        + '<span class="featured-category">' + featured.category + '</span>'
        + '<span class="featured-date">' + featured.date + '</span>'
        + '</div>'
        + '<h2>' + featured.title + '</h2>'
        + '<p>' + featured.excerpt + '</p>'
        + '<span class="read-more">Ganzen Bericht lesen →</span>'
        + '<div class="featured-author">'
        + '<div class="featured-author-avatar">✍️</div>'
        + '<div>'
        + '<div class="featured-author-name">' + featured.author + '</div>'
        + '<div class="featured-author-role">' + featured.authorRole + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</a>';
    }

    function renderGrid(list) {
      if (!gridEl) return;
      if (!list.length) {
        gridEl.innerHTML = '<p style="color: var(--text-light);">Keine Beiträge in dieser Kategorie.</p>';
        return;
      }
      var gridHtml = '';
      list.forEach(function (p, i) {
        var delay = i > 0 ? ' reveal-delay-' + i : '';
        gridHtml += '<a href="' + postUrl(p, 1) + '" class="post-card reveal' + delay + '">'
          + '<div class="post-photo">'
          + '<img src="' + p.thumb + '" alt="' + p.thumbAlt + '" loading="lazy">'
          + '<span class="post-category-badge ' + p.badgeClass + '">' + p.category + '</span>'
          + '</div>'
          + '<div class="post-body">'
          + '<div class="post-meta"><span>' + p.date + '</span><span class="post-meta-dot">·</span><span>' + p.readMin + ' Min. Lesezeit</span></div>'
          + '<h3>' + p.title + '</h3>'
          + '<p>' + p.excerpt + '</p>'
          + '<div class="post-footer">'
          + '<div class="post-author"><div class="post-author-avatar">✍️</div><span class="post-author-name">' + p.author + '</span></div>'
          + '<span class="post-read-more">Lesen →</span>'
          + '</div>'
          + '</div>'
          + '</a>';
      });
      gridEl.innerHTML = gridHtml;
      if (window.observeReveal) window.observeReveal();
    }

    renderGrid(rest);
    if (window.observeReveal) window.observeReveal();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderSidebar();
    renderOverview();
  });

})();
