import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotion(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector<HTMLElement>('#progress');
  const controls = new AbortController();

  document.querySelectorAll<HTMLButtonElement>('[data-access-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const windowPanel = button.closest<HTMLElement>('.access-window');
      const status = windowPanel?.querySelector<HTMLElement>('.access-status');
      const active = windowPanel?.classList.toggle('access-ready') ?? false;
      button.setAttribute('aria-pressed', String(active));
      button.firstChild!.textContent = active ? 'Keyboard mode active' : 'Activate keyboard mode';
      if (status) status.textContent = active ? 'KEYBOARD MODE · focus order visible' : 'READY · choose your way in';
    }, { signal: controls.signal });
  });

  if (reduced) {
    window.addEventListener('pagehide', () => controls.abort(), { once: true });
    return;
  }

  if (progress) {
    gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.2 } });
  }

  const context = gsap.context(() => {
    const heroArt = document.querySelector<HTMLElement>('.hero-art');
    const heroCopy = document.querySelector<HTMLElement>('.hero-copy');
    if (heroArt && heroCopy) {
      gsap.to(heroArt, { yPercent: 24, scale: 0.74, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 } });
      gsap.to(heroCopy, { yPercent: -17, opacity: 0.24, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 } });
    }
    gsap.fromTo('.system.left', { x: -72, opacity: 0.35, scale: 0.82 }, { x: 0, opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: '.system-field', start: 'top 85%', end: 'center 52%', scrub: 0.7 } });
    gsap.fromTo('.system.right', { x: 72, opacity: 0.35, scale: 0.82 }, { x: 0, opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: '.system-field', start: 'top 85%', end: 'center 52%', scrub: 0.7 } });
    gsap.from('.detail-row', { x: 26, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.detail-list', start: 'top 80%', once: true } });
    const roadmap = document.querySelector<HTMLElement>('.roadmap');
    if (roadmap) {
      const roadmapSteps = roadmap.querySelectorAll<HTMLElement>('.roadmap-step');
      gsap.from(roadmapSteps, { y: 22, opacity: 0, stagger: 0.09, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: roadmap, start: 'top 78%', once: true } });
    }
    gsap.to('.final:before', { scale: 1.12, rotate: 28, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

    const hero = document.querySelector<HTMLElement>('.hero');
    const art = document.querySelector<HTMLElement>('.hero-art');
    if (hero && art && window.matchMedia('(pointer:fine)').matches) {
      const xTo = gsap.quickTo(art, 'x', { duration: 0.8, ease: 'power3.out' });
      const yTo = gsap.quickTo(art, 'y', { duration: 0.8, ease: 'power3.out' });
      hero.addEventListener('pointermove', (event: PointerEvent) => {
        const bounds = hero.getBoundingClientRect();
        xTo((event.clientX - bounds.left - bounds.width / 2) * 0.025);
        yTo((event.clientY - bounds.top - bounds.height / 2) * 0.025);
      }, { passive: true, signal: controls.signal });
    }

    const journeyRoot = document.querySelector<HTMLElement>('#trackJourney');
    const rail = journeyRoot?.querySelector<HTMLElement>('.journey-rail');
    const panels = journeyRoot ? Array.from(journeyRoot.querySelectorAll<HTMLElement>('.journey-panel')) : [];
    const indexLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-track-jump]'));
    if (journeyRoot && rail && panels.length > 1) {
      const media = gsap.matchMedia();
      media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
        const navigationControls = new AbortController();
        journeyRoot.classList.add('journey-enabled');
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: 'track-journey', trigger: journeyRoot, start: 'top top',
            end: () => `+=${window.innerWidth * (panels.length - 1)}`,
            pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)));
              indexLinks.forEach((link, linkIndex) => {
                if (linkIndex === active) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
              });
            },
          },
        });
        timeline.to(rail, { xPercent: -((panels.length - 1) / panels.length) * 100, ease: 'none', duration: panels.length - 1 }, 0);

        panels.forEach((panel, index) => {
          const at = index * (panels.length - 1) / panels.length;
          const visual = panel.querySelector<HTMLElement>('.journey-visual');
          const title = panel.querySelector<HTMLElement>('.journey-title');
          const description = panel.querySelector<HTMLElement>('.track-brief');
          if (visual) timeline.from(visual, { y: 26, scale: 0.94, opacity: 0.45, duration: 0.42, ease: 'power2.out' }, at + 0.08);
          if (title) timeline.from(title, { y: 32, opacity: 0, duration: 0.34, ease: 'power3.out' }, at + 0.12);
          if (description) timeline.from(description, { y: 18, opacity: 0, duration: 0.3, ease: 'power2.out' }, at + 0.24);

          if (panel.dataset.track === '01') {
            const link = panel.querySelector<SVGPathElement>('.cross-link');
            if (link) timeline.fromTo(link, { strokeDasharray: 440, strokeDashoffset: 440 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power1.out' }, at + 0.18);
            const core = panel.querySelector<SVGCircleElement>('.cross-core');
            if (core) timeline.fromTo(core, { scale: 0.15, transformOrigin: 'center' }, { scale: 1, duration: 0.38, ease: 'back.out(1.7)' }, at + 0.5);
          }
          if (panel.dataset.track === '03') {
            const modern = panel.querySelector<HTMLElement>('.terminal-new');
            if (modern) timeline.from(modern, { x: 30, opacity: 0, duration: 0.45, ease: 'power2.out' }, at + 0.38);
            const old = panel.querySelector<HTMLElement>('.terminal-old');
            if (old) timeline.to(old, { opacity: 0.46, duration: 0.35 }, at + 0.5);
          }
          if (panel.dataset.track === '04') {
            const raw = panel.querySelector<SVGGElement>('.privacy-data');
            const essential = panel.querySelector<SVGGElement>('.privacy-essential');
            if (raw) timeline.to(raw, { opacity: 0.12, duration: 0.45 }, at + 0.35);
            if (essential) timeline.from(essential, { opacity: 0, scale: 0.5, transformOrigin: 'center', duration: 0.4 }, at + 0.52);
          }
          if (panel.dataset.track === '05') {
            const heavy = panel.querySelector<HTMLElement>('.heavy-ui');
            const light = panel.querySelector<HTMLElement>('.light-ui');
            if (heavy) timeline.to(heavy, { scale: 0.76, opacity: 0.3, duration: 0.42 }, at + 0.4);
            if (light) timeline.from(light, { x: 46, opacity: 0, duration: 0.42, ease: 'power2.out' }, at + 0.48);
          }
          if (panel.dataset.track === '06') {
            const scan = panel.querySelector<HTMLElement>('.scan-line');
            if (scan) timeline.fromTo(scan, { yPercent: -20, opacity: 0 }, { yPercent: 620, opacity: 0.8, duration: 0.65, ease: 'none' }, at + 0.18);
          }
          if (panel.dataset.track === '07') {
            const paths = panel.querySelectorAll<SVGPathElement>('.loss-path');
            paths.forEach((path, pathIndex) => timeline.fromTo(path, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.out' }, at + 0.18 + pathIndex * 0.08));
          }
        });

        const navigateToPanel = (event: MouseEvent): void => {
          const link = (event.currentTarget as HTMLAnchorElement);
          const targetIndex = indexLinks.indexOf(link);
          const trigger = ScrollTrigger.getById('track-journey');
          if (!trigger || targetIndex < 0) return;
          event.preventDefault();
          history.replaceState(null, '', link.getAttribute('href') ?? '#tracks');
          const targetY = trigger.start + (trigger.end - trigger.start) * (targetIndex / (panels.length - 1));
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        };
        indexLinks.forEach((link) => link.addEventListener('click', navigateToPanel, { signal: navigationControls.signal }));
        return () => {
          navigationControls.abort();
          journeyRoot.classList.remove('journey-enabled');
          indexLinks.forEach((link) => link.removeAttribute('aria-current'));
        };
      });
      media.add('(max-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
        panels.forEach((panel) => {
          const visual = panel.querySelector<HTMLElement>('.journey-visual');
          const copy = panel.querySelector<HTMLElement>('.journey-copy');
          if (visual) gsap.from(visual, { y: 22, opacity: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: panel, start: 'top 76%', once: true } });
          if (copy) gsap.from(copy, { y: 18, opacity: 0, duration: 0.55, delay: 0.08, ease: 'power2.out', scrollTrigger: { trigger: panel, start: 'top 72%', once: true } });
        });
      });
      window.addEventListener('pagehide', () => media.revert(), { once: true });
    }
  });

  window.addEventListener('pagehide', () => {
    controls.abort();
    context.revert();
  }, { once: true });
}
