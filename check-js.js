const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');
console.log("Checking tetherNode:", code.includes('id="tether-dot-node"'));
console.log("Checking tetherPopup:", code.includes('id="tether-dot-popup"'));
console.log("Checking tetherPath:", code.includes('id="tether-path"'));
console.log("Checking tetherSvg:", code.includes('id="tether-layer"'));
