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

  // === CONSOLE MESSAGE ===
  console.log(
    '%c👋 Hello! Looking at the code? Nice!\n%c📧 chitai.vct@gmail.com\n🔗 github.com/vchitai',
    'color: #e85d04; font-weight: bold; font-size: 14px;',
    'color: #666; font-size: 12px;'
  );

})();
