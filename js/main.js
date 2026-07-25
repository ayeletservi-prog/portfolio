/* ============================================================
   NAVIGATION — scrolled state + mobile toggle
   ============================================================ */
const header    = document.getElementById('site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.getElementById('nav-menu');
const navLinks  = document.querySelectorAll('.nav-link');
const navSections = [...document.querySelectorAll('section[id]')];
const lastNavLink  = document.getElementById('contact') ? navLinks[navLinks.length - 1] : null;

function updateActiveNavLink() {
  // Which section currently sits under a fixed line just below the nav bar —
  // geometric, so it's correct regardless of viewport height or section length
  // (a percentage-based band breaks down whenever a section is short relative
  // to a tall viewport).
  const lineY = 100;
  let current = navSections.find(sec => {
    const rect = sec.getBoundingClientRect();
    return rect.top <= lineY && rect.bottom > lineY;
  });

  // Fallback: on tall/short-content viewports the scroll range can run out
  // before the line ever reaches the last section, so treat "scrolled to the
  // bottom of the page" as that section being current.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom && lastNavLink) {
    navLinks.forEach(link => link.classList.toggle('active', link === lastNavLink));
    return;
  }

  navLinks.forEach(link => {
    link.classList.toggle('active', !!current && link.getAttribute('href') === `#${current.id}`);
  });
}

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNavLink();
}, { passive: true });

updateActiveNavLink();

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu?.classList.toggle('open', !expanded);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navMenu?.classList.contains('open') &&
    !navMenu.contains(e.target) &&
    !navToggle?.contains(e.target)
  ) {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});


/* ============================================================
   SCROLL REVEAL — elements with class "reveal"
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ============================================================
   FOOTER YEAR
   ============================================================ */
document.querySelectorAll('#footer-year, .footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
