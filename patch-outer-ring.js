const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

const targetStr = `        ctx.globalAlpha = isHovered ? 1.0 : 0.5;
        ctx.lineWidth   = isHovered ? 3.0 : 1.5;
        ctx.strokeStyle = accentLight;`;

const newStr = `        ctx.globalAlpha = (isHovered && isGlowingTheme) ? 1.0 : 0.5;
        ctx.lineWidth   = (isHovered && isGlowingTheme) ? 3.0 : 1.5;
        ctx.strokeStyle = accentLight;`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
