/**
 * media.js – Mock-Datenregistrierung für die Mediathek (Epic 9.1).
 *
 * WICHTIG: Alle Einträge sind Platzhalter/Mock-Daten (Story 9.1 – Medien).
 * Es liegen aktuell keine echten Video-/Audiodateien vor. Beim Aufbau der
 * echten Website (Next.js/Sanity) werden diese Einträge durch reale
 * Sanity-Dokumente ersetzt (siehe Story 15.11 – Medien pflegen).
 *
 * Analog zu blog/posts.js: hier neue Mock-Einträge ergänzen, bis echtes
 * Material vorliegt.
 */
(function () {
  'use strict';

  var MEDIA = [
    {
      slug: 'imagefilm-wer-wir-sind',
      type: 'video',
      title: 'Imagefilm: Wer wir sind',
      tags: ['Über uns'],
      excerpt: 'Ein kurzer Einblick in die Arbeit von Hands of Hope – Menschen, Orte, Geschichten.',
      thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      thumbAlt: 'Team von Hands of Hope',
      linkedPost: null,
    },
    {
      slug: 'baufortschritt-nachsorgehaus',
      type: 'video',
      title: 'Baufortschritt: Das Nachsorgehaus',
      tags: ['Rehabilitation'],
      excerpt: 'Der Umbau des Nachsorgehauses auf der Zielgeraden – Einzug geplant für Sommer 2026.',
      thumb: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
      thumbAlt: 'Umbauarbeiten am Nachsorgehaus',
      linkedPost: null,
    },
    {
      slug: 'lebenszeugnis-mikes-weg',
      type: 'video',
      title: 'Lebenszeugnis: Mikes Weg',
      tags: ['Rehabilitation', 'Erfahrungsbericht'],
      excerpt: 'Mike erzählt, wie er nach zwölf Jahren Sucht einen Neuanfang gefunden hat.',
      thumb: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
      thumbAlt: 'Männer sitzen zusammen am Tisch',
      linkedPost: { slug: 'mikes-geschichte', label: 'Ganze Geschichte im Blog lesen' },
    },
    {
      slug: 'predigt-gnade-die-traegt',
      type: 'audio',
      title: 'Predigt: Gnade, die trägt',
      tags: ['Predigt'],
      excerpt: 'Eine Predigt aus dem Gottesdienst im Rahmen des Straßencafés.',
      thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      thumbAlt: 'Bibel und Kerze',
      linkedPost: null,
    },
    {
      slug: 'predigt-neuanfang',
      type: 'audio',
      title: 'Predigt: Neuanfang',
      tags: ['Predigt'],
      excerpt: 'Über die Hoffnung auf einen echten Neuanfang – auch nach schweren Brüchen.',
      thumb: 'https://images.unsplash.com/photo-1445810694374-0a94739e4a03?w=800&q=80',
      thumbAlt: 'Offene Bibel',
      linkedPost: null,
    },
    {
      slug: 'strassencafe-donnerstagabend',
      type: 'bild',
      title: 'Straßencafé: Ein Donnerstagabend',
      tags: ['Straßencafé'],
      excerpt: 'Impressionen aus dem wöchentlichen Straßencafé in Siegen.',
      thumb: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      thumbAlt: 'Menschen in Gemeinschaft beim Straßencafé',
      linkedPost: { slug: 'donnerstag-fuer-donnerstag', label: 'Ganze Geschichte im Blog lesen' },
    },
    {
      slug: 'schulprojekt-neunkirchen-bilder',
      type: 'bild',
      title: 'Schulprojekt Neunkirchen',
      tags: ['Prävention'],
      excerpt: 'Eindrücke von einem Präventionsvortrag an einer Schule in Neunkirchen.',
      thumb: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
      thumbAlt: 'Vortrag vor Schülerinnen und Schülern',
      linkedPost: { slug: 'schulprojekt-neunkirchen', label: 'Ganze Geschichte im Blog lesen' },
    },
    {
      slug: 'garten-landschaftsbau',
      type: 'bild',
      title: 'Dienstleistungen: Garten- &amp; Landschaftsbau',
      tags: ['Dienstleistungen'],
      excerpt: 'Referenzprojekte aus unseren gemeinnützigen Arbeitsbetrieben.',
      thumb: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      thumbAlt: 'Garten- und Landschaftsbauarbeiten',
      linkedPost: null,
    },
  ];

  var TYPE_LABELS = { video: 'Video', audio: 'Audio', bild: 'Bild' };
  // Maskierte Icons statt Emojis – sie nehmen über currentColor die
  // Markenfarbe ihres Kontexts an (siehe styles/layout.css).
  var TYPE_ICONS  = {
    video: '<span class="ic ic-play" aria-hidden="true"></span>',
    audio: '<span class="ic ic-kopfhoerer" aria-hidden="true"></span>',
    bild:  '<span class="ic ic-bild" aria-hidden="true"></span>'
  };

  function mediaCard(item) {
    var linkHtml = item.linkedPost
      ? '<a href="../blog/' + item.linkedPost.slug + '/" class="media-linked-post">' + item.linkedPost.label + ' →</a>'
      : '';

    return '<div class="media-card reveal" data-type="' + item.type + '" data-tags="' + item.tags.join(',') + '">'
      + '<div class="media-thumb">'
      + '<img src="' + item.thumb + '" alt="' + item.thumbAlt + '" loading="lazy">'
      + '<span class="media-type-badge media-type-' + item.type + '">' + TYPE_ICONS[item.type] + ' ' + TYPE_LABELS[item.type] + '</span>'
      + '<span class="media-mock-badge">Platzhalter</span>'
      + '</div>'
      + '<div class="media-body">'
      + '<div class="media-tags">' + item.tags.map(function (t) { return '<span class="media-tag">' + t + '</span>'; }).join('') + '</div>'
      + '<h3>' + item.title + '</h3>'
      + '<p>' + item.excerpt + '</p>'
      + (item.type === 'video'
          ? '<div class="media-player media-player-video" aria-label="Video-Platzhalter"><span><span class="ic ic-play" aria-hidden="true"></span> Video folgt</span></div>'
          : item.type === 'audio'
            ? '<audio class="media-player-audio" controls disabled></audio><p class="media-player-hint">Audiodatei folgt</p>'
            : '')
      + linkHtml
      + '</div>'
      + '</div>';
  }

  function renderFilters(container, activeType, activeTag, onChange) {
    var types = ['Alle'].concat(Object.keys(TYPE_LABELS).map(function (t) { return TYPE_LABELS[t]; }));
    var tagSet = [];
    MEDIA.forEach(function (m) { m.tags.forEach(function (t) { if (tagSet.indexOf(t) === -1) tagSet.push(t); }); });

    var typeHtml = types.map(function (label) {
      var value = label === 'Alle' ? 'alle' : Object.keys(TYPE_LABELS).find(function (k) { return TYPE_LABELS[k] === label; });
      var active = value === activeType ? ' active' : '';
      return '<button type="button" class="media-filter-btn' + active + '" data-filter-type="' + value + '">' + label + '</button>';
    }).join('');

    var tagHtml = ['Alle Themen'].concat(tagSet).map(function (tag) {
      var value = tag === 'Alle Themen' ? 'alle' : tag;
      var active = value === activeTag ? ' active' : '';
      return '<button type="button" class="media-filter-btn media-filter-btn-tag' + active + '" data-filter-tag="' + value + '">' + tag + '</button>';
    }).join('');

    container.innerHTML =
      '<div class="media-filter-row"><span class="media-filter-label">Typ</span>' + typeHtml + '</div>'
      + '<div class="media-filter-row"><span class="media-filter-label">Thema</span>' + tagHtml + '</div>';

    container.querySelectorAll('[data-filter-type]').forEach(function (btn) {
      btn.addEventListener('click', function () { onChange(btn.getAttribute('data-filter-type'), null); });
    });
    container.querySelectorAll('[data-filter-tag]').forEach(function (btn) {
      btn.addEventListener('click', function () { onChange(null, btn.getAttribute('data-filter-tag')); });
    });
  }

  function init() {
    var gridEl   = document.querySelector('[data-media-grid]');
    var filterEl = document.querySelector('[data-media-filter]');
    if (!gridEl) return;

    var activeType = 'alle';
    var activeTag  = 'alle';

    function applyFilter() {
      var filtered = MEDIA.filter(function (m) {
        var typeOk = activeType === 'alle' || m.type === activeType;
        var tagOk  = activeTag === 'alle' || m.tags.indexOf(activeTag) !== -1;
        return typeOk && tagOk;
      });
      gridEl.innerHTML = filtered.length
        ? filtered.map(mediaCard).join('')
        : '<p style="color: var(--text-light);">Keine Medien in dieser Auswahl.</p>';
      if (window.observeReveal) window.observeReveal();
    }

    function onFilterChange(type, tag) {
      if (type !== null) activeType = type;
      if (tag !== null) activeTag = tag;
      renderFilters(filterEl, activeType, activeTag, onFilterChange);
      applyFilter();
    }

    if (filterEl) {
      renderFilters(filterEl, activeType, activeTag, onFilterChange);
    }

    applyFilter();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
