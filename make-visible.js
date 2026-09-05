const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

const targetRegex = /const isGlowingTheme = isMatrix \|\| isMidnight;[\s\S]*?const gradOuterAlpha = [^;]+;/;

const newStr = `const isGlowingTheme = isMatrix || isMidnight;
        const speed = isHovered ? 0.030 : 0.005;
        
        // Make the globe highly visible (bold) AT ALL TIMES for non-glowing themes,
        // so it doesn't shift color when hovered, but remains easy to see.
        const lineAlpha = isGlowingTheme ? (isHovered ? 1.0 : 0.85) : 1.0;
        const lineW     = isGlowingTheme ? (isHovered ? 2.5 : 1.5) : 2.0;

        const gradInnerAlpha = isGlowingTheme ? (isHovered ? 0.85 : 0.60) : 0.85;
        const gradOuterAlpha = isGlowingTheme ? (isHovered ? 0.35 : 0.15) : 0.35;`;

code = code.replace(targetRegex, newStr);

const targetOuterRing = /ctx\.globalAlpha = \(isHovered && isGlowingTheme\) \? 1\.0 : 0\.5;\n\s+ctx\.lineWidth   = \(isHovered && isGlowingTheme\) \? 3\.0 : 1\.5;/;

const newOuterRing = `ctx.globalAlpha = isGlowingTheme ? (isHovered ? 1.0 : 0.5) : 1.0;
        ctx.lineWidth   = isGlowingTheme ? (isHovered ? 3.0 : 1.5) : 2.0;`;

code = code.replace(targetOuterRing, newOuterRing);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
