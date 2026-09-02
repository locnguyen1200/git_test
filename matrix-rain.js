// Matrix theme: animated digital-rain background, only active while data-theme="matrix".
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-rain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const glyphs = 'アイウエオカキクケコサシスセソタチツテトPHOTOGRAPHY11234567890';
  const fontSize = 16;
  const frameInterval = 1000 / 30;
  let columns = 0;
  let drops = [];
  let animationId = null;
  let lastDrawTime = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

    drops.forEach((y, i) => {
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillText(glyph, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 1;
    });
  }

  function loop(timestamp) {
    if (timestamp - lastDrawTime >= frameInterval) {
      draw();
      lastDrawTime = timestamp;
    }
    animationId = requestAnimationFrame(loop);
  }

  function start() {
    canvas.style.display = 'block';
    if (!animationId) {
      resize();
      lastDrawTime = 0;
      loop();
    }
  }

  function stop() {
    canvas.style.display = 'none';
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function syncWithTheme() {
    const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
    const onGalleryPage = document.body.classList.contains('photo-collection-page');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMatrix && !onGalleryPage && !reducedMotion && document.visibilityState === 'visible') {
      start();
    } else {
      stop();
    }
  }

  window.addEventListener('resize', () => {
    if (animationId) resize();
  });

  document.addEventListener('visibilitychange', syncWithTheme);

  new MutationObserver(syncWithTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  syncWithTheme();
})();
