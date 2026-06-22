(function () {
  'use strict';

  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');
  const bcCurrent = document.getElementById('bc-current');
  const pages     = document.querySelectorAll('.page');
  const phaseBtns = document.querySelectorAll('.phase-btn:not(.locked)');

  /* ── Page switching ───────────────────────────────────────── */
  function showPage(id) {
    // Swap visible page
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Breadcrumb label
    const btn = document.querySelector(`.phase-btn[data-page="${id}"]`);
    if (bcCurrent) {
      bcCurrent.textContent = btn
        ? btn.querySelector('.phase-name').textContent
        : 'Roadmap';
    }

    // Sidebar active state
    phaseBtns.forEach(b => b.classList.remove('active', 'open'));
    if (btn) btn.classList.add('active', 'open');

    // Expand lesson sub-nav for this phase
    document.querySelectorAll('.lesson-nav').forEach(n => n.classList.remove('open'));
    const nav = document.getElementById('lessons-' + id);
    if (nav) nav.classList.add('open');

    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ── Sidebar phase buttons ────────────────────────────────── */
  phaseBtns.forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });

  /* ── Roadmap phase cards ──────────────────────────────────── */
  document.querySelectorAll('.phase-card[data-page]').forEach(card => {
    card.addEventListener('click', () => showPage(card.dataset.page));
  });

  /* ── Mobile sidebar ───────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  overlay.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  /* ── Scroll spy: highlight active lesson in sidebar ──────── */
  const lessonEls   = document.querySelectorAll('article.lesson[id]');
  const lessonLinks = document.querySelectorAll('.lesson-link');

  if (lessonEls.length && lessonLinks.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const href = '#' + entry.target.id;
          lessonLinks.forEach(a =>
            a.classList.toggle('active', a.getAttribute('href') === href)
          );
        }
      });
    }, { rootMargin: '-80px 0px -55% 0px' });

    lessonEls.forEach(el => io.observe(el));
  }

  /* ── Smooth scroll for lesson links ──────────────────────── */
  lessonLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── Syntax highlighting ──────────────────────────────────── */
  document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));

})();
