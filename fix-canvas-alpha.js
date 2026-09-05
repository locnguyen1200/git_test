const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

const helperStr = `
      function getRgba(hex, alpha) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x+x).join('');
        const r = parseInt(c.substring(0, 2), 16) || 0;
        const g = parseInt(c.substring(2, 4), 16) || 0;
        const b = parseInt(c.substring(4, 6), 16) || 0;
        return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`;
      }
`;

if (!code.includes('getRgba(hex, alpha)')) {
  code = code.replace(
    "function cssVar(name, fallback) {",
    helperStr + "\n      function cssVar(name, fallback) {"
  );
}

const badGrad0 = "grad.addColorStop(0, accentLight + (isHovered ? 'aa' : '88'));";
const goodGrad0 = "grad.addColorStop(0, getRgba(accentLight, isHovered ? 0.66 : 0.53));";
code = code.replace(badGrad0, goodGrad0);

const badGrad1 = "grad.addColorStop(1, accent + (isHovered ? '30' : '22'));";
const goodGrad1 = "grad.addColorStop(1, getRgba(accent, isHovered ? 0.19 : 0.13));";
code = code.replace(badGrad1, goodGrad1);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
