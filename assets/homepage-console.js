/* ============================================================
   Tai VONG — Homepage systems console
   Boot overlay, ambient background, interactive terminal mode
   No external dependencies
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initBootOverlay();
    initAmbientBackground();
    initConsole();
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
            ctx.strokeStyle = 'rgba(73, 211, 255, ' + (0.16 * (1 - distance / LINK_DISTANCE)) + ')';
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
        ctx.fillStyle = 'rgba(148, 197, 255, 0.55)';
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

  // === TERMINAL CONSOLE ===
  function initConsole() {
    var consoleEl = document.getElementById('hb-console');
    var input = document.getElementById('hb-console-input');
    var output = document.getElementById('hb-console-output');
    if (!consoleEl || !input || !output) return;

    var triggers = document.querySelectorAll('[data-console-toggle]');
    var closers = consoleEl.querySelectorAll('[data-console-close]');
    var lastFocusedElement = null;
    var commandHistory = [];
    var historyIndex = 0;

    // The console ships on more than one page, so commands resolve their target
    // at run time: scroll if the section is in this document, otherwise route.
    var homeURL = consoleEl.getAttribute('data-console-home') || '/';
    var projectsURL = consoleEl.getAttribute('data-console-projects') || '/projects/';
    var NAVIGATE_DELAY = 450;

    function getFocusableElements() {
      return Array.prototype.slice.call(consoleEl.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (element) {
        return !element.hidden && element.getAttribute('aria-hidden') !== 'true';
      });
    }

    function keepFocusInsideConsole(event) {
      if (event.key !== 'Tab' || !isOpen()) return;

      var focusableElements = getFocusableElements();
      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      var firstElement = focusableElements[0];
      var lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    function isOpen() {
      return !consoleEl.hidden;
    }

    function lockScroll() {
      document.documentElement.classList.add('hb-scroll-lock');
    }

    function unlockScroll() {
      document.documentElement.classList.remove('hb-scroll-lock');
    }

    function moveCaretToEnd(field) {
      var length = field.value.length;
      if (typeof field.setSelectionRange === 'function') {
        field.setSelectionRange(length, length);
      }
    }

    function scrollOutputToEnd() {
      output.scrollTop = output.scrollHeight;
    }

    function appendLine(text, extraClassName) {
      var line = document.createElement('p');
      line.className = extraClassName ? 'hb-console-line ' + extraClassName : 'hb-console-line';
      line.textContent = text;
      output.appendChild(line);
      return line;
    }

    function appendEcho(commandText) {
      var line = document.createElement('p');
      line.className = 'hb-console-line hb-console-line-echo';
      var prompt = document.createElement('span');
      prompt.className = 'hb-console-echo-prompt';
      prompt.textContent = 'tai@systems:~$';
      line.appendChild(prompt);
      line.appendChild(document.createTextNode(commandText));
      output.appendChild(line);
    }

    function appendWelcome() {
      appendLine('tai@systems console — type "help" for available commands.', 'hb-console-line-muted');
    }

    function openConsole(trigger) {
      if (isOpen()) return;
      lastFocusedElement = trigger || document.activeElement;
      consoleEl.hidden = false;
      lockScroll();
      output.textContent = '';
      appendWelcome();
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'true'); });
      historyIndex = commandHistory.length;
      input.value = '';
      input.focus();
    }

    function closeConsole() {
      if (!isOpen()) return;
      consoleEl.hidden = true;
      unlockScroll();
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      var restoreTarget = lastFocusedElement;
      if (!restoreTarget || !document.documentElement.contains(restoreTarget) || restoreTarget.getClientRects().length === 0) {
        restoreTarget = document.querySelector('[data-nav-toggle]') || triggers[0];
      }
      if (restoreTarget && typeof restoreTarget.focus === 'function') {
        restoreTarget.focus();
      }
    }

    function goToSection(sectionId) {
      var target = document.getElementById(sectionId);
      if (!target) return;
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      });
    }

    function scheduleNavigateClose(sectionId, message) {
      appendLine(message, 'hb-console-line-muted');
      setTimeout(function () {
        var target = document.getElementById(sectionId);
        closeConsole();
        if (target) {
          goToSection(sectionId);
          return;
        }
        window.location.assign(homeURL + '#' + encodeURIComponent(sectionId));
      }, NAVIGATE_DELAY);
    }

    function schedulePageNavigate(url, message) {
      appendLine(message, 'hb-console-line-muted');
      setTimeout(function () {
        closeConsole();
        window.location.assign(url);
      }, NAVIGATE_DELAY);
    }

    function runHelp() {
      appendLine('AVAILABLE COMMANDS');
      [
        'help                 show this list',
        'whoami, about        who is Tai VONG',
        'work                 open selected work',
        'projects             open the complete project archive',
        'services             open ways to work together',
        'writing              open writing & open source',
        'contact              show contact details',
        'clear                clear the console',
        'exit                 close the console'
      ].forEach(function (line) { appendLine('  ' + line, 'hb-console-line-muted'); });
      appendLine('Shortcuts: ↑ / ↓ history · Esc close · ` toggle', 'hb-console-line-muted');
    }

    function runAbout() {
      appendLine('Tai VONG — Backend & Platform Engineer, Technical Manager @ Gearment.');
      appendLine('Go, gRPC, distributed systems — diagnosing, stabilizing, and hardening production backends.', 'hb-console-line-muted');
      scheduleNavigateClose('about', 'Opening about...');
    }

    function runWork() {
      scheduleNavigateClose('work', 'Opening selected work...');
    }

    function runProjects() {
      if (document.getElementById('archive')) {
        scheduleNavigateClose('archive', 'Opening project archive...');
        return;
      }
      schedulePageNavigate(projectsURL, 'Opening project archive...');
    }

    function runServices() {
      scheduleNavigateClose('services', 'Opening ways to work together...');
    }

    function runWriting() {
      scheduleNavigateClose('writing', 'Opening writing & open source...');
    }

    function runContact() {
      appendLine('EMAIL   chitai.vct@gmail.com');
      appendLine('Click to open your mail client:', 'hb-console-line-muted');
      var link = document.createElement('a');
      link.className = 'hb-console-mailto';
      link.href = 'mailto:chitai.vct@gmail.com?subject=Project%20inquiry%20via%20vchitai.github.io';
      link.textContent = 'chitai.vct@gmail.com';
      output.appendChild(link);
    }

    function runClear() {
      output.textContent = '';
    }

    function runExit() {
      closeConsole();
    }

    var COMMANDS = {
      help: runHelp,
      whoami: runAbout,
      about: runAbout,
      work: runWork,
      projects: runProjects,
      services: runServices,
      writing: runWriting,
      contact: runContact,
      clear: runClear,
      exit: runExit
    };

    function runCommand(rawInput) {
      var trimmed = rawInput.trim();
      if (!trimmed) return;

      commandHistory.push(trimmed);
      historyIndex = commandHistory.length;
      appendEcho(trimmed);

      var commandName = trimmed.split(/\s+/)[0].toLowerCase();
      var handler = COMMANDS[commandName];
      if (handler) {
        handler();
      } else {
        appendLine('command not found: ' + commandName, 'hb-console-line-error');
        appendLine('Type "help" for available commands.', 'hb-console-line-muted');
      }
      scrollOutputToEnd();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () { openConsole(trigger); });
    });

    closers.forEach(function (closer) {
      closer.addEventListener('click', closeConsole);
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        var value = input.value;
        input.value = '';
        runCommand(value);
      } else if (event.key === 'ArrowUp') {
        if (!commandHistory.length) return;
        event.preventDefault();
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = commandHistory[historyIndex] || '';
        moveCaretToEnd(input);
      } else if (event.key === 'ArrowDown') {
        if (!commandHistory.length) return;
        event.preventDefault();
        historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        input.value = commandHistory[historyIndex] || '';
        moveCaretToEnd(input);
      }
    });

    document.addEventListener('keydown', function (event) {
      keepFocusInsideConsole(event);

      if (event.isComposing) return;

      if (event.key === 'Escape' && isOpen()) {
        event.preventDefault();
        closeConsole();
        return;
      }

      if (event.key === '`') {
        var boot = document.getElementById('hb-boot');
        if (boot && !boot.hidden) return;

        var active = document.activeElement;
        var tagName = active && active.tagName ? active.tagName.toLowerCase() : '';
        var isEditable = tagName === 'input' || tagName === 'textarea' || (active && active.isContentEditable);
        if (isEditable) return;

        event.preventDefault();
        if (isOpen()) {
          closeConsole();
        } else {
          openConsole(document.activeElement);
        }
      }
    });
  }

})();
