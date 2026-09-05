const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

// 1. Move HTML inside <main>
const targetHTML = `    </main>

    <a href="globe-test.html" class="globe-portal-btn" aria-label="Open the 3D globe">
      <canvas id="globe-portal-canvas" width="280" height="280"></canvas>
      <span class="globe-portal-label">[ explore globe ]</span>
    </a>`;
    
const newHTML = `      <a href="globe-test.html" class="globe-portal-btn badge-style" aria-label="Open the 3D globe">
        <canvas id="globe-portal-canvas" width="300" height="300"></canvas>
      </a>
    </main>`;

code = code.replace(targetHTML, newHTML);

// 2. Add badge-style CSS
const cssIndex = code.indexOf('</style>');
const badgeCSS = `
    /* Stylistic Badge Overrides */
    .page-content {
      position: relative;
    }
    .globe-portal-btn.badge-style {
      position: absolute;
      bottom: -60px;
      right: -60px;
      width: 150px;
      height: 150px;
      left: auto;
      transform: none;
      opacity: 0.6;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .globe-portal-btn.badge-style:hover {
      opacity: 1;
      transform: scale(1.15) rotate(5deg);
    }
    .globe-portal-btn.badge-style canvas {
      width: 150px;
      height: 150px;
      filter: drop-shadow(0 0 8px var(--theme-box-bg));
    }
    /* Let the hover shadow handle the glow */
    html[data-theme="matrix"] .globe-portal-btn.badge-style:hover canvas {
      filter: drop-shadow(0 0 15px #00ff41);
    }
    html[data-theme="midnight"] .globe-portal-btn.badge-style:hover canvas {
      filter: drop-shadow(0 0 15px #ece6d8);
    }
    @media (max-width: 768px) {
      .globe-portal-btn.badge-style {
        bottom: -40px;
        right: -20px;
        width: 120px;
        height: 120px;
      }
      .globe-portal-btn.badge-style canvas {
        width: 120px;
        height: 120px;
      }
    }
`;
code = code.slice(0, cssIndex) + badgeCSS + code.slice(cssIndex);

// 3. Update canvas script to draw rotating text
const drawEndTarget = `        ctx.globalAlpha = isHovered ? 0.85 : 0.28;
        ctx.strokeStyle = accent;
        ctx.lineWidth   = isHovered ? 2.0  : 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 6, 0, Math.PI * 2);
        ctx.stroke();`;
        
const newDrawEnd = `        ctx.globalAlpha = isHovered ? 0.85 : 0.28;
        ctx.strokeStyle = accent;
        ctx.lineWidth   = isHovered ? 2.0  : 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Rotating Badge Text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(yaw * 0.4); // Spin slowly
        const text = "• EXPLORE GLOBE • INTERACTIVE MAP ";
        ctx.font = 'bold 11px "Courier New", Courier, monospace';
        ctx.fillStyle = isHovered ? accentLight : accent;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const radius = R + 20;
        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI * 2) / text.length);
          ctx.translate(0, -radius);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
        ctx.restore();`;

code = code.replace(drawEndTarget, newDrawEnd);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
