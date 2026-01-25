/* ============================================
   TAI VONG - Portfolio
   Minimal JavaScript
   ============================================ */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavHighlight();
    initSmoothScroll();
    initMouseSpotlight();
    initMobileNav();
  }

  // === NAVIGATION HIGHLIGHT (Homepage) ===
  function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item[href^="#"]');

    if (!sections.length || !navItems.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // === SMOOTH SCROLL ===
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // === MOUSE SPOTLIGHT EFFECT ===
  function initMouseSpotlight() {
    // Works on both homepage and inner pages
    const wrapper = document.querySelector('.portfolio-wrapper') || document.querySelector('.page-wrapper');
    if (!wrapper) return;

    // Create spotlight element
    const spotlight = document.createElement('div');
    spotlight.style.cssText = `
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      z-index: 0;
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(spotlight);

    let mouseX = 0;
    let mouseY = 0;
    let spotlightX = 0;
    let spotlightY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      spotlight.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });

    // Smooth animation
    function animate() {
      spotlightX += (mouseX - spotlightX) * 0.1;
      spotlightY += (mouseY - spotlightY) * 0.1;
      spotlight.style.left = spotlightX + 'px';
      spotlight.style.top = spotlightY + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

  // === MOBILE NAVIGATION (Inner pages) ===
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      }
    });
  }

})();
