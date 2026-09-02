// Midnight theme: occasional shooting-star cameras streak across the screen.
// Ticks every 5s; each tick rarely spawns a star, and each extra simultaneous
// star (up to 5) is progressively rarer.
(function () {
  const MAX_STARS = 5;
  const TICK_MS = 500;
  const cameras = [];

  function createCamera() {
    const el = document.createElement('div');
    el.className = 'midnight-shooting-camera';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 24 24">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M6.5 11h.01" />
    </svg>`;
    document.body.appendChild(el);
    return el;
  }

  for (let i = 0; i < MAX_STARS; i++) {
    cameras.push(createCamera());
  }

  let tickId = null;
  let active = false;

  function launch(camera) {
    camera.classList.remove('is-flying');
    void camera.offsetWidth; // reflow so the animation can restart
    camera.style.top = `${Math.random() * 50 + 5}vh`;
    camera.style.left = '-60px';

    // Tilt the camera to match the actual pixel-space angle of its flight path
    const dxPx = window.innerWidth * 1.3;
    const dyPx = window.innerHeight * 0.55;
    const angleDeg = Math.atan2(dyPx, dxPx) * (180 / Math.PI);
    camera.style.setProperty('--fly-angle', `${angleDeg}deg`);

    camera.classList.add('is-flying');
  }

  function availableCamera() {
    return cameras.find((el) => !el.classList.contains('is-flying'));
  }

  function tick() {
    if (!active) return;

    // Base chance a star appears at all this tick.
    if (Math.random() < 0.75) { 
      let spawned = 0;
      let chance = 0.6;
      while (spawned < MAX_STARS && Math.random() < chance) {
        const camera = availableCamera();
        if (!camera) break;
        // Stagger extra stars ~0.5s apart instead of launching them together.
        const startDelay = spawned === 0 ? 0 : spawned * 500 + (Math.random() * 200 - 100);
        setTimeout(() => launch(camera), startDelay);
        spawned += 1;
        chance *= 0.35; // each additional simultaneous star is much rarer
      }
    }

    tickId = setTimeout(tick, TICK_MS);
  }

  function start() {
    if (active) return;
    active = true;
    tick();
  }

  function stop() {
    active = false;
    clearTimeout(tickId);
    cameras.forEach((el) => el.classList.remove('is-flying'));
  }

  function syncWithTheme() {
    const isMidnight = document.documentElement.getAttribute('data-theme') === 'midnight';
    const galleryOpen = document.body.classList.contains('gallery-open');
    const onGalleryPage = document.body.classList.contains('photo-collection-page');
    if (isMidnight && !galleryOpen && !onGalleryPage) {
      start();
    } else {
      stop();
    }
  }

  new MutationObserver(syncWithTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  new MutationObserver(syncWithTheme).observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
  });

  syncWithTheme();
})();
