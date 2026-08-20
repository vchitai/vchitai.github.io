/* ============================================================
   Tai VONG — Shell theme switch

   The theme itself is applied by the inline snippet in <head>, before the
   first paint; this file only handles the toggle, persistence, and keeping
   the browser chrome colour in sync. Nothing here runs before paint, so a
   slow script can never cause a flash of the wrong theme.

   No external dependencies.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'hb-theme';
  var CHROME_COLOR = { light: '#f6f8fb', dark: '#060910' };

  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);

    var meta = document.querySelector('meta[data-theme-color]');
    if (meta) meta.setAttribute('content', CHROME_COLOR[theme]);

    // The ambient particle canvas paints with literal colours, so it has to be
    // told to re-read them rather than waiting for its next resize.
    window.dispatchEvent(new CustomEvent('hb:themechange', { detail: { theme: theme } }));

    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    if (!buttons.length) return;

    // Announce the state to assistive tech now that the control is live.
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
      button.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        apply(next);
        Array.prototype.forEach.call(buttons, function (b) {
          b.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        });
      });
    });
  });
})();
