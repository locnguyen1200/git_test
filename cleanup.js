const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

// Update the JS selector
code = code.replace(
  "const globeBtn = document.querySelector('.globe-portal-btn');",
  "const globeBtn = document.querySelector('.globe-dossier-banner');"
);

// Delete the old CSS block that was missed
// It starts with .globe-portal-btn { and ends before .globe-dossier-banner {
const startIdx = code.indexOf('.globe-portal-btn {');
if (startIdx !== -1) {
  const endIdx = code.indexOf('/* Globe Dossier Banner */');
  if (endIdx !== -1) {
    code = code.substring(0, startIdx) + code.substring(endIdx);
  }
}

// Ensure there is no stray HTML instance 
code = code.replace(
  /<a href="globe-test.html" class="globe-portal-btn badge-style"[\s\S]*?<\/a>/g,
  ''
);

// Wait, the :has(.globe-portal-btn:hover) might still be there, let's fix it
code = code.replace(
  /\.globe-portal-scene:has\(\.globe-portal-btn:hover\) \.box {/g,
  '.globe-portal-scene:has(.globe-dossier-banner:hover) .box {'
);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
