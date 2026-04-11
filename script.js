/* ================================================
   ARTEMIS CONSULTING — Vanilla JS interactions
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initScrollProgress();
  initNavbarScroll();
  initNavbarHide();
  initMobileMenu();
  initLanguageSelector();
  initRevealOnScroll();
  initTimelineLine();
  initCountUp();
  initTestimonialsCarousel();
  initSmoothAnchors();
  initBackToTop();
  initParallax();
  initActiveNav();
  initCardSpotlight();

  // Apply persisted language (defaults to PT)
  const saved = localStorage.getItem('artemis_lang') || 'PT';
  applyLanguage(saved);
});

/* ----------------------------------------
   Navbar — transparent → navy on scroll
---------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------
   Mobile menu drawer
---------------------------------------- */
function initMobileMenu() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const close = () => {
    navbar.classList.remove('menu-open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navbar.classList.toggle('menu-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ----------------------------------------
   Language Selector — UI behavior
---------------------------------------- */
function initLanguageSelector() {
  const selector = document.getElementById('langSelector');
  const trigger = document.getElementById('langTrigger');
  const dropdown = document.getElementById('langDropdown');
  if (!selector || !trigger || !dropdown) return;

  const close = () => {
    selector.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = selector.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  dropdown.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      applyLanguage(lang);
      close();
    });
  });

  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ----------------------------------------
   i18n — apply translations to the DOM
---------------------------------------- */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function applyLanguage(lang) {
  const dict = window.ARTEMIS_TRANSLATIONS && window.ARTEMIS_TRANSLATIONS[lang];
  if (!dict) return;

  // 1. document language
  const langCode = (window.ARTEMIS_LANG_CODES && window.ARTEMIS_LANG_CODES[lang]) || 'pt-BR';
  document.documentElement.lang = langCode;

  // 2. document title
  if (dict.meta && dict.meta.title) document.title = dict.meta.title;

  // 3. text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = getNestedValue(dict, el.dataset.i18n);
    if (typeof value === 'string') el.textContent = value;
  });

  // 4. HTML nodes (mixed content like the hero title with <span>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const value = getNestedValue(dict, el.dataset.i18nHtml);
    if (typeof value === 'string') el.innerHTML = value;
  });

  // 5. Counter suffixes that depend on language (e.g. " anos" / " yrs" / " 年")
  document.querySelectorAll('[data-suffix-key]').forEach(el => {
    const suffix = getNestedValue(dict, el.dataset.suffixKey);
    if (typeof suffix !== 'string') return;
    el.dataset.suffix = suffix;
    // If counter has already animated, re-render with the new suffix
    if (el.dataset.counted === '1') {
      const target = parseInt(el.dataset.target, 10) || 0;
      const prefix = el.dataset.prefix || '';
      el.textContent = `${prefix}${target}${suffix}`;
    }
  });

  // 6. Update trigger label and active state in the dropdown
  const currentLabel = document.querySelector('#langTrigger .lang-current');
  if (currentLabel) currentLabel.textContent = lang;
  document.querySelectorAll('#langDropdown button[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // 7. Persist
  try { localStorage.setItem('artemis_lang', lang); } catch (e) { /* ignore */ }
}

/* ----------------------------------------
   Reveal sections on scroll
---------------------------------------- */
function initRevealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
}

/* ----------------------------------------
   Count-up stats
---------------------------------------- */
function initCountUp() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(eased * target);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${prefix}${target}${suffix}`;
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => io.observe(c));
}

/* ----------------------------------------
   Testimonials carousel
---------------------------------------- */
function initTestimonialsCarousel() {
  const track = document.getElementById('carouselTrack');
  const dotsBox = document.getElementById('carouselDots');
  if (!track || !dotsBox) return;

  const slides = track.children;
  const total = slides.length;
  if (total === 0) return;

  let index = 0;
  let timer = null;
  const intervalMs = 5000;

  // build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    dot.addEventListener('click', () => {
      goTo(i);
      restart();
    });
    dotsBox.appendChild(dot);
  }
  const dots = dotsBox.children;

  const goTo = (i) => {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    Array.from(dots).forEach((d, k) => d.classList.toggle('active', k === index));
  };

  const next = () => goTo(index + 1);
  const start = () => { timer = setInterval(next, intervalMs); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const restart = () => { stop(); start(); };

  goTo(0);
  start();

  // pause on hover
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
}

/* ----------------------------------------
   Smooth anchor scrolling with navbar offset
---------------------------------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ----------------------------------------
   Page loader
---------------------------------------- */
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) { document.body.classList.add('loaded'); return; }
  const hide = () => {
    if (loader.classList.contains('hidden')) return;
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    setTimeout(() => loader.remove(), 800);
  };
  // Minimum loader time for the bar animation to be visible
  setTimeout(hide, 750);
  // Safety fallback
  setTimeout(hide, 3000);
}

/* ----------------------------------------
   Scroll progress bar
---------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ----------------------------------------
   Back to top button
---------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 700);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ----------------------------------------
   Parallax — hero & differentials backgrounds
---------------------------------------- */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroBg = document.querySelector('.hero-bg');
  const diffSection = document.querySelector('.differentials');
  const diffBg = document.querySelector('.differentials-bg');

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (heroBg && y < vh * 1.2) {
      heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
    }
    if (diffSection && diffBg) {
      const rect = diffSection.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const offset = (rect.top + rect.height / 2 - vh / 2) * 0.18;
        diffBg.style.transform = `translate3d(0, ${-offset}px, 0)`;
      }
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ----------------------------------------
   Active nav link based on scroll position
---------------------------------------- */
function initActiveNav() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (links.length === 0) return;
  const sections = links
    .map(link => {
      const id = link.getAttribute('href');
      const el = id && id.length > 1 ? document.querySelector(id) : null;
      return el ? { link, el } : null;
    })
    .filter(Boolean);
  if (sections.length === 0) return;

  const update = () => {
    const y = window.scrollY + 140;
    let current = null;
    for (const s of sections) {
      if (s.el.offsetTop <= y) current = s;
    }
    links.forEach(l => l.classList.remove('active'));
    if (current) current.link.classList.add('active');
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ----------------------------------------
   Navbar auto-hide on scroll down / show on scroll up
---------------------------------------- */
function initNavbarHide() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar.classList.contains('menu-open')) { lastY = y; return; }
    const delta = y - lastY;
    if (Math.abs(delta) < 6) return;
    if (y < 120) {
      navbar.classList.remove('nav-hidden');
    } else if (delta > 0) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastY = y;
  }, { passive: true });
}

/* ----------------------------------------
   Mouse-follow spotlight on service cards
---------------------------------------- */
function initCardSpotlight() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });
}

/* ----------------------------------------
   Timeline: observe whole list to draw the line
---------------------------------------- */
function initTimelineLine() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  if (!('IntersectionObserver' in window)) {
    timeline.classList.add('visible');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  io.observe(timeline);
}
