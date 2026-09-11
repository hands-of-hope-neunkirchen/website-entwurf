/* Cookie Banner + Google Analytics – Hands of Hope */
(function () {
  var GA_ID = 'G-XXXXXXXXXX';
  var STORAGE_KEY = 'hoh_cookie_consent';

  function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function applyConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
    if (value === 'all') loadGA();
    var banner = document.getElementById('hoh-cookie-banner');
    if (banner) banner.remove();
  }

  function showBanner() {
    var style = document.createElement('style');
    style.textContent = [
      '#hoh-cookie-banner{',
        'position:fixed;bottom:0;left:0;right:0;z-index:9999;',
        'background:#052937;color:#fff;',
        'padding:1.25rem 1.5rem;',
        'display:flex;flex-wrap:wrap;align-items:center;gap:1rem;',
        'box-shadow:0 -2px 12px rgba(0,0,0,.25);',
        'font-family:inherit;font-size:.9rem;line-height:1.4;',
      '}',
      '#hoh-cookie-banner p{margin:0;flex:1 1 260px;}',
      '#hoh-cookie-banner a{color:#5ecdc8;text-decoration:underline;}',
      '.hoh-cb-btns{display:flex;gap:.6rem;flex-wrap:wrap;}',
      '.hoh-cb-btn{',
        'cursor:pointer;border:none;border-radius:6px;',
        'padding:.55rem 1.1rem;font-size:.85rem;font-weight:600;',
        'white-space:nowrap;transition:opacity .15s;',
      '}',
      '.hoh-cb-btn:hover{opacity:.85;}',
      '.hoh-cb-accept{background:#5ecdc8;color:#052937;}',
      '.hoh-cb-reject{background:rgba(255,255,255,.12);color:#fff;}',
    ].join('');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'hoh-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML = [
      '<p>Wir verwenden Cookies, um die Nutzung unserer Website zu analysieren und zu verbessern.',
        ' Mehr dazu in unserer <a href="/datenschutz.html">Datenschutzerklärung</a>.</p>',
      '<div class="hoh-cb-btns">',
        '<button class="hoh-cb-btn hoh-cb-accept" id="hoh-cb-accept">Alle akzeptieren</button>',
        '<button class="hoh-cb-btn hoh-cb-reject" id="hoh-cb-reject">Nur notwendige</button>',
      '</div>',
    ].join('');
    document.body.appendChild(banner);

    document.getElementById('hoh-cb-accept').addEventListener('click', function () { applyConsent('all'); });
    document.getElementById('hoh-cb-reject').addEventListener('click', function () { applyConsent('necessary'); });
  }

  function init() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'all') { loadGA(); return; }
    if (saved === 'necessary') { return; }
    // No decision yet – show banner
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  init();
})();
