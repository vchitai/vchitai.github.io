// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported, no need for additional code
    lazyImages.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyLoadScript = document.createElement('script');
    lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(lazyLoadScript);
  }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add Loading State to Forms
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', () => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading"></span> Submitting...';
    }
  });
});

// Add Intersection Observer for Fade-in Animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .photo-item').forEach(el => {
  observer.observe(el);
});

// Add Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('user-is-tabbing');
});

// Add Error Handling for Failed Image Loads
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    this.alt = 'Image failed to load';
  });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.terminal-menu-toggle');
  const menu = document.querySelector('.terminal-menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}); 