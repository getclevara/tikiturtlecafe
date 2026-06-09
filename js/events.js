/* Ascend event wiring. Uses delegation where practical; idempotent listeners. */
(function () {
  var SITE_HOST = 'tikiturtlehi.com';
  function t(name, props) { if (window.ascendTrack) window.ascendTrack(name, props || {}); }
  function txt(el) { return (el && (el.innerText || el.textContent) || '').trim().slice(0, 80); }
  function inSection(el) {
    var s = el.closest && el.closest('section[id], footer, nav');
    return s ? (s.id || s.tagName.toLowerCase()) : 'unknown';
  }
  function mapApp(href) {
    if (/maps\.apple\.com/i.test(href)) return 'apple_maps';
    if (/goo\.gl\/maps|google\.com\/maps|maps\.google/i.test(href)) return 'google_maps';
    return 'other_map';
  }
  function isOrderLink(el) {
    var label = (txt(el) + ' ' + (el.className || '')).toLowerCase();
    return /\border\b|book|reserv|clover/.test(label) || (el.href && /clover\.com/i.test(el.href));
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Delegated click handler for all anchor/button conversions.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a, button');
      if (!a) return;
      var href = a.getAttribute && a.getAttribute('href') || '';
      var label = txt(a);
      var loc = inSection(a);

      if (href.indexOf('tel:') === 0) return t('phone_click', { number: href.slice(4), cta_location: loc });
      if (href.indexOf('mailto:') === 0) return t('email_click', { address: href.slice(7), cta_location: loc });
      if (/maps\.google|maps\.apple|goo\.gl\/maps|google\.com\/maps/i.test(href)) {
        return t('direction_click', { target_app: mapApp(href), cta_location: loc });
      }
      if (isOrderLink(a)) t('order_click', { cta_label: label, cta_location: loc, destination: href || null });
      if (a.matches && a.matches('.nav-center a, .nav-logo')) t('nav_link_click', { link_label: label || 'logo', href: href });
      if (a.matches && a.matches('.btn, .btn-nav-order, .nav-cta, .arc-link, .featured-link, .google-badge')) {
        t('cta_click', { cta_label: label, cta_location: loc });
      }
      if (a.tagName === 'A' && /^https?:/i.test(href) && href.indexOf(SITE_HOST) === -1) {
        var host = '';
        try { host = new URL(href).hostname; } catch (_) {}
        t('outbound_click', { destination_domain: host, cta_label: label, cta_location: loc });
      }
    }, true);

    // Form start (first focus) + submit, delegated.
    var formsSeen = {};
    document.addEventListener('focusin', function (e) {
      var f = e.target.closest && e.target.closest('form');
      if (!f) return;
      var id = f.id || f.getAttribute('name') || 'form';
      if (formsSeen[id]) return;
      formsSeen[id] = 1;
      t('form_start', { form_id: id });
    }, true);
    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (!f || f.tagName !== 'FORM') return;
      t('form_submit', { form_id: f.id || f.getAttribute('name') || 'form' });
    }, true);

    // Scroll depth (25/50/75/100), once each.
    var hit = {};
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var pct = Math.round(((window.scrollY + window.innerHeight) / h.scrollHeight) * 100);
      [25, 50, 75, 100].forEach(function (m) {
        if (pct >= m && !hit[m]) { hit[m] = 1; t('scroll_depth', { percent: m }); }
      });
    }, { passive: true });

    // Menu section IntersectionObserver -> menu_view (once).
    var menu = document.getElementById('menu');
    if (menu && 'IntersectionObserver' in window) {
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !seen) { seen = true; t('menu_view'); io.disconnect(); }
        });
      }, { threshold: 0.3 });
      io.observe(menu);
    }

    // Engagement beacons.
    [30, 60, 120].forEach(function (s) {
      setTimeout(function () { t('engagement_time', { seconds: s }); }, s * 1000);
    });
  });
})();
