  document.documentElement.setAttribute('data-theme', localStorage.getItem('site-theme') || 'default');
  <script src="matrix-rain.js">
  
    (function () {
      const canvas = document.getElementById('globe-portal-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const R = W * 0.38;

      const globeBtn = document.querySelector('.globe-portal-btn');
      let isHovered = false;

      globeBtn.addEventListener('mouseenter', () => { isHovered = true; });
      globeBtn.addEventListener('mouseleave', () => { isHovered = false; });

      function cssVar(name, fallback) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
      }

      let yaw = 0;

      function draw() {
        ctx.clearRect(0, 0, W, H);

        const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
        const isMidnight = document.documentElement.getAttribute('data-theme') === 'midnight';
        const accent      = isMatrix ? '#00ff41' : (isMidnight ? '#ece6d8' : cssVar('--theme-accent', '#245782'));
        const accentLight = isMatrix ? '#00ff41' : (isMidnight ? '#ffffff' : cssVar('--theme-accent-light', '#7d9ab3'));
        const speed       = isHovered ? 0.030 : 0.005;
        const lineAlpha   = isHovered ? 0.90  : 0.70;  /* more visible at rest */
        const lineW       = isHovered ? 1.6   : 1.1;


        const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.04, cx, cy, R);
        grad.addColorStop(0, accentLight + (isHovered ? 'aa' : '88'));
        grad.addColorStop(1, accent + (isHovered ? '30' : '22'));
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();

        ctx.strokeStyle = accent;
        ctx.lineWidth = lineW;

        for (let i = 1; i < 8; i++) {
          const phi = (i / 8) * Math.PI;
          const y0  = cy + R * Math.cos(phi);
          const rx  = R * Math.sin(phi);
          ctx.globalAlpha = lineAlpha * Math.sin(phi);
          ctx.beginPath();
          ctx.ellipse(cx, y0, rx, rx * 0.26, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (let i = 0; i < 9; i++) {
          const theta = yaw + (i / 9) * Math.PI * 2;
          const cosT  = Math.cos(theta);
          ctx.globalAlpha = lineAlpha * (0.4 + 0.6 * Math.abs(cosT));
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.abs(cosT) * R, R, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.globalAlpha = isHovered ? 1.0 : 0.5;
        ctx.lineWidth   = isHovered ? 2.0 : 1.0;
        ctx.strokeStyle = accentLight;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R, R * 0.26, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        ctx.globalAlpha = isHovered ? 0.85 : 0.28;
        ctx.strokeStyle = accent;
        ctx.lineWidth   = isHovered ? 2.0  : 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
        yaw += speed;
        requestAnimationFrame(draw);
      }

      draw();
    })();
  
