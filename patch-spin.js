const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

// Replace:
// if (autoSpin) {
//   yaw += spinSpeed;
// }
// with:
// if (autoSpin && !selectedCity) {
//   yaw += spinSpeed;
// }
code = code.replace(
  /if \(!isDragging\) \{\s*if \(autoSpin\) \{\s*yaw \+= spinSpeed;\s*\}/,
  'if (!isDragging) {\n        if (autoSpin && !selectedCity) {\n          yaw += spinSpeed;\n        }'
);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
