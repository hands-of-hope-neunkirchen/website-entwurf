/* ============================================================
   HANDS OF HOPE – tabs.js
   Tastaturbedienbare Tabs nach dem ARIA Authoring Practices Guide.

   Erwartetes Markup – jede Tabgruppe steht für sich, mehrere pro Seite
   sind möglich, weil ausschließlich innerhalb der [role="tablist"]-
   Gruppe gesucht wird:

     <div role="tablist">
       <button role="tab" id="…" aria-controls="…" aria-selected="true">…</button>
       …
     </div>
     <div role="tabpanel" id="…" aria-labelledby="…" tabindex="0">…</div>

   Der aktive Tab trägt .btn-primary, die übrigen .btn-ghost; die Panels
   werden über das hidden-Attribut geschaltet, nicht über eine Klasse.
   Ohne Tablist auf der Seite tut das Skript nichts.
   ============================================================ */

(function () {
  'use strict';

  function init(tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    if (tabs.length < 2) return;

    function panelOf(tab) {
      var id = tab.getAttribute('aria-controls');
      return id ? document.getElementById(id) : null;
    }

    function select(tab, fokussieren) {
      tabs.forEach(function (t) {
        var aktiv = t === tab;
        t.setAttribute('aria-selected', String(aktiv));
        t.setAttribute('tabindex', aktiv ? '0' : '-1');
        t.classList.toggle('btn-primary', aktiv);
        t.classList.toggle('btn-ghost', !aktiv);
        var panel = panelOf(t);
        if (panel) panel.hidden = !aktiv;
      });
      if (fokussieren) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });

      tab.addEventListener('keydown', function (e) {
        var ziel = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ziel = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ziel = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') ziel = tabs[0];
        else if (e.key === 'End') ziel = tabs[tabs.length - 1];
        if (!ziel) return;
        e.preventDefault();
        select(ziel, true);
      });
    });

    // Ausgangszustand aus dem Markup übernehmen, damit die Seite ohne
    // JavaScript denselben Tab zeigt wie mit.
    var aktiv = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
    select(aktiv || tabs[0], false);
  }

  function start() {
    document.querySelectorAll('[role="tablist"]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
