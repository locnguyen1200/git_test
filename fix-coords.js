const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

const targetStr = `      const px = city._screenX != null ? city._screenX : (stageW / 2);
      const py = city._screenY != null ? city._screenY : (stageH / 2);`;

const newStr = `      const px = city._screenX != null ? (stageW / 2 + city._screenX) : (stageW / 2);
      const py = city._screenY != null ? (stageH / 2 + city._screenY) : (stageH / 2);`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
