// ── Nav scroll effect ──────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile menu ────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Active nav link on scroll ──────────────────────
const sections   = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-60px 0px 0px 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ── Scroll reveal ──────────────────────────────────
function applyReveal(el, className) {
  el.classList.add(className);
}

const cards        = document.querySelectorAll('.servico-card');
const depCards     = document.querySelectorAll('.depoimento-card');
const sobreText    = document.querySelector('.sobre__text');
const sobreImg     = document.querySelector('.sobre__img-wrap');
const abText       = document.querySelector('.abordagem__text');
const abQuote      = document.querySelector('.abordagem__quote-wrap');
const agInfo       = document.querySelector('.agendamento__info');
const agForm       = document.querySelector('.agendamento__form');
const numerosItems = document.querySelectorAll('.numeros__item');

sobreImg  && applyReveal(sobreImg,  'reveal-left');
sobreText && applyReveal(sobreText, 'reveal-right');
abText    && applyReveal(abText,    'reveal-left');
abQuote   && applyReveal(abQuote,   'reveal-right');
agInfo    && applyReveal(agInfo,    'reveal-left');
agForm    && applyReveal(agForm,    'reveal-right');

cards.forEach((c, i) => {
  c.classList.add('reveal');
  c.style.transitionDelay = `${i * 0.07}s`;
});
depCards.forEach((c, i) => {
  c.classList.add('reveal');
  c.style.transitionDelay = `${i * 0.1}s`;
});
numerosItems.forEach((n, i) => {
  n.classList.add('reveal');
  n.style.transitionDelay = `${i * 0.08}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale'
).forEach(el => revealObserver.observe(el));

// ── Animated counters ──────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCounter(el) {
  const target  = parseInt(el.dataset.count, 10);
  const prefix  = el.dataset.prefix || '';
  const suffix  = el.dataset.suffix || '';
  if (prefersReducedMotion) { el.textContent = prefix + target + suffix; return; }
  const duration = 1600;
  const start    = performance.now();

  function step(now) {
    const elapsed  = Math.min(now - start, duration);
    const progress = elapsed / duration;
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// ── Hero parallax orbs (desativa em mobile e reduced-motion) ─
const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const enableParallax = !prefersReducedMotion && !isMobile;

if (enableParallax) {
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  const orb3 = document.querySelector('.hero__orb--3');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (orb1) orb1.style.transform = `translateY(${y * 0.25}px)`;
        if (orb2) orb2.style.transform = `translateY(${-y * 0.15}px)`;
        if (orb3) orb3.style.transform = `translateY(${y * 0.1}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── FAB WhatsApp: aparece após scroll do hero ──────
const fab = document.querySelector('.fab-whatsapp');
if (fab) {
  const heroEl = document.getElementById('inicio');
  const fabObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      fab.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0.15 });
  if (heroEl) fabObserver.observe(heroEl);
}

// ── Toast helper ───────────────────────────────────
function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

// ── Contact form ───────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  const original = btn.innerHTML;
  btn.innerHTML = '<span>Enviando...</span>';
  setTimeout(() => {
    showToast('Mensagem enviada! Em breve entrarei em contato.');
    e.target.reset();
    btn.disabled = false;
    btn.innerHTML = original;
  }, 1400);
});

// ── Smooth hover tilt em service cards (desktop apenas) ──
if (!isCoarsePointer && !prefersReducedMotion) {
  document.querySelectorAll('.servico-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
      card.style.transform = `translateY(-6px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all .5s cubic-bezier(.4,0,.2,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}
