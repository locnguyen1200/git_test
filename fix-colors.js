const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

// 1. Remove JS color inversion
const jsRegex = /\/\/ Invert colors on hover since the banner background inverts!\n\s*if \(isHovered\) {\n\s*primary =.*?\n\s*secondary =.*?\n\s*}/;
code = code.replace(jsRegex, '');

// 2. Change CSS hover effect
const oldHover = `    .globe-dossier-banner:hover {
      background: var(--theme-box-border);
      color: var(--theme-box-bg);
    }`;
const newHover = `    .globe-dossier-banner:hover {
      border-color: var(--theme-accent);
      background: var(--theme-panel-alt);
    }`;
code = code.replace(oldHover, newHover);

const matrixHover = `    html[data-theme="matrix"] .globe-dossier-banner:hover {
      color: #000000;
    }`;
const matrixHoverNew = `    html[data-theme="matrix"] .globe-dossier-banner:hover {
      border-color: #00ff41;
      box-shadow: inset 0 0 12px rgba(0,255,65,0.1), 0 0 12px rgba(0,255,65,0.1);
    }`;
code = code.replace(matrixHover, matrixHoverNew);

const midnightHover = `    html[data-theme="midnight"] .globe-dossier-banner:hover {
      color: #000000;
    }`;
const midnightHoverNew = `    html[data-theme="midnight"] .globe-dossier-banner:hover {
      border-color: #ece6d8;
      box-shadow: inset 0 0 12px rgba(236,230,216,0.1), 0 0 12px rgba(236,230,216,0.1);
    }`;
code = code.replace(midnightHover, midnightHoverNew);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
