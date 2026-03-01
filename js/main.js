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
})();
