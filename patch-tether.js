const fs = require('fs');
let code = fs.readFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', 'utf8');

// 1. Add Tether CSS
const cssIndex = code.indexOf('</style>');
const tetherCSS = `
    /* Tether Line Styles */
    #tether-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 15;
    }
    .tether-element {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .tether-visible .tether-element {
      opacity: 1;
    }
    #tether-path {
      fill: none;
      stroke: var(--theme-box-border);
      stroke-width: 2;
      stroke-dasharray: 6 6;
      animation: tether-march 1s linear infinite reverse;
    }
    #tether-dot-node, #tether-dot-popup {
      fill: var(--theme-box-bg);
      stroke: var(--theme-box-border);
      stroke-width: 2;
    }
    @keyframes tether-march {
      to { stroke-dashoffset: 24; }
    }
`;
code = code.slice(0, cssIndex) + tetherCSS + code.slice(cssIndex);

// 2. Add Tether SVG DOM
const popupHTMLIndex = code.indexOf('<div class="pin-popup" id="pin-popup" hidden>');
const tetherDOM = `
        <!-- SVG Tether Layer -->
        <svg id="tether-layer">
          <g class="tether-element">
            <path id="tether-path" d="" />
            <circle id="tether-dot-node" r="4" />
            <circle id="tether-dot-popup" r="4" />
          </g>
        </svg>
        
        `;
code = code.slice(0, popupHTMLIndex) + tetherDOM + code.slice(popupHTMLIndex);

// 3. Pause autoSpin
// Look for: if (autoSpin && !isDragging) { yaw -= 0.005; }
code = code.replace(
  /if \(autoSpin && !isDragging\) \{/g,
  'if (autoSpin && !isDragging && !selectedCity) {'
);

// 4. Restore/Update updatePopupPosition logic
const updatePopupRegex = /function updatePopupPosition\(city\) \{[\s\S]*?\}\s*\/\/ Don't drag the globe when interacting with the popup/m;
const newUpdatePopup = `function updatePopupPosition(city) {
      if (!popupEl || popupEl.hidden || !city) return;
      const stageRect = stage.getBoundingClientRect();
      const stageW = stageRect.width || viewWidth;
      const stageH = stageRect.height || viewHeight;

      const px = city._screenX != null ? city._screenX : (stageW / 2);
      const py = city._screenY != null ? city._screenY : (stageH / 2);

      const popW = popupEl.offsetWidth || 300;
      const popH = popupEl.offsetHeight || 220;

      let left = px + 25;
      let top = py - popH / 2;
      let isLeft = false;

      if (left + popW > stageW - 12) {
        left = px - popW - 25;
        isLeft = true;
      }
      if (left < 12) {
        left = 12;
      }
      if (top < 12) top = 12;
      if (top + popH > stageH - 12) top = stageH - popH - 12;

      popupEl.style.left = \`\${Math.round(left)}px\`;
      popupEl.style.top = \`\${Math.round(top)}px\`;

      // Update tether
      const tetherSvg = document.getElementById('tether-layer');
      const tetherPath = document.getElementById('tether-path');
      const tetherNode = document.getElementById('tether-dot-node');
      const tetherPopup = document.getElementById('tether-dot-popup');
      
      if (tetherSvg && tetherPath) {
        const popupAttachX = isLeft ? left + popW : left;
        const popupAttachY = top + 24; // Attach to the header area

        // Draw a sleek cubic bezier curve
        const cpX = (px + popupAttachX) / 2;
        const d = \`M \${px},\${py} C \${cpX},\${py} \${cpX},\${popupAttachY} \${popupAttachX},\${popupAttachY}\`;
        
        tetherPath.setAttribute('d', d);
        tetherNode.setAttribute('cx', px);
        tetherNode.setAttribute('cy', py);
        tetherPopup.setAttribute('cx', popupAttachX);
        tetherPopup.setAttribute('cy', popupAttachY);

        if (city._visible === false) {
          tetherSvg.classList.remove('tether-visible');
          popupEl.style.opacity = '0';
          popupEl.style.pointerEvents = 'none';
        } else {
          tetherSvg.classList.add('tether-visible');
          popupEl.style.opacity = '1';
          popupEl.style.pointerEvents = 'auto';
        }
      }
    }

    // Don't drag the globe when interacting with the popup`;

code = code.replace(updatePopupRegex, newUpdatePopup);

// 5. Hide tether when popup hides
const hidePopupRegex = /function hidePopup\(\) \{[\s\S]*?hudTarget\.textContent = 'SECTOR: GLOBAL';\s*\}/m;
const newHidePopup = `function hidePopup() {
      if (popupEl) popupEl.hidden = true;
      const tetherSvg = document.getElementById('tether-layer');
      if (tetherSvg) tetherSvg.classList.remove('tether-visible');
      selectedCity = null;
      popupCurrentPage = 1;
      hudTarget.textContent = 'SECTOR: GLOBAL';
    }`;
code = code.replace(hidePopupRegex, newHidePopup);

fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-test.html', code);
