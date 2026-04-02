/* typewriter.js — Text reveal utility */
window.Typewriter = (function () {
  'use strict';

  function type(el, text, opts) {
    opts = opts || {};
    var speed      = opts.speed      || 28;
    var onComplete = opts.onComplete || function () {};
    var i = 0;
    el.textContent = '';

    function tick() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(tick, speed + Math.random() * 15);
      } else {
        onComplete();
      }
    }
    tick();
  }

  function revealLines(container, opts) {
    opts = opts || {};
    var stagger    = opts.stagger    || 70;
    var onComplete = opts.onComplete || function () {};

    var lines = container.querySelectorAll(
      '.line, .ssh-block, .ls-row, .project-row-term, .post-row, .neofetch-block > p, .boot-line'
    );

    if (!lines.length) {
      container.classList.add('visible');
      onComplete();
      return;
    }

    var i = 0;
    function showNext() {
      if (i < lines.length) {
        lines[i].classList.add('visible');
        i++;
        setTimeout(showNext, stagger);
      } else {
        onComplete();
      }
    }
    showNext();
  }

  function instant(el) {
    if (!el) return;
    el.classList.add('visible', 'instant');
    el.querySelectorAll(
      '.line, .ssh-block, .ls-row, .project-row-term, .post-row, .cmd-block, .boot-line'
    ).forEach(function (c) {
      c.classList.add('visible');
    });
  }

  return { type: type, revealLines: revealLines, instant: instant };
})();
