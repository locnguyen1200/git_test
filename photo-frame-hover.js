// Bobs each .photo-frame up and down while hovered, then eases it gently
// back to rest instead of relying on a CSS animation-to-transition handoff
// (which browsers can snap instead of ease when the animation is removed).
(function () {
  const BOB_PERIOD_MS = 2400;
  const BOB_HEIGHT_PX = 10;
  const SETTLE_MS = 600;

  document.querySelectorAll('.photo-frame').forEach((frame) => {
    const rotate = getComputedStyle(frame).getPropertyValue('--frame-rotate') || '0deg';
    let rafId = null;
    let startTime = null;

    function setTransform(offsetY, transitionMs) {
      frame.style.transition = transitionMs ? `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none';
      frame.style.transform = `rotate(${rotate}) translateY(${offsetY}px)`;
    }

    function bobFrame(time) {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const phase = (elapsed % BOB_PERIOD_MS) / BOB_PERIOD_MS;
      const offsetY = -BOB_HEIGHT_PX * ((1 - Math.cos(phase * Math.PI * 2)) / 2);
      setTransform(offsetY, 0);
      rafId = requestAnimationFrame(bobFrame);
    }

    frame.addEventListener('mouseenter', () => {
      if (rafId !== null) return; // already bobbing, don't start a second loop
      startTime = null;
      rafId = requestAnimationFrame(bobFrame);
    });

    frame.addEventListener('mouseleave', () => {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
      const currentTransform = getComputedStyle(frame).transform;
      frame.style.transition = 'none';
      frame.style.transform = currentTransform;
      void frame.offsetWidth; // reflow so the transition below actually animates
      setTransform(0, SETTLE_MS);
    });
  });
})();
