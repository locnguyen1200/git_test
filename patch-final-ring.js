const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

const targetOuterRing = /ctx\.globalAlpha = isHovered \? 0\.85 : 0\.28;\n\s+ctx\.strokeStyle = accent;\n\s+ctx\.lineWidth   = isHovered \? 2\.0  : 1\.0;/;

const newOuterRing = `ctx.globalAlpha = isGlowingTheme ? (isHovered ? 0.85 : 0.28) : 0.85;
        ctx.strokeStyle = accent;
        ctx.lineWidth   = isGlowingTheme ? (isHovered ? 2.0 : 1.0) : 2.0;`;

code = code.replace(targetOuterRing, newOuterRing);
fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
