/* ============================================
   TAI VONG - Personal Portfolio
   Minimal & Clean JavaScript
   ============================================ */

(function() {
  'use strict';

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initBackToTop();
    initScrollEffects();
    initCardTilt();
    initCountUp();
    initCursorGlow();
    initMagneticButtons();
    initFlipCards();
  }

  // === NAVIGATION ===
  function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    // Scroll effect for nav
    if (nav) {
      let lastScroll = 0;

      window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add scrolled class
        if (currentScroll > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
      });
    }

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        toggle.classList.toggle('active');
      });

      // Close on link click
      links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          links.classList.remove('active');
          toggle.classList.remove('active');
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
          links.classList.remove('active');
          toggle.classList.remove('active');
        }
      });
    }
  }

  // === BACK TO TOP ===
  function initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    });

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === SCROLL EFFECTS ===
  function initScrollEffects() {
    // Fade in elements on scroll
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Elements to animate
    const selectors = [
      '.passion-card',
      '.exp-item',
      '.post-card',
      '.project-card',
      '.timeline-item',
      '.stat-item'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
      });
    });
  }

  // === CARD TILT EFFECT ===
  function initCardTilt() {
    // Exclude flip cards from tilt effect
    const cards = document.querySelectorAll('.bento-card:not(.card-passion)');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // === COUNT UP ANIMATION ===
  function initCountUp() {
    const statValues = document.querySelectorAll('.stat-value');

    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const match = text.match(/^(\d+)(\+?)$/);

          if (match) {
            const target = parseInt(match[1]);
            const suffix = match[2] || '';
            animateCount(el, target, suffix);
          }

          observer.unobserve(el);
        }
      });
    }, observerOptions);

    statValues.forEach(el => observer.observe(el));
  }

  function animateCount(el, target, suffix) {
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-expo)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // === CURSOR GLOW EFFECT ===
  function initCursorGlow() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      // Smooth follow
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;

      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';

      requestAnimationFrame(animate);
    }
    animate();

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      glow.style.opacity = '1';
    });
  }

  // === MAGNETIC BUTTONS ===
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .social-btn');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // === FLIP CARDS ===
  function initFlipCards() {
    // Use event delegation on document
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.card-passion');
      if (!card) return;

      console.log('Click detected on passion card');

      const inner = card.querySelector('.passion-inner');
      if (!inner) return;

      const isFlipped = card.dataset.flipped === 'true';

      if (isFlipped) {
        inner.style.transform = 'rotateY(0deg)';
        card.dataset.flipped = 'false';
      } else {
        inner.style.transform = 'rotateY(180deg)';
        card.dataset.flipped = 'true';
      }

      console.log('Card flipped:', !isFlipped);
    });

    console.log('Flip cards initialized with event delegation');
  }

  // === CONSOLE MESSAGE ===
  console.log(
    '%c👋 Hello! Looking at the code? Nice!\n%c📧 chitai.vct@gmail.com\n🔗 github.com/vchitai',
    'color: #e85d04; font-weight: bold; font-size: 14px;',
    'color: #666; font-size: 12px;'
  );

})();
