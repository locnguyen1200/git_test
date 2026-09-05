const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

const targetStr = `        const speed       = isHovered ? 0.030 : 0.005;
        const lineAlpha   = isHovered ? 1.0  : 0.85;  /* more visible at rest */
        const lineW       = isHovered ? 2.5 : 1.5;


        const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.04, cx, cy, R);
        grad.addColorStop(0, getRgba(accentLight, isHovered ? 0.85 : 0.60));
        grad.addColorStop(1, getRgba(accent, isHovered ? 0.35 : 0.15));`;

const newStr = `        const isGlowingTheme = isMatrix || isMidnight;
        const speed = isHovered ? 0.030 : 0.005;
        
        // For non-glowing themes (Default/Sepia/Black&White), locking the alpha prevents it from looking muddy/dark when hovered.
        const lineAlpha = (isHovered && isGlowingTheme) ? 1.0 : 0.85;
        const lineW     = (isHovered && isGlowingTheme) ? 2.5 : 1.5;

        const gradInnerAlpha = (isHovered && isGlowingTheme) ? 0.85 : 0.60;
        const gradOuterAlpha = (isHovered && isGlowingTheme) ? 0.35 : 0.15;

        const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.04, cx, cy, R);
        grad.addColorStop(0, getRgba(accentLight, gradInnerAlpha));
        grad.addColorStop(1, getRgba(accent, gradOuterAlpha));`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
