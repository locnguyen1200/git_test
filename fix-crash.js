const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

const regex = /\/\/ Active Sector Detection[\s\S]*?sector = 'GLOBAL';\s*\}\s*if \(\!selectedCity\) \{\s*hudTarget\.textContent = \`SECTOR: \$\{sector\}\`;\s*\}/m;

// Let's just blindly replace the problematic lines by looking for "Active Sector Detection" down to the end of its block.
const crashRegex = /\/\/ Active Sector Detection[\s\S]*?hudTarget\.textContent = \`SECTOR: \$\{sector\}\`;\s*\}/m;

code = code.replace(crashRegex, '');
fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
