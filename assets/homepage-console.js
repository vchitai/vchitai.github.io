/* ============================================================
   Tai VONG — Homepage systems console
   Boot overlay, ambient background
   No external dependencies
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initBootOverlay();
    initAmbientBackground();
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // === BOOT OVERLAY ===
  function initBootOverlay() {
    var boot = document.getElementById('hb-boot');
    if (!boot) return;

    var SESSION_KEY = 'hbBootShown';
    var DISMISS_DELAY = 1650;
    var FADE_DURATION = 260;

    var alreadySeen;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (err) {
      alreadySeen = true;
    }
    if (alreadySeen) return;

    function markSeen() {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (err) { /* private mode: skip gracefully */ }
    }

    if (prefersReducedMotion()) {
      markSeen();
      return;
    }

    markSeen();

    var dismissed = false;
    var dismissTimer = null;

    function handleBootSkip(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      dismiss();
    }

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      clearTimeout(dismissTimer);
      document.removeEventListener('keydown', handleBootSkip, true);
      document.removeEventListener('click', handleBootSkip, true);
      boot.classList.add('hb-boot-dismissing');
      setTimeout(function () {
        boot.hidden = true;
      }, FADE_DURATION);
    }

    boot.hidden = false;
    document.addEventListener('keydown', handleBootSkip, true);
    document.addEventListener('click', handleBootSkip, true);
    dismissTimer = setTimeout(dismiss, DISMISS_DELAY);
  }

  // === AMBIENT BACKGROUND ===
  function initAmbientBackground() {
    var canvas = document.getElementById('hb-ambient');
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var MOBILE_BREAKPOINT = 768;
    var LINK_DISTANCE = 130;
    var FRAME_INTERVAL = 70;

    var width = 0;
    var height = 0;
    var particles = [];
    var running = false;
    var frameTimer = null;
    var resizeTimer = null;

    function seedParticles() {
      var count = Math.max(14, Math.min(46, Math.round((width * height) / 26000)));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    /* The canvas cannot use CSS variables, so it reads the theme once and on
       every switch. Values are the same rgb triples the stylesheet uses. */
    var palette = { link: '8, 118, 158', dot: '22, 48, 88' };

    function readPalette() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      palette = dark
        ? { link: '73, 211, 255', dot: '148, 197, 255' }
        : { link: '8, 118, 158', dot: '22, 48, 88' };
    }

    readPalette();
    window.addEventListener('hb:themechange', readPalette);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      var i, j, particle, other, dx, dy, distance;

      for (i = 0; i < particles.length; i++) {
        particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      }

      for (i = 0; i < particles.length; i++) {
        particle = particles[i];
        for (j = i + 1; j < particles.length; j++) {
          other = particles[j];
          dx = particle.x - other.x;
          dy = particle.y - other.y;
          distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < LINK_DISTANCE) {
            ctx.strokeStyle = 'rgba(' + palette.link + ', ' + (0.16 * (1 - distance / LINK_DISTANCE)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      for (i = 0; i < particles.length; i++) {
        particle = particles[i];
        ctx.fillStyle = 'rgba(' + palette.dot + ', 0.55)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick() {
      if (!running) return;
      draw();
      frameTimer = setTimeout(tick, FRAME_INTERVAL);
    }

    function start() {
      if (running || window.innerWidth < MOBILE_BREAKPOINT) return;
      running = true;
      tick();
    }

    function stop() {
      running = false;
      if (frameTimer) clearTimeout(frameTimer);
    }

    function resize() {
      var parent = canvas.parentElement;
      if (!parent || window.innerWidth < MOBILE_BREAKPOINT) {
        stop();
        return;
      }
      var rect = parent.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      seedParticles();
      if (!document.hidden) start();
    }

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    resize();
  }

})();
