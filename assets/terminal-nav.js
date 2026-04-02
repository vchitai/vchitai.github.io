/* terminal-nav.js — Navigation with cd command animation */
window.TerminalNav = (function () {
  'use strict';

  function buildPromptNodes(container) {
    var user = document.createElement('span');
    user.className = 'prompt-user';
    user.textContent = 'vchitai@terminal';

    var sep = document.createElement('span');
    sep.className = 'prompt-sep';
    sep.textContent = ':';

    var path = document.createElement('span');
    path.className = 'prompt-path';
    path.textContent = '~';

    var dollar = document.createElement('span');
    dollar.className = 'prompt-dollar';
    dollar.textContent = '$ ';

    container.appendChild(user);
    container.appendChild(sep);
    container.appendChild(path);
    container.appendChild(dollar);
  }

  function navigate(href) {
    var idlePrompt = document.getElementById('terminal-idle-prompt');
    if (!idlePrompt) {
      window.location.href = href;
      return;
    }

    while (idlePrompt.firstChild) {
      idlePrompt.removeChild(idlePrompt.firstChild);
    }

    buildPromptNodes(idlePrompt);

    var cmdSpan = document.createElement('span');
    cmdSpan.className = 'cmd-text';
    idlePrompt.appendChild(cmdSpan);

    Typewriter.type(cmdSpan, 'cd ' + href, {
      speed: 55,
      onComplete: function () {
        setTimeout(function () {
          window.location.href = href;
        }, 280);
      }
    });
  }

  function init() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      if (
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        href.charAt(0) === '#' ||
        href.indexOf('http') === 0 ||
        href.indexOf('mailto') === 0 ||
        href.indexOf('tel') === 0
      ) return;

      e.preventDefault();
      navigate(href);
    });
  }

  return { init: init };
})();
