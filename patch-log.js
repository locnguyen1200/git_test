const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

code = code.replace(
  "function updatePopupPosition(city) {",
  "function updatePopupPosition(city) {\n      if(city) console.log('POPUP POS:', city.name, 'x:', city._screenX, 'y:', city._screenY, 'visible:', city._visible);"
);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
