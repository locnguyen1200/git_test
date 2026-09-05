const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

code = code.replace(
  /if \(dragDist < 6\) \{/g,
  "if (dragDist < 6 && e.target && e.target.tagName === 'CANVAS') {"
);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
