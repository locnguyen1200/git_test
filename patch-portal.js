const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

// 1. Fix CSS Position
code = code.replace(
  /right: 60px;/,
  'left: 50%;\n      transform: translateX(-50%);'
);

// 2. Fix Canvas rendering colors for matrix theme
const oldDraw = `        const accent      = cssVar('--theme-accent',       '#245782');
        const accentLight = cssVar('--theme-accent-light', '#7d9ab3');`;

const newDraw = `        const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
        const isMidnight = document.documentElement.getAttribute('data-theme') === 'midnight';
        const accent      = isMatrix ? '#00ff41' : (isMidnight ? '#ece6d8' : cssVar('--theme-accent', '#245782'));
        const accentLight = isMatrix ? '#00ff41' : (isMidnight ? '#ffffff' : cssVar('--theme-accent-light', '#7d9ab3'));`;

code = code.replace(oldDraw, newDraw);

// 3. Fix CSS Drop shadow for Matrix theme
const oldShadow = `.globe-portal-btn canvas {
      width: 140px;
      height: 140px;
      display: block;
      filter: drop-shadow(0 0 6px var(--theme-accent));
      transition: filter 0.45s ease, transform 0.45s ease;
    }`;

const newShadow = `.globe-portal-btn canvas {
      width: 140px;
      height: 140px;
      display: block;
      filter: drop-shadow(0 0 6px var(--theme-accent));
      transition: filter 0.45s ease, transform 0.45s ease;
    }
    html[data-theme="matrix"] .globe-portal-btn canvas {
      filter: drop-shadow(0 0 6px #00ff41);
    }
    html[data-theme="midnight"] .globe-portal-btn canvas {
      filter: drop-shadow(0 0 6px #ece6d8);
    }`;

code = code.replace(oldShadow, newShadow);

const oldHoverShadow = `.globe-portal-btn:hover canvas {
      filter:
        drop-shadow(0 0 22px var(--theme-accent))
        drop-shadow(0 0 8px var(--theme-accent-light));
      transform: scale(1.07);
    }`;

const newHoverShadow = `.globe-portal-btn:hover canvas {
      filter:
        drop-shadow(0 0 22px var(--theme-accent))
        drop-shadow(0 0 8px var(--theme-accent-light));
      transform: scale(1.07);
    }
    html[data-theme="matrix"] .globe-portal-btn:hover canvas {
      filter: drop-shadow(0 0 22px #00ff41) drop-shadow(0 0 8px #00ff41);
    }
    html[data-theme="midnight"] .globe-portal-btn:hover canvas {
      filter: drop-shadow(0 0 22px #ece6d8) drop-shadow(0 0 8px #ffffff);
    }`;
    
code = code.replace(oldHoverShadow, newHoverShadow);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
