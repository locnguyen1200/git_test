const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

// 1. Remove the old top-right fixed button HTML
const oldHTML = `    <a href="globe-test.html" class="globe-portal-btn badge-style" aria-label="Open the 3D globe">
      <canvas id="globe-portal-canvas" width="130" height="130"></canvas>
    </a>`;
code = code.replace(oldHTML, '');

// 2. Add the new inline banner HTML right after the photo-grid section
const gridEnd = `      </section>`;
const bannerHTML = `      </section>

      <a href="globe-test.html" class="globe-dossier-banner" aria-label="Open the 3D globe">
        <div class="globe-dossier-canvas-wrap">
          <canvas id="globe-portal-canvas" width="200" height="200"></canvas>
        </div>
        <div class="globe-dossier-text">
          <div class="globe-dossier-title">GLOBAL NETWORK MAP</div>
          <div class="globe-dossier-desc">Explore the interactive 3D location archive</div>
        </div>
        <svg class="globe-dossier-arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="square" fill="none"/>
        </svg>
      </a>`;
code = code.replace(gridEnd, bannerHTML);

// 3. Remove old CSS
const oldCSS = `    .globe-portal-btn.badge-style {
      position: fixed;
      top: 35px;
      right: 35px;
      width: 130px;
      height: 130px;
      left: auto;
      transform: none;
      z-index: 10001; /* High enough to float over page content */
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
      width: 130px;
      height: 130px;
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
        top: 20px;
        right: 20px;
        width: 100px;
        height: 100px;
      }
      .globe-portal-btn.badge-style canvas {
        width: 100px;
        height: 100px;
      }
    }`;
code = code.replace(oldCSS, '');

// 4. Add new banner CSS
const newCSS = `    /* Globe Dossier Banner */
    .globe-dossier-banner {
      display: flex;
      align-items: center;
      margin-top: 32px;
      padding: 12px 24px;
      border: 2px dashed var(--theme-box-border);
      background: transparent;
      text-decoration: none;
      color: var(--theme-text);
      gap: 20px;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .globe-dossier-banner:hover {
      background: var(--theme-box-border);
      color: var(--theme-box-bg);
    }
    .globe-dossier-canvas-wrap {
      width: 80px;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }
    .globe-dossier-canvas-wrap canvas {
      width: 80px;
      height: 80px;
      transition: transform 0.4s ease;
    }
    .globe-dossier-banner:hover .globe-dossier-canvas-wrap canvas {
      transform: scale(1.1);
    }
    .globe-dossier-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .globe-dossier-title {
      font-family: var(--theme-font);
      font-weight: bold;
      font-size: 1.1em;
      letter-spacing: 0.1em;
    }
    .globe-dossier-desc {
      font-size: 0.85em;
      opacity: 0.8;
      font-style: italic;
    }
    .globe-dossier-arrow {
      width: 24px;
      height: 24px;
      opacity: 0.5;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .globe-dossier-banner:hover .globe-dossier-arrow {
      opacity: 1;
      transform: translateX(4px);
    }
    html[data-theme="matrix"] .globe-dossier-banner:hover {
      color: #000000;
    }
    html[data-theme="midnight"] .globe-dossier-banner:hover {
      color: #000000;
    }`;
const cssIndex = code.indexOf('</style>');
code = code.slice(0, cssIndex) + newCSS + '\n' + code.slice(cssIndex);

// 5. Update canvas drawing variables
// Since the banner swaps colors on hover (background becomes border color, text becomes background color),
// we need the globe to also swap colors!
const oldAccentJS = `        const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
        const isMidnight = document.documentElement.getAttribute('data-theme') === 'midnight';
        const accent      = isMatrix ? '#00ff41' : (isMidnight ? '#ece6d8' : cssVar('--theme-accent', '#245782'));
        const accentLight = isMatrix ? '#00ff41' : (isMidnight ? '#ffffff' : cssVar('--theme-accent-light', '#7d9ab3'));`;

const newAccentJS = `        const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
        const isMidnight = document.documentElement.getAttribute('data-theme') === 'midnight';
        
        let primary = isMatrix ? '#00ff41' : (isMidnight ? '#ece6d8' : cssVar('--theme-accent', '#245782'));
        let secondary = isMatrix ? '#00ff41' : (isMidnight ? '#ffffff' : cssVar('--theme-accent-light', '#7d9ab3'));
        
        // Invert colors on hover since the banner background inverts!
        if (isHovered) {
          primary = isMatrix ? '#000000' : (isMidnight ? '#000000' : cssVar('--theme-box-bg', '#ffffff'));
          secondary = isMatrix ? '#003300' : (isMidnight ? '#333333' : '#aaaaaa');
        }
        
        const accent = primary;
        const accentLight = secondary;`;
code = code.replace(oldAccentJS, newAccentJS);

// Remove the rotating text from the canvas since it's 80x80 now and we have real text next to it.
const drawTextOld = `        // Rotating Badge Text
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
code = code.replace(drawTextOld, '');

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
