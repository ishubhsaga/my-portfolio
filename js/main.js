// main.js — Rebuilt: fixed hero flicker, hamburger menu, all original features
// Preloader, scroll progress, sticky nav blur, sliding ink, typewriter,
// rotating word, count-up stats, mouse spotlight, scroll reveal, smooth scroll.

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Preloader
  ------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    if (reducedMotion) {
      preloader.classList.add('is-removed');
    } else {
      const finishPreload = () => {
        preloader.classList.add('is-done');
        setTimeout(() => {
          preloader.classList.add('is-removed');
          preloader.setAttribute('aria-hidden', 'true');
        }, 700);
      };
      if (document.readyState === 'complete') {
        setTimeout(finishPreload, 400);
      } else {
        window.addEventListener('load', () => setTimeout(finishPreload, 300));
        setTimeout(finishPreload, 2500);
      }
    }
  }

  /* ------------------------------------------------------------------
     Typewriter
  ------------------------------------------------------------------ */
  const terminalText = document.getElementById('terminal-text');
  if (terminalText) {
    const fullText = 'whoami → frontend developer, building real products';
    if (reducedMotion) {
      terminalText.textContent = fullText;
    } else {
      let i = 0;
      const typeNext = () => {
        if (i < fullText.length) {
          terminalText.textContent += fullText.charAt(i++);
          setTimeout(typeNext, 35);
        }
      };
      setTimeout(typeNext, 600);
    }
  }

  /* ------------------------------------------------------------------
     Rotating word
  ------------------------------------------------------------------ */
  const rotatorWord = document.getElementById('rotatorWord');
  if (rotatorWord && !reducedMotion) {
    const phrases = [
      'AI medical imaging tools',
      'open-source UI controls',
      'internal product platforms',
      'responsive, user-first interfaces',
    ];
    let index = 0;
    setInterval(() => {
      index = (index + 1) % phrases.length;
      rotatorWord.style.opacity = '0';
      setTimeout(() => {
        rotatorWord.textContent = phrases[index];
        rotatorWord.style.opacity = '1';
      }, 250);
    }, 2600);
    rotatorWord.style.transition = 'opacity 250ms ease';
  }

  /* ------------------------------------------------------------------
     Hero mouse spotlight
  ------------------------------------------------------------------ */
  const hero = document.getElementById('hero');
  const spotlight = document.getElementById('heroSpotlight');
  if (hero && spotlight && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mouseenter', () => spotlight.classList.add('is-active'));
    hero.addEventListener('mouseleave', () => spotlight.classList.remove('is-active'));
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      spotlight.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  }

  /* ------------------------------------------------------------------
     Count-up stats
  ------------------------------------------------------------------ */
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (reducedMotion) { el.textContent = target + suffix; return; }
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statEls = document.querySelectorAll('.stat__num');
  if (statEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    statEls.forEach((el) => obs.observe(el));
  } else {
    statEls.forEach(animateCount);
  }

  /* ------------------------------------------------------------------
     Broken image fallback
  ------------------------------------------------------------------ */
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => img.classList.add('error'));
  });

  /* ------------------------------------------------------------------
     Scroll: progress bar + header blur + scroll cue
     NOTE: hero no longer uses sticky/collapse — simpler, no flicker
  ------------------------------------------------------------------ */
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.querySelector('.site-header');
  const heroScrollCue = document.getElementById('heroScrollCue');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollProgress && docHeight > 0) {
      scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;
    }
    if (siteHeader) {
      siteHeader.classList.toggle('is-scrolled', scrollTop > 20);
    }
    if (heroScrollCue) {
      heroScrollCue.classList.toggle('is-hidden', scrollTop > 80);
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------
     Scroll reveal: sections + [data-reveal] children (staggered)
  ------------------------------------------------------------------ */
  if ('IntersectionObserver' in window && !reducedMotion) {
    // Section-level
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          sectionObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section--reveal').forEach((el) => sectionObs.observe(el));

    // Item-level [data-reveal]
    const itemObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // stagger siblings inside same parent
          const siblings = Array.from(entry.target.closest('.container, .tl-wrap, .about-grid, .skills-grid, .projects-grid, .about-body') || document.body)
            .filter ? [] : [];
          entry.target.classList.add('reveal--visible');
          itemObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    // Stagger items grouped by parent
    const revealGroups = document.querySelectorAll(
      '.tl-wrap, .about-body, .skills-grid, .projects-grid, .about-grid, .contact-inner'
    );
    revealGroups.forEach((group) => {
      const items = group.querySelectorAll('[data-reveal]');
      const groupObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('reveal--visible'), i * 80);
            });
            groupObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      groupObs.observe(group);
    });

    // Remaining [data-reveal] (section heads, etc.)
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (!el.classList.contains('reveal--visible')) {
        itemObs.observe(el);
      }
    });
  } else {
    document.querySelectorAll('.section--reveal, [data-reveal]').forEach((el) => {
      el.classList.add('reveal--visible');
    });
  }

  /* ------------------------------------------------------------------
     Lenis smooth scroll (same library Sumit uses)
     Falls back gracefully if Lenis hasn't loaded yet
  ------------------------------------------------------------------ */
  let lenis = null;

  const initLenis = () => {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // Let GSAP ScrollTrigger know about Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  };

  // Wait for scripts to load then init
  window.addEventListener('load', initLenis);
  // Also try immediately in case already loaded
  if (document.readyState === 'complete') initLenis();

  /* ------------------------------------------------------------------
     Curtain transition — fires when a nav link is clicked
     Two vertical bars sweep down then up, revealing the new section
  ------------------------------------------------------------------ */
  // Build the curtain overlay once
  const curtain = document.createElement('div');
  curtain.id = 'nav-curtain';
  curtain.innerHTML = '<span></span><span></span>';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.style.cssText = `
    position: fixed; inset: 0; z-index: 400;
    display: flex; pointer-events: none;
  `;
  curtain.querySelectorAll('span').forEach((s) => {
    s.style.cssText = `
      flex: 1; height: 100%;
      background: linear-gradient(160deg, #1a0a3a, #0d0d1a);
      transform: scaleY(0); transform-origin: top;
      transition: transform 0.52s cubic-bezier(0.76, 0, 0.24, 1);
    `;
  });
  curtain.querySelectorAll('span')[1].style.transitionDelay = '0.06s';
  document.body.appendChild(curtain);

  let isCurtainBusy = false;

  const runCurtainTo = (targetEl) => {
    if (isCurtainBusy || reducedMotion) {
      // Fallback: just scroll smoothly
      if (lenis) lenis.scrollTo(targetEl, { offset: 0, duration: 1.4 });
      else targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    isCurtainBusy = true;
    const spans = curtain.querySelectorAll('span');

    // Phase 1: curtain sweeps DOWN (origin: top → scaleY 0→1)
    spans.forEach((s) => {
      s.style.transformOrigin = 'top';
      s.style.transform = 'scaleY(0)';
    });
    // Force reflow
    curtain.getBoundingClientRect();

    spans.forEach((s) => { s.style.transform = 'scaleY(1)'; });

    // When covered: scroll instantly then sweep UP
    setTimeout(() => {
      // Scroll to target (no animation — screen is covered)
      if (lenis) lenis.scrollTo(targetEl, { immediate: true });
      else window.scrollTo({ top: targetEl.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });

      // Phase 2: curtain sweeps UP (origin: bottom → scaleY 1→0)
      setTimeout(() => {
        spans.forEach((s) => {
          s.style.transformOrigin = 'bottom';
          s.style.transform = 'scaleY(0)';
        });
        setTimeout(() => { isCurtainBusy = false; }, 600);
      }, 80);
    }, 560); // wait for curtain to fully close
  };

  /* ------------------------------------------------------------------
     Smooth scroll for in-page links — now uses curtain
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          closeMobileNav();
          runCurtainTo(target);
        }
      }
    });
  });

  /* ------------------------------------------------------------------
     Active nav state + sliding ink underline
  ------------------------------------------------------------------ */
  const navList = document.getElementById('navList');
  const navInk = document.getElementById('navInk');
  const navLinks = document.querySelectorAll('.nav__list a[href^="#"]');
  const sections = Array.from(navLinks)
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const moveInkTo = (link) => {
    if (!navInk || !navList || !link) return;
    const listRect = navList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    navInk.style.width = `${linkRect.width}px`;
    navInk.style.transform = `translateX(${linkRect.left - listRect.left}px)`;
    navInk.classList.add('is-visible');
  };

  if (sections.length && 'IntersectionObserver' in window) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            const active = link.getAttribute('href') === id;
            link.classList.toggle('is-active', active);
            if (active) moveInkTo(link);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => navObs.observe(s));
  }
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav__list a.is-active');
    if (active) moveInkTo(active);
  });

  /* ------------------------------------------------------------------
     Mobile hamburger nav
  ------------------------------------------------------------------ */
  const burger = document.getElementById('navBurger');
  const siteNav = document.getElementById('siteNav');
  const navOverlay = document.getElementById('navOverlay');

  const openMobileNav = () => {
    siteNav.classList.add('is-open');
    navOverlay.classList.add('is-open');
    navOverlay.removeAttribute('aria-hidden');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMobileNav = () => {
    siteNav.classList.remove('is-open');
    navOverlay.classList.remove('is-open');
    navOverlay.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (burger && siteNav && navOverlay) {
    burger.addEventListener('click', () => {
      burger.getAttribute('aria-expanded') === 'true' ? closeMobileNav() : openMobileNav();
    });
    navOverlay.addEventListener('click', closeMobileNav);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }
});
