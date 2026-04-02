/* ============================================================
   TAI VONG — Terminal CV
   Main orchestrator
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    MatrixRain.init();
    BootSequence.init();
    TerminalNav.init();
    initScrollReveal();
    initPhotosTabs();
    initMapTooltips();
  }

  // Reveal .ssh-block, .project-row-term, .post-row on scroll (inner pages only)
  function initScrollReveal() {
    if (document.body.classList.contains('is-home')) return;

    var targets = document.querySelectorAll(
      '.ssh-block, .project-row-term, .post-row'
    );
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // === PHOTOS PAGE TABS ===
  function initPhotosTabs() {
    var tabs = document.querySelectorAll('.photos-tab');
    var contents = document.querySelectorAll('.photos-tab-content');
    if (!tabs.length) return;

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var target = this.getAttribute('data-tab');

        tabs.forEach(function(t) { t.classList.remove('active'); });
        contents.forEach(function(c) { c.classList.remove('active'); });

        this.classList.add('active');
        var targetEl = document.getElementById('tab-' + target);
        if (targetEl) targetEl.classList.add('active');

        history.replaceState(null, '', '#' + target);
      });
    });

    // Map sub-tabs (World / Vietnam)
    var mapToggles = document.querySelectorAll('.map-toggle-btn');
    var mapPanels = document.querySelectorAll('.map-panel');

    mapToggles.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var target = this.getAttribute('data-map');

        mapToggles.forEach(function(t) { t.classList.remove('active'); });
        mapPanels.forEach(function(p) { p.classList.remove('active'); });

        this.classList.add('active');
        var panel = document.getElementById('map-' + target);
        if (panel) panel.classList.add('active');
      });
    });

    // Restore tab from URL hash on load
    var hash = window.location.hash.substring(1);
    if (hash === 'travel-map') {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      contents.forEach(function(c) { c.classList.remove('active'); });
      var mapTab = document.querySelector('[data-tab="travel-map"]');
      var mapContent = document.getElementById('tab-travel-map');
      if (mapTab) mapTab.classList.add('active');
      if (mapContent) mapContent.classList.add('active');
    }
  }

  // === MAP SVG TOOLTIPS ===
  function initMapTooltips() {
    var tooltip = document.getElementById('map-tooltip');
    if (!tooltip) return;

    var paths = document.querySelectorAll('.map-country[data-name], .map-province[data-name]');

    paths.forEach(function(path) {
      path.addEventListener('mouseenter', function() {
        tooltip.textContent = this.getAttribute('data-name');
        tooltip.classList.add('visible');
      });

      path.addEventListener('mousemove', function(e) {
        tooltip.style.left = (e.clientX + 12) + 'px';
        tooltip.style.top = (e.clientY - 30) + 'px';
      });

      path.addEventListener('mouseleave', function() {
        tooltip.classList.remove('visible');
      });

      // Touch support
      path.addEventListener('touchstart', function(e) {
        e.preventDefault();
        tooltip.textContent = this.getAttribute('data-name');
        tooltip.classList.add('visible');
        var touch = e.touches[0];
        tooltip.style.left = (touch.clientX + 12) + 'px';
        tooltip.style.top = (touch.clientY - 40) + 'px';
        setTimeout(function() { tooltip.classList.remove('visible'); }, 2000);
      });
    });
  }

})();
