/* boot-sequence.js — Homepage boot animation orchestrator */
window.BootSequence = (function () {
  'use strict';

  var skipped = false;

  function skipAll() {
    if (skipped) return;
    skipped = true;

    ['boot-sequence', 'cmd-whoami', 'cmd-neofetch', 'cmd-about', 'cmd-ls'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) Typewriter.instant(el);
    });

    var prompt = document.getElementById('terminal-idle-prompt');
    if (prompt) prompt.classList.add('visible');
  }

  function init() {
    var bootEl = document.getElementById('boot-sequence');
    if (!bootEl) return;

    var onSkip = function () {
      skipAll();
      document.removeEventListener('keydown', onSkip);
      document.removeEventListener('click',   onSkip);
    };
    document.addEventListener('keydown', onSkip);
    document.addEventListener('click',   onSkip);

    var lines = bootEl.querySelectorAll('.boot-line');
    var maxDelay = 0;

    lines.forEach(function (line) {
      var delay = parseInt(line.dataset.delay || 0, 10);
      maxDelay = Math.max(maxDelay, delay);
      setTimeout(function () {
        if (skipped) return;
        line.classList.add('visible');
      }, delay);
    });

    var t = maxDelay + 500;

    setTimeout(function () {
      if (skipped) return;
      var el = document.getElementById('cmd-whoami');
      if (!el) return;
      el.classList.add('visible');
      Typewriter.revealLines(el, { stagger: 55 });
    }, t);
    t += 1100;

    setTimeout(function () {
      if (skipped) return;
      var el = document.getElementById('cmd-neofetch');
      if (!el) return;
      el.classList.add('visible');
      Typewriter.revealLines(el, { stagger: 75 });
    }, t);
    t += 1200;

    setTimeout(function () {
      if (skipped) return;
      var el = document.getElementById('cmd-about');
      if (!el) return;
      el.classList.add('visible');
      Typewriter.revealLines(el, { stagger: 60 });
    }, t);
    t += 800;

    setTimeout(function () {
      if (skipped) return;
      var el = document.getElementById('cmd-ls');
      if (!el) return;
      el.classList.add('visible');
      Typewriter.revealLines(el, { stagger: 85 });
    }, t);
    t += 700;

    setTimeout(function () {
      if (skipped) return;
      var prompt = document.getElementById('terminal-idle-prompt');
      if (prompt) prompt.classList.add('visible');
    }, t);
  }

  return { init: init };
})();
