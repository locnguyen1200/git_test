const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

const regex = /\/\* Box must stay in front of the globe[\s\S]*?\.box {\n\s*opacity: 0\.45;\n\s*}/;
code = code.replace(regex, '');

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
