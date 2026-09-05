const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', 'utf8');

// 1. Remove the padding hacks
code = code.replace(
  /      \/\* Add extra padding at the bottom so the dossier seal never overlaps the Portraits gallery \*\/\n      padding-bottom: 130px !important; \n/,
  ''
);

code = code.replace(
  /      \.page-content {\n        padding-bottom: 110px !important;\n      }\n/,
  ''
);

// 2. Change the badge style to a fixed Top-Right minimap
const oldBadge = `    .globe-portal-btn.badge-style {
      position: absolute;
      bottom: -40px;
      right: -40px;
      width: 160px;
      height: 160px;
      left: auto;
      transform: none;`;
      
const newBadge = `    .globe-portal-btn.badge-style {
      position: fixed;
      top: 35px;
      right: 35px;
      width: 130px;
      height: 130px;
      left: auto;
      transform: none;
      z-index: 10001; /* High enough to float over page content */`;

code = code.replace(oldBadge, newBadge);

// Adjust canvas sizes for the new fixed radar
const canvasCSSOld = `    .globe-portal-btn.badge-style canvas {
      width: 160px;
      height: 160px;`;
const canvasCSSNew = `    .globe-portal-btn.badge-style canvas {
      width: 130px;
      height: 130px;`;
code = code.replace(canvasCSSOld, canvasCSSNew);

// Adjust Mobile CSS
const mobileBadgeOld = `      .globe-portal-btn.badge-style {
        bottom: -30px;
        right: -15px;
        width: 130px;
        height: 130px;
      }
      .globe-portal-btn.badge-style canvas {
        width: 130px;
        height: 130px;
      }`;
const mobileBadgeNew = `      .globe-portal-btn.badge-style {
        top: 20px;
        right: 20px;
        width: 100px;
        height: 100px;
      }
      .globe-portal-btn.badge-style canvas {
        width: 100px;
        height: 100px;
      }`;
code = code.replace(mobileBadgeOld, mobileBadgeNew);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/photography.html', code);
