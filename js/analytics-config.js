/* Ascend tracking config. Build-time substitution replaces __XXX__ tokens.
   If a placeholder is still literal at runtime, the matching tracker silently
   skips init (see snippets in index.html and js/track.js). */
window.ASCEND_CONFIG = {
  siteSlug: 'tikiturtlecafe',
  siteCategory: 'local-business',
  ga4Id: '__GA_ID__',
  posthogKey: '__POSTHOG_KEY__',
  posthogHost: '__POSTHOG_HOST__',
  clarityId: '__CLARITY_ID__',
};
