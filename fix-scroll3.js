const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

const replacement = `    let wheelCycleThrottle = 0;
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const now = performance.now();
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
        if (now - wheelCycleThrottle > 600) {
          const direction = e.deltaX > 0 ? 1 : -1;
          cycleCity(direction);
          wheelCycleThrottle = now;
        }
      } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        targetZoom = Math.max(0.65, Math.min(2.1, targetZoom + delta));
      }
    }, { passive: false });`;

// Replace all that chunk of wheel listener stuff
const regex = /let wheelCycleThrottle = 0;[\s\S]*?\}, \{ passive: false \}\);\s*e\.preventDefault\(\);\s*const delta = e\.deltaY > 0 \? -0\.1 : 0\.1;\s*targetZoom = Math\.max\(0\.65, Math\.min\(2\.1, targetZoom \+ delta\)\);\s*\}, \{ passive: false \}\);/g;

code = code.replace(regex, replacement);
fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
