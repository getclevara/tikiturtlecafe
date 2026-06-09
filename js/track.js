/* Ascend dual-fire tracker. Sends every event to GA4 (gtag) and PostHog with a
   shared payload. Silently no-ops if a tracker isn't loaded. */
(function () {
  var cfg = window.ASCEND_CONFIG || {};
  var site = cfg.siteSlug || 'unknown';
  var category = cfg.siteCategory || 'unknown';

  function clean(props) {
    var out = { site: site, site_category: category };
    if (!props) return out;
    for (var k in props) {
      if (Object.prototype.hasOwnProperty.call(props, k) && props[k] !== undefined && props[k] !== null) {
        out[k] = props[k];
      }
    }
    return out;
  }

  window.ascendTrack = function (event, props) {
    if (!event) return;
    var payload = clean(props);
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', event, payload);
      }
    } catch (e) { /* swallow */ }
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(event, payload);
      }
    } catch (e) { /* swallow */ }
  };

  // Track initial page view once trackers are ready (idempotent).
  window.ascendTrack('page_view', {
    path: window.location.pathname,
    referrer: document.referrer || null,
  });
})();
