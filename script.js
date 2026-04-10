/* ================================================
   ARTEMIS CONSULTING — Vanilla JS interactions
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initLanguageSelector();
  initRevealOnScroll();
  initCountUp();
  initTestimonialsCarousel();
  initSmoothAnchors();

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
