// GREENSHACK — shared behaviour across all pages
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- mobile nav ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('is-open')));
  }

  /* ---- nav background on scroll ---- */
  const nav = document.querySelector('.site-nav');
  const onScroll = () => { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- scatter leaves inside any .leaf-field ---- */
  const leafSVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6 2 3 8 3 13c0 5 4 9 9 9s9-4 9-9c0-5-3-11-9-11Z" fill="currentColor" opacity="0.9"/>
      <path d="M12 4v16" stroke="#1B3A2B" stroke-width="0.6" opacity="0.4"/>
    </svg>`;
  document.querySelectorAll('.leaf-field').forEach((field) => {
    const count = 7;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'leaf';
      el.innerHTML = leafSVG;
      const size = 20 + Math.random() * 26;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = (Math.random() * 96) + '%';
      el.style.top = (Math.random() * 90) + '%';
      el.style.setProperty('--r', (Math.random() * 40 - 20) + 'deg');
      el.style.animationDelay = (Math.random() * 6) + 's';
      el.style.animationDuration = (7 + Math.random() * 5) + 's';
      field.appendChild(el);
    }
  });

  /* ---- scroll reveal + hero load-in via GSAP ---- */
  if (window.gsap && !reduceMotion) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    const heroEls = document.querySelectorAll('.hero-reveal');
    if (heroEls.length) {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(heroEls, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 });
    }
  } else {
    document.querySelectorAll('.reveal, .hero-reveal').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }

  /* ---- stat numbers count up when they scroll into view ---- */
  const statEls = document.querySelectorAll('.stat b');
  if (statEls.length && !reduceMotion) {
    const animateCount = (el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^(\D*)(\d+)(\D*)$/);
      if (!match) return;
      const [, prefix, numStr, suffix] = match;
      const target = parseInt(numStr, 10);
      const duration = 1100;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${Math.round(eased * target)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = raw;
      };
      requestAnimationFrame(step);
    };
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    statEls.forEach((el) => statObserver.observe(el));
  }

  /* ---- floating CTA appears once you've scrolled past the header ---- */
  const floatingCta = document.querySelector('.floating-cta');
  if (floatingCta) {
    const headerEl = document.querySelector('.hero, .page-header');
    const toggleCta = () => {
      const threshold = headerEl ? headerEl.offsetHeight * 0.6 : 420;
      floatingCta.classList.toggle('is-visible', window.scrollY > threshold);
    };
    window.addEventListener('scroll', toggleCta, { passive: true });
    toggleCta();
  }
});
