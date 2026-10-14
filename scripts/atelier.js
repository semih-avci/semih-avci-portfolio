'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
  const motionOff = () => reducedMotion.matches || paused;
  const motionButton = document.querySelector('.motion-toggle');
  const applyPreference = () => {
    document.documentElement.dataset.motion = motionOff() ? 'paused' : 'full';
    motionButton?.setAttribute('aria-pressed', String(!motionOff()));
    if (motionButton) {
      motionButton.disabled = reducedMotion.matches;
      motionButton.title = reducedMotion.matches ? 'Réduction des animations activée dans votre système' : 'Activer ou désactiver les animations du portfolio';
    }
    if (motionButton) motionButton.textContent = motionOff() ? 'Animations : désactivées' : 'Animations : activées';
  };
  motionButton?.addEventListener('click', () => {
    paused = !motionOff();
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'full'); } catch {}
    applyPreference();
    document.dispatchEvent(new Event('motionchange'));
  });
  reducedMotion.addEventListener('change', applyPreference);
  applyPreference();
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.site-menu-toggle');
  const menu = document.querySelector('.site-nav-links');
  const shade = document.querySelector('.menu-shade');
  const topButton = document.querySelector('.back-to-top');
  const mobile = matchMedia('(max-width: 1000px)');
  const setMenu = (open, restore = false) => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.classList.toggle('is-open', open);
    shade?.classList.toggle('is-open', open);
    if (restore) toggle.focus();
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  shade?.addEventListener('click', () => setMenu(false, true));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  mobile.addEventListener('change', () => setMenu(false));
  let scrollPending = false;
  const updateScroll = () => {
    nav?.classList.toggle('is-scrolled', scrollY > 25);
    topButton?.classList.toggle('is-visible', scrollY > 600);
    const range = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--read-progress', range > 0 ? Math.min(scrollY / range, 1) : 0);
    scrollPending = false;
  };
  addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();
  topButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: motionOff() ? 'instant' : 'smooth' });
    document.querySelector('#page-content')?.focus({ preventScroll: true });
  });

  // Retained content is visible without JavaScript. Only off-screen blocks animate.
  document.querySelectorAll('.timeline-item, .reveal-card').forEach(el => el.classList.add('visible', 'is-visible'));
  const revealTargets = document.querySelectorAll('[data-reveal], .featured-project-section, .timeline-item, .certification-card, .interest-wrapper, .cyber-card, .case-block');
  let revealObserver;
  if (!motionOff() && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .06, rootMargin: '0px 0px 30px 0px' });
    revealTargets.forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${index % 3 * 70}ms`);
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('motion-reveal', 'is-pending');
        revealObserver.observe(el);
      }
    });
  }

  // Make the existing checkbox/radio controls keyboard-operable.
  let returnFocus = null;
  document.querySelectorAll('label[for]').forEach(label => {
    const input = document.getElementById(label.htmlFor);
    if (!input) return;
    label.setAttribute('tabindex', '0');
    label.setAttribute('role', 'button');
    if (label.matches('.modal-close-area,.overlay')) {
      label.setAttribute('tabindex', '-1');
      label.setAttribute('aria-label', 'Fermer les détails');
    } else if (label.matches('.close-modal,.close-icon,.close-btn')) {
      label.setAttribute('aria-label', 'Fermer les détails');
    }
    label.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); label.click(); }
    });
    label.addEventListener('click', () => {
      if (!input.checked) returnFocus = label;
    });
  });
  document.querySelectorAll('.fill[data-width]').forEach(fill => { fill.style.width = fill.dataset.width; });
  document.querySelectorAll('.work-tile, .expertise-card, .featured-card, .identity-card, .contact-card, .cyber-card, .portrait-card').forEach(card => {
    let pointerFrame = 0;
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || motionOff()) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
        card.style.setProperty('--spot-alpha', '.14');
        card.style.setProperty('--tilt-x', `${-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 5}deg`);
        card.style.setProperty('--tilt-y', `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 7}deg`);
        card.classList.add('is-tilting');
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame);
      card.style.setProperty('--spot-alpha', '0');
      card.classList.remove('is-tilting');
    });
  });
  const activeDialog = () => {
    const candidates = document.querySelectorAll('.modal-overlay, .side-panel');
    return [...candidates].find(el => getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).opacity !== '0' && getComputedStyle(el).display !== 'none');
  };
  document.querySelectorAll('.modal-toggle, .timeline-item input[type=checkbox]').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) requestAnimationFrame(() => {
        const sibling = input.nextElementSibling;
        const dialog = sibling?.matches('.modal-overlay') ? sibling : input.parentElement.querySelector('.modal-overlay, .side-panel');
        if (!dialog) return;
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        const heading = dialog.querySelector('h2,h3');
        if (heading) dialog.setAttribute('aria-label', heading.textContent.trim());
        dialog.querySelector('[tabindex="0"],a,button')?.focus();
      });
      else returnFocus?.focus();
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setMenu(false);
      const dialog = activeDialog();
      if (dialog) {
        document.querySelectorAll('.modal-toggle:checked, .timeline-item input[type=checkbox]:checked').forEach(input => { input.checked = false; });
        returnFocus?.focus();
      } else if (mobile.matches) toggle?.focus();
    }
    if (event.key !== 'Tab') return;
    const scope = activeDialog() || (mobile.matches && toggle?.getAttribute('aria-expanded') === 'true' ? nav : null);
    if (!scope) return;
    const focusable = [...scope.querySelectorAll('a,button,[tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });

  document.querySelectorAll('[data-copy]').forEach(item => {
    item.setAttribute('role', 'button'); item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'Copier l’adresse e-mail');
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); item.click(); }
    });
    item.addEventListener('click', async () => {
      const tooltip = item.querySelector('.copy-tooltip');
      try {
        await navigator.clipboard.writeText(item.dataset.copy);
        if (tooltip) { tooltip.textContent = 'Copié !'; tooltip.setAttribute('role', 'status'); tooltip.classList.add('active'); }
      } catch {
        if (tooltip) { tooltip.textContent = 'Copiez l’adresse affichée'; tooltip.classList.add('active'); }
      }
      setTimeout(() => tooltip?.classList.remove('active'), 2500);
    });
  });

  const glow = document.querySelector('.cursor-glow');
  let glowFrame = 0;
  addEventListener('pointermove', event => {
    if (!glow || !finePointer.matches || motionOff()) return;
    cancelAnimationFrame(glowFrame);
    glowFrame = requestAnimationFrame(() => {
      glow.style.transform = `translate3d(${event.clientX - 220}px, ${event.clientY - 220}px, 0)`;
      glow.style.opacity = '1';
    });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { if (glow) glow.style.opacity = '0'; });
  document.querySelectorAll('.action-primary').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (!finePointer.matches || motionOff()) return;
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .055}px, ${(event.clientY - rect.top - rect.height / 2) * .1}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
  document.addEventListener('motionchange', () => {
    if (motionOff()) {
      revealObserver?.disconnect();
      document.querySelectorAll('.is-pending').forEach(el => el.classList.remove('is-pending'));
      document.querySelectorAll('.is-tilting').forEach(el => el.classList.remove('is-tilting'));
    }
  });

  // Small, capped particle field. No animation loop on touch devices or hidden tabs.
  const canvas = document.querySelector('.site-dust');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;
  let particles = [], frame = 0, previous = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: Math.min(48, Math.floor(innerWidth * innerHeight / 22000)) }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      radius: .4 + Math.random() * .9, speed: 5 + Math.random() * 9, alpha: .12 + Math.random() * .3
    }));
    if (!frame) draw(0);
  };
  const draw = delta => {
    context.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(particle => {
      particle.y -= particle.speed * delta;
      if (particle.y < 0) particle.y = innerHeight;
      context.beginPath(); context.fillStyle = `rgba(229,193,110,${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); context.fill();
    });
    if (!motionOff() && finePointer.matches) particles.forEach((a, index) => {
      particles.slice(index + 1).forEach(b => {
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > 170) return;
        context.strokeStyle = `rgba(229,193,110,${(1 - distance / 170) * .16})`;
        context.lineWidth = .6;
        context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        const t = (previous / 5000 + index * .13) % 1;
        context.fillStyle = `rgba(229,193,110,${(1 - distance / 170) * .65})`;
        context.beginPath(); context.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 1.4, 0, Math.PI * 2); context.fill();
      });
    });
  };
  const tick = time => {
    if (time - previous >= 32) { draw(Math.min((time - previous) / 1000, .1)); previous = time; }
    frame = requestAnimationFrame(tick);
  };
  const syncMotion = () => {
    cancelAnimationFrame(frame); frame = 0; previous = performance.now();
    if (!document.hidden && !motionOff() && finePointer.matches) frame = requestAnimationFrame(tick);
    else draw(0);
    if (motionOff()) {
      revealObserver?.disconnect();
      document.querySelectorAll('.motion-reveal').forEach(el => el.classList.remove('is-pending'));
    }
  };
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
    syncMotion();
  });
  document.addEventListener('motionchange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion); finePointer.addEventListener('change', syncMotion);
  resize(); syncMotion();
});
