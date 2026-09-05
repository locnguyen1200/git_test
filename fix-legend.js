const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

// Replace the span with a button
code = code.replace(
  '<span class="legend-item"><kbd>◄</kbd><kbd>►</kbd> Cycle Cities</span>',
  '<button type="button" class="legend-item legend-btn" id="legend-cycle-left" title="Previous City"><kbd>◄</kbd></button><button type="button" class="legend-item legend-btn" id="legend-cycle-right" title="Next City"><kbd>►</kbd> <span>Cycle Cities</span></button>'
);

// Add event listeners for the new buttons
const listeners = `
    if (legendSpin) {
      legendSpin.addEventListener('click', toggleAutoSpin);
    }
    if (legendReverse) {
      legendReverse.addEventListener('click', reverseSpinDir);
    }
    const cycleLeftBtn = document.getElementById('legend-cycle-left');
    const cycleRightBtn = document.getElementById('legend-cycle-right');
    if (cycleLeftBtn) cycleLeftBtn.addEventListener('click', () => cycleCity(-1));
    if (cycleRightBtn) cycleRightBtn.addEventListener('click', () => cycleCity(1));
`;

code = code.replace(
  /if \(legendSpin\) \{\s*legendSpin\.addEventListener\('click', toggleAutoSpin\);\s*\}\s*if \(legendReverse\) \{\s*legendReverse\.addEventListener\('click', reverseSpinDir\);\s*\}/g,
  listeners
);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
