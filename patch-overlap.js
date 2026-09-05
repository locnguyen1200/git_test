const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

const targetCSS = `.page-content {
      position: relative;
    }`;

const newCSS = `.page-content {
      position: relative;
      /* Add extra padding at the bottom so the dossier seal never overlaps the Portraits gallery */
      padding-bottom: 100px !important; 
    }`;

code = code.replace(targetCSS, newCSS);

const badgeTarget = `.globe-portal-btn.badge-style {
      position: absolute;
      bottom: -60px;
      right: -60px;
      width: 150px;
      height: 150px;`;
      
const newBadge = `.globe-portal-btn.badge-style {
      position: absolute;
      bottom: -40px;
      right: -40px;
      width: 160px;
      height: 160px;`;

code = code.replace(badgeTarget, newBadge);

const hoverTarget = `.globe-portal-btn.badge-style:hover {
      opacity: 1;
      transform: scale(1.15) rotate(5deg);
    }`;

// Wait, the canvas size is 150px in the CSS too!
const canvasTarget = `.globe-portal-btn.badge-style canvas {
      width: 150px;
      height: 150px;`;

const newCanvas = `.globe-portal-btn.badge-style canvas {
      width: 160px;
      height: 160px;`;

code = code.replace(canvasTarget, newCanvas);

const mobileTarget = `@media (max-width: 768px) {
      .globe-portal-btn.badge-style {
        bottom: -40px;
        right: -20px;
        width: 120px;
        height: 120px;
      }
      .globe-portal-btn.badge-style canvas {
        width: 120px;
        height: 120px;
      }`;
      
const newMobile = `@media (max-width: 768px) {
      .page-content {
        padding-bottom: 80px !important;
      }
      .globe-portal-btn.badge-style {
        bottom: -30px;
        right: -15px;
        width: 130px;
        height: 130px;
      }
      .globe-portal-btn.badge-style canvas {
        width: 130px;
        height: 130px;
      }`;

code = code.replace(mobileTarget, newMobile);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
