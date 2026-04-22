/* ================================================
   ARTEMIS SOLUTIONS — Vanilla JS interactions
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
  initHero3D();
  initTilt3D();
  initMagneticButtons();
  initHeroMouseParallax();
  initContactForm();

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

  // 4. Placeholder attributes (form inputs/textarea)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const value = getNestedValue(dict, el.dataset.i18nPlaceholder);
    if (typeof value === 'string') el.setAttribute('placeholder', value);
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
   Hero 3D — Three.js wireframe globe with
   Brazil ↔ China connection arc + particles
---------------------------------------- */
function initHero3D() {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;
  if (typeof THREE === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    hero.clientWidth / hero.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  const world = new THREE.Group();
  scene.add(world);

  const GOLD = 0xC9A84C;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 40, 28),
    new THREE.MeshBasicMaterial({
      color: GOLD,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
  );
  world.add(sphere);

  const shellGeom = new THREE.SphereGeometry(1.6, 36, 24);
  const shell = new THREE.Points(
    shellGeom,
    new THREE.PointsMaterial({
      color: GOLD,
      size: 0.028,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    })
  );
  world.add(shell);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.95, 2.0, 96),
    new THREE.MeshBasicMaterial({
      color: GOLD,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  ring.rotation.x = Math.PI / 2.4;
  world.add(ring);

  const latLngToVec3 = (lat, lng, r) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  };

  const brPos = latLngToVec3(-23.55, -46.63, 1.55);
  const cnPos = latLngToVec3(31.23, 121.47, 1.55);

  const markerMat = new THREE.MeshBasicMaterial({ color: GOLD });
  const markerGeo = new THREE.SphereGeometry(0.05, 16, 16);

  const brMarker = new THREE.Mesh(markerGeo, markerMat);
  brMarker.position.copy(brPos);
  world.add(brMarker);

  const cnMarker = new THREE.Mesh(markerGeo, markerMat);
  cnMarker.position.copy(cnPos);
  world.add(cnMarker);

  const haloGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const brHalo = new THREE.Mesh(
    haloGeo,
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.5 })
  );
  brHalo.position.copy(brPos);
  world.add(brHalo);
  const cnHalo = new THREE.Mesh(
    haloGeo,
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.5 })
  );
  cnHalo.position.copy(cnPos);
  world.add(cnHalo);

  const midPoint = brPos.clone().add(cnPos).multiplyScalar(0.5);
  const arcHeight = 1.2 + midPoint.length() * 0.4;
  midPoint.normalize().multiplyScalar(arcHeight + 1.55);

  const arcCurve = new THREE.QuadraticBezierCurve3(brPos, midPoint, cnPos);
  const arcGeom = new THREE.TubeGeometry(arcCurve, 80, 0.018, 8, false);
  const arc = new THREE.Mesh(
    arcGeom,
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.95 })
  );
  world.add(arc);

  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  world.add(pulse);

  const particleCount = 160;
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.8 + Math.random() * 2.2;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pPositions[i * 3]     = r * Math.sin(ph) * Math.cos(th);
    pPositions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pPositions[i * 3 + 2] = r * Math.cos(ph) * 0.6;
  }
  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const particles = new THREE.Points(
    particleGeom,
    new THREE.PointsMaterial({
      color: GOLD,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
  );
  scene.add(particles);

  const resize = () => {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  }, { passive: true });

  let inView = true;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { inView = e.isIntersecting; }),
      { threshold: 0 }
    );
    io.observe(hero);
  }

  const clock = new THREE.Clock();
  let t = 0;

  const animate = () => {
    requestAnimationFrame(animate);
    if (!inView) return;

    const dt = clock.getDelta();
    t += dt;

    world.rotation.y += dt * 0.18;
    world.rotation.x = Math.sin(t * 0.25) * 0.08;

    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;
    camera.position.x = curX * 1.2;
    camera.position.y = -curY * 1.0;
    camera.lookAt(0, 0, 0);

    const pulseScale = 1 + Math.sin(t * 2.2) * 0.45;
    brHalo.scale.setScalar(pulseScale);
    cnHalo.scale.setScalar(pulseScale);
    brHalo.material.opacity = 0.5 - Math.sin(t * 2.2) * 0.3;
    cnHalo.material.opacity = 0.5 - Math.sin(t * 2.2) * 0.3;

    const tt = (Math.sin(t * 0.9) * 0.5 + 0.5);
    const pt = arcCurve.getPoint(tt);
    pulse.position.copy(pt);

    particles.rotation.y += dt * 0.04;
    particles.rotation.x += dt * 0.015;

    shell.material.opacity = 0.55 + Math.sin(t * 1.4) * 0.15;

    renderer.render(scene, camera);
  };
  animate();
}

/* ----------------------------------------
   3D tilt — mouse-reactive perspective
---------------------------------------- */
function initTilt3D() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const configs = [
    { sel: '.service-card', max: 8 },
    { sel: '.why-card',     max: 6 },
    { sel: '.diff-item',    max: 5 },
    { sel: '.testimonial-card', max: 4 },
  ];

  configs.forEach(({ sel, max }) => {
    document.querySelectorAll(sel).forEach(card => {
      let raf = null;
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top)  / rect.height;
        const rx = (0.5 - y) * max;
        const ry = (x - 0.5) * max;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
          card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        });
      };
      const onEnter = () => card.classList.add('tilt-active');
      const onLeave = () => {
        card.classList.remove('tilt-active');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  });
}

/* ----------------------------------------
   Magnetic buttons — primary CTAs follow cursor
---------------------------------------- */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-navy');
  buttons.forEach(btn => {
    const strength = 0.35;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px) translateZ(0)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ----------------------------------------
   Hero content — gentle mouse parallax
---------------------------------------- */
function initHeroMouseParallax() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const content = document.querySelector('.hero-content');
  if (!hero || !content) return;

  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;
  let ticking = false;

  const update = () => {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    content.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
      requestAnimationFrame(update);
    } else {
      ticking = false;
    }
  };

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 18;
    targetY = y * 12;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  });
}

/* ----------------------------------------
   Contact form — AJAX submit to Formsubmit.co
---------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  const submitBtn = document.getElementById('contactSubmit');
  if (!form || !status || !submitBtn) return;

  const getDict = () => {
    const lang = localStorage.getItem('artemis_lang') || 'PT';
    return (window.ARTEMIS_TRANSLATIONS && window.ARTEMIS_TRANSLATIONS[lang]) || {};
  };
  const t = (path, fallback) => {
    const parts = path.split('.');
    let cur = getDict();
    for (const p of parts) {
      if (cur == null) return fallback;
      cur = cur[p];
    }
    return (typeof cur === 'string') ? cur : fallback;
  };

  const clearStatus = () => {
    status.className = 'form-status';
    status.textContent = '';
  };

  const showStatus = (type, message) => {
    status.className = `form-status is-${type}`;
    status.textContent = message;
  };

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-field')?.classList.remove('is-invalid');
      if (status.classList.contains('is-error')) clearStatus();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot — silently succeed if filled (bots)
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim() !== '') return;

    // Native validation
    let firstInvalid = null;
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
      const wrap = field.closest('.form-field');
      if (!field.checkValidity()) {
        wrap?.classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = field;
      } else {
        wrap?.classList.remove('is-invalid');
      }
    });
    if (firstInvalid) {
      showStatus('error', t('contact.errorValidation', 'Por favor, preencha os campos obrigatórios corretamente.'));
      firstInvalid.focus();
      return;
    }

    // Build JSON payload for Formsubmit AJAX endpoint
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => { payload[key] = value; });

    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    clearStatus();

    try {
      const res = await fetch('https://formsubmit.co/ajax/perluizhenrique@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success === 'true' || data.success === true)) {
        showStatus('success', t('contact.success', 'Mensagem enviada! Nossa equipe entra em contato em breve.'));
        form.reset();
      } else {
        showStatus('error', t('contact.error', 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.'));
      }
    } catch (err) {
      showStatus('error', t('contact.error', 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.'));
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
    }
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
