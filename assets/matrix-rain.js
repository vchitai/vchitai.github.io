/* matrix-rain.js — Cyan matrix rain background animation */
window.MatrixRain = (function () {
  'use strict';

  function init() {
    var canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    if (window.innerWidth < 768) {
      canvas.style.display = 'none';
      return;
    }

    var ctx = canvas.getContext('2d');
    var katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    var alphanums = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]|;:,./?!@#$%^&*()-_+=';
    var chars = (katakana + alphanums).split('');
    var fontSize = 13;
    var columns, drops;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (var i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -(canvas.height / fontSize));
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px "JetBrains Mono", monospace';

      for (var i = 0; i < drops.length; i++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        var y  = drops[i] * fontSize;

        if (Math.random() > 0.93) {
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.9;
        } else {
          ctx.fillStyle = '#00d4ff';
          ctx.globalAlpha = Math.random() * 0.4 + 0.2;
        }
        ctx.fillText(ch, i * fontSize, y);

        if (y > canvas.height && Math.random() > 0.972) drops[i] = 0;
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    }

    resize();
    setInterval(draw, 45);
    window.addEventListener('resize', resize);
  }

  return { init: init };
})();
