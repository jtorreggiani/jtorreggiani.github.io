(function() {
  'use strict';

  var root = document.documentElement;
  var nav = document.getElementById('site-nav');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ----------------------------------------------------------------
     Mobile navigation
     The button's accessible name describes the action it performs, so it has
     to change with the state — aria-expanded alone leaves "Open menu"
     announced while the menu is open.
     ---------------------------------------------------------------- */
  function setNavOpen(isOpen) {
    nav.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function() {
      setNavOpen(!nav.classList.contains('nav-open'));
    });

    // Escape closes the menu and returns focus to the control that opened it,
    // so keyboard users are never stranded inside it.
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    // Clicking or tabbing away closes it too.
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
        setNavOpen(false);
      }
    });

    document.addEventListener('focusin', function(e) {
      if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
        setNavOpen(false);
      }
    });
  }

  if (navLinks && navToggle) {
    navLinks.addEventListener('click', function(e) {
      if (e.target.closest('a')) {
        setNavOpen(false);
      }
    });
  }

  /* ----------------------------------------------------------------
     Navbar scroll behaviour
     ---------------------------------------------------------------- */
  if (nav) {
    var scrollThreshold = 50;
    var ticking = false;

    var onScroll = function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          nav.classList.toggle('scrolled', window.scrollY > scrollThreshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------
     Theme toggle
     ---------------------------------------------------------------- */
  var themeToggle = document.getElementById('theme-toggle');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function syncToggleLabel() {
    if (!themeToggle) return;
    // Describes the destination, matching the icon shown.
    themeToggle.setAttribute(
      'aria-label',
      currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  function setTheme(theme) {
    // Smooth colour crossfade on manual toggle only — and not at all for
    // readers who have asked for reduced motion.
    if (!prefersReducedMotion.matches) {
      root.classList.add('theme-transition');
      setTimeout(function() {
        root.classList.remove('theme-transition');
      }, 350);
    }
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    syncToggleLabel();
  }

  // The head script may have resolved the theme from the system preference, so
  // the markup's default label can be wrong by the time we get here.
  syncToggleLabel();

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  // Follow the system preference unless the reader has chosen explicitly.
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function(e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) {}
    if (!stored) {
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      syncToggleLabel();
    }
  };
  if (darkQuery.addEventListener) {
    darkQuery.addEventListener('change', onSchemeChange);
  } else if (darkQuery.addListener) {
    darkQuery.addListener(onSchemeChange);
  }

  /* ----------------------------------------------------------------
     Scroll reveal

     The hiding is applied here rather than in the stylesheet, and only once
     the observer exists. If this script never runs — or motion is unwelcome —
     content stays visible instead of being permanently hidden.
     ---------------------------------------------------------------- */
  if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
    root.classList.add('reveal-enabled');

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.section').forEach(function(el) {
      observer.observe(el);
    });

    // Safety net: if anything goes wrong, reveal everything rather than leave
    // the page blank.
    window.setTimeout(function() {
      document.querySelectorAll('.section:not(.revealed)').forEach(function(el) {
        var box = el.getBoundingClientRect();
        if (box.top < window.innerHeight) el.classList.add('revealed');
      });
    }, 1200);
  }
})();
