(function() {
  'use strict';

  var nav = document.getElementById('site-nav');
  var navToggle = document.getElementById('nav-toggle');

  // Mobile nav toggle
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      var isOpen = nav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile nav on link click
  var navLinks = document.getElementById('nav-links');
  if (navLinks) {
    navLinks.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Navbar scroll behavior
  var scrollThreshold = 50;
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (window.scrollY > scrollThreshold) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Theme toggle
  var themeToggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    // Enable smooth transition only on manual toggle
    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
    // Remove transition class after animation completes
    setTimeout(function() {
      document.documentElement.classList.remove('theme-transition');
    }, 350);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Listen for system preference changes (only when no manual override)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  // Scroll reveal animations
  if ('IntersectionObserver' in window) {
    var sections = document.querySelectorAll('.section');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    sections.forEach(function(el) { observer.observe(el); });
  }
})();
