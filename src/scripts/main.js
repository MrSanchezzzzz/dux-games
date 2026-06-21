/* ============================================================
   DUX Games — landing interactions (plain JS)
   reveal-on-scroll · stat count-up · back-to-top
   All entrance animation is GATED on the document being visible,
   so a hidden/backgrounded iframe always shows full content.
   ============================================================ */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible = document.visibilityState === 'visible';

  /* ---------- reveal on scroll ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));

  if (visible && !reduceMotion) {
    // opt into the hidden -> shown entrance
    docEl.classList.add('anim-ready');

    var show = function (el) { el.classList.add('in'); };
    var revealInView = function () {
      var vh = window.innerHeight || docEl.clientHeight;
      reveals.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) show(el);
      });
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }

    window.addEventListener('scroll', revealInView, { passive: true });
    window.addEventListener('load', revealInView);
    requestAnimationFrame(revealInView);
    // safety net: never leave anything stuck hidden
    setTimeout(function () { reveals.forEach(show); }, 1600);
  }
  // if not visible / reduced motion: .reveal stays at its base (visible) state.

  /* ---------- stat count-up ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var dur = 900, start = null;
    el.textContent = '0';
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }

  // Only animate the numbers when visible; otherwise leave the static
  // HTML values (1, 2, ∞, 0) exactly as authored.
  if (visible && !reduceMotion) {
    var counters = [].slice.call(document.querySelectorAll('.num[data-count]'));
    var counted = false;
    var runCounters = function () {
      if (counted || !counters.length) return;
      counted = true;
      counters.forEach(countUp);
    };
    if ('IntersectionObserver' in window && counters.length) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCounters(); io2.disconnect(); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { io2.observe(el); });
    }
    window.addEventListener('scroll', function () {
      if (counted || !counters.length) return;
      var r = counters[0].getBoundingClientRect();
      var vh = window.innerHeight || docEl.clientHeight;
      if (r.top < vh * 0.85) runCounters();
    }, { passive: true });
    setTimeout(runCounters, 1800);
  }

  /* ---------- back to top ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 520) toTop.classList.add('show');
      else toTop.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    var setOpen = function (open) {
      navLinks.classList.toggle('open', open);
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    navToggle.addEventListener('click', function () {
      setOpen(!navLinks.classList.contains('open'));
    });
    // close when a link/button inside the menu is tapped
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    // close when resizing up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) setOpen(false);
    }, { passive: true });
  }

  /* ---------- rotating headline word ---------- */
  var rotate = document.querySelector('.hero h1 .rotate');
  var rotateWrap = document.querySelector('.hero h1 .rotate-wrap');
  if (rotate && rotateWrap) {
    var phrases = [
      'getting lost in',
      'staying up for',
      'coming back to',
      'obsessing over',
      'talking about',
      'finishing twice'
    ];

    // Lock the slot width to the widest phrase so the headline never
    // reflows (keeps "worth" from jumping). Expressed in em so it
    // scales with the responsive font-size on resize.
    function lockWidth() {
      var h1 = rotate.closest('h1');
      var fontPx = parseFloat(getComputedStyle(h1).fontSize) || 16;
      var original = rotate.textContent;
      var maxPx = 0;
      phrases.forEach(function (p) {
        rotate.textContent = p;
        maxPx = Math.max(maxPx, rotate.getBoundingClientRect().width);
      });
      rotate.textContent = original;
      rotateWrap.style.minWidth = (maxPx / fontPx + 0.5) + 'em';
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(lockWidth);
    } else {
      lockWidth();
    }
    var rzT;
    window.addEventListener('resize', function () {
      clearTimeout(rzT);
      rzT = setTimeout(lockWidth, 150);
    }, { passive: true });

    var ri = 0;
    if (!reduceMotion) {
      setInterval(function () {
        rotateWrap.classList.add('is-out');
        setTimeout(function () {
          ri = (ri + 1) % phrases.length;
          rotate.textContent = phrases[ri];
          rotateWrap.classList.remove('is-out');
        }, 360);
      }, 2600);
    }
  }

  /* ---------- theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      var effective = current || (systemLight ? 'light' : 'dark');
      var next = effective === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

})();
