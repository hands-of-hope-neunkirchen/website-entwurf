/**
 * share.js
 * Verdrahtet den Share-Widget-Block in Blog-Posts (Story 9.3).
 * Baut Mailto-/WhatsApp-Links zur Laufzeit aus der aktuellen URL, damit sie
 * unabhängig von der jeweiligen Domain (file://, GitHub Pages, spätere
 * Produktions-Domain) immer korrekt sind.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var url = window.location.href;
    var title = document.title.replace(/\s*[–—-]\s*Hands of Hope\s*$/i, '').trim();

    document.querySelectorAll('[data-share="mail"]').forEach(function (a) {
      var subject = encodeURIComponent(title);
      var body = encodeURIComponent(title + '\n\n' + url);
      a.href = 'mailto:?subject=' + subject + '&body=' + body;
    });

    document.querySelectorAll('[data-share="whatsapp"]').forEach(function (a) {
      a.href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
    });

    document.querySelectorAll('[data-share="copy"]').forEach(function (btn) {
      var defaultLabel = btn.textContent;
      btn.addEventListener('click', function () {
        var done = function () {
          btn.textContent = '✓ Link kopiert';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = defaultLabel;
            btn.classList.remove('copied');
          }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done).catch(function () {
            window.prompt('Link zum Kopieren:', url);
          });
        } else {
          window.prompt('Link zum Kopieren:', url);
        }
      });
    });
  });
})();
