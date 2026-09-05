const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

code = code.replace(
  /\s*\/\/ Animation Loop/,
  '\n    }\n\n    // Animation Loop'
);
fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
