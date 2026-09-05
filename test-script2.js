  
    // =========================================================================
    // 1. THEME SWITCHER LOGIC
    // =========================================================================
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeTrigger = document.getElementById('theme-dropdown-trigger');
    const themeList = document.getElementById('theme-dropdown-list');
    const themeValueLabel = document.getElementById('theme-dropdown-value');
    const themeOptions = Array.from(themeList.querySelectorAll('li'));

    function applyTheme(themeValue) {
      const option = themeOptions.find((item) => item.dataset.themeValue === themeValue) || themeOptions[0];
      document.documentElement.setAttribute('data-theme', option.dataset.themeValue);
      themeValueLabel.textContent = option.dataset.themeLabel;
      themeOptions.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
      localStorage.setItem('site-theme', option.dataset.themeValue);
    }

    function openThemeDropdown() {
      themeList.hidden = false;
      themeTrigger.setAttribute('aria-expanded', 'true');
    }

    function closeThemeDropdown() {
      themeList.hidden = true;
      themeTrigger.setAttribute('aria-expanded', 'false');
    }

    applyTheme(localStorage.getItem('site-theme') || 'default');

    themeTrigger.addEventListener('click', () => {
      if (themeList.hidden) openThemeDropdown();
      else closeThemeDropdown();
    });

    themeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        applyTheme(option.dataset.themeValue);
        closeThemeDropdown();
        themeTrigger.focus();
      });
    });

    document.addEventListener('click', (event) => {
      if (!themeDropdown.contains(event.target)) closeThemeDropdown();
    });

    // =========================================================================
    // 2. 3D RETRO VECTOR GLOBE ENGINE
    // =========================================================================
    const canvas = document.getElementById('globe-canvas');
    const ctx = canvas.getContext('2d');
    const stage = document.getElementById('globe-stage');

    const hudTarget = document.getElementById('hud-target');

    // UI elements: popup & legend
    const popupEl = document.getElementById('pin-popup');
    const popupCity = document.getElementById('popup-city');
    const popupCount = document.getElementById('popup-count');
    const popupClose = document.getElementById('popup-close');
    const popupBody = document.getElementById('popup-body');
    const popupFooter = document.getElementById('popup-footer');
    
    const legendSpin = document.getElementById('legend-spin');
    const legendSpinText = document.getElementById('legend-spin-text');
    const legendReverse = document.getElementById('legend-reverse');

    // Globe States & Viewport Dimensions
    let viewWidth = 860;
    let viewHeight = 520;
    let baseRadius = 180;
    let zoom = 1.0;
    let targetZoom = 1.0;

    let yaw = -0.6; // longitude angle (radians)
    let pitch = 0.35; // latitude angle (radians)
    let targetYaw = -0.6;
    let targetPitch = 0.35;

    let yawVelocity = 0;
    let pitchVelocity = 0;

    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragStartYaw = 0, dragStartPitch = 0;
    let lastDragTime = 0;
    let lastDragX = 0, lastDragY = 0;

    // Persisted preferences
    const savedAutoSpin = localStorage.getItem('globe-autospin');
    let autoSpin = savedAutoSpin !== null ? savedAutoSpin === 'true' : true;

    const savedSpinDir = localStorage.getItem('globe-spindir');
    let baseSpinRate = 0.0018;
    let spinSpeed = savedSpinDir === '-1' ? -baseSpinRate : baseSpinRate;
    
    let showGrid = true;
    let showPins = true;
    let showBackface = true;
    
    // Set initial legend text
    if (legendSpinText) {
      legendSpinText.textContent = autoSpin ? 'Spin: ON' : 'Spin: OFF';
    }


    // Major Cities Data & Tagged Photo Locations
    const fallbackLocations = [
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan', count: 0, photos: [] },
      { name: 'Kyoto', lat: 35.0116, lon: 135.7681, country: 'Japan', count: 0, photos: [] },
      { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France', count: 0, photos: [] },
      { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK', count: 0, photos: [] },
      { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA', count: 0, photos: [] },
      { name: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297, country: 'Vietnam', count: 0, photos: [] },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia', count: 0, photos: [] },
      { name: 'Cairo', lat: 30.0444, lon: 31.2357, country: 'Egypt', count: 0, photos: [] },
      { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'Brazil', count: 0, photos: [] },
      { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, country: 'Iceland', count: 0, photos: [] }
    ];

    const cities = (window.globeLocationData && Array.isArray(window.globeLocationData.locations) && window.globeLocationData.locations.length > 0)
      ? window.globeLocationData.locations
      : fallbackLocations;

    let selectedCity = null;
    let hoveredCity = null;
    let dragDist = 0;

    // High-fidelity World Coastlines Polygons [lon, lat]
    const landmasses = window.globeHighResCoastlines || [
      // North America
      [
        [-168, 65], [-160, 71], [-140, 70], [-130, 69], [-120, 69], [-100, 69], [-85, 70], [-70, 62],
        [-65, 58], [-55, 52], [-60, 46], [-66, 44], [-70, 42], [-75, 35], [-80, 25], [-81, 25],
        [-83, 30], [-90, 30], [-97, 26], [-97, 20], [-90, 16], [-83, 10], [-77, 8], [-80, 9],
        [-85, 13], [-92, 16], [-105, 20], [-110, 24], [-115, 30], [-120, 34], [-124, 40], [-124, 48],
        [-130, 54], [-136, 58], [-150, 60], [-160, 56], [-165, 60], [-168, 65]
      ],
      // South America
      [
        [-77, 8], [-72, 12], [-60, 10], [-50, 0], [-35, -5], [-35, -10], [-39, -15], [-42, -23],
        [-50, -30], [-58, -35], [-65, -42], [-68, -54], [-74, -53], [-74, -45], [-72, -35], [-70, -20],
        [-78, -5], [-80, 2], [-77, 8]
      ],
      // Europe & Western Asia
      [
        [40, 52], [36, 46], [30, 46], [28, 41], [23, 38], [15, 38], [12, 43], [3, 43], [-2, 37], [-9, 36]
      ],
      // British Isles
      [
        [-5, 50], [1, 51], [0, 53], [-2, 58], [-5, 58], [-4, 55], [-5, 50]
      ],
      // Africa
      [
        [-6, 36], [10, 37], [25, 32], [32, 31], [35, 28], [43, 12], [51, 12], [45, 2], [40, -4],
        [35, -15], [32, -26], [28, -33], [19, -34], [15, -23], [12, -15], [9, 4], [0, 6], [-15, 11],
        [-17, 15], [-13, 28], [-6, 36]
      ],
      // Madagascar
      [
        [49, -12], [50, -16], [47, -25], [44, -25], [44, -18], [49, -12]
      ],
      // Japan
      [
        [130, 32], [133, 34], [136, 35], [140, 36], [141, 41], [141, 45], [145, 44], [140, 40],
        [136, 36], [130, 32]
      ],
      // Australia
      [
        [114, -22], [115, -34], [122, -35], [135, -35], [138, -35], [147, -38], [151, -34],
        [153, -28], [148, -20], [142, -11], [136, -12], [130, -13], [125, -15], [114, -22]
      ],
      // New Zealand
      [
        [166, -46], [170, -43], [174, -41], [178, -38], [174, -36], [172, -41], [168, -44], [166, -46]
      ],
      // Greenland
      [
        [-45, 60], [-35, 66], [-20, 75], [-20, 82], [-50, 83], [-60, 76], [-52, 68], [-45, 60]
      ],
      // Antarctica
      [
        [-180, -78], [-140, -75], [-100, -72], [-65, -64], [-55, -64], [-20, -70],
        [20, -68], [60, -66], [100, -66], [140, -67], [180, -78]
      ]
    ];

    // Project [lat, lon] to 3D Cartesian, then rotate, then 2D screen
    function project(lat, lon, currentRadius) {
      const phi = (lat * Math.PI) / 180;
      const theta = (lon * Math.PI) / 180;

      // 3D Cartesian on unit sphere
      const x = Math.cos(phi) * Math.sin(theta);
      const y = Math.sin(phi);
      const z = Math.cos(phi) * Math.cos(theta);

      // Rotate around Y axis (yaw)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X axis (pitch)
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;

      const cx = viewWidth / 2;
      const cy = viewHeight / 2;

      return {
        x: cx + x1 * currentRadius,
        y: cy - y2 * currentRadius,
        z: z2,
        visible: z2 > 0
      };
    }

    // Colors read from active CSS Theme variables
    function getThemeColors() {
      const styles = getComputedStyle(document.documentElement);
      const textColor = styles.getPropertyValue('--theme-text').trim() || '#172c45';
      const accentColor = styles.getPropertyValue('--theme-accent').trim() || '#245782';
      const accentLight = styles.getPropertyValue('--theme-accent-light').trim() || '#7d9ab3';
      const boxBg = styles.getPropertyValue('--theme-box-bg').trim() || '#e7e9ec';
      const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
      const isMidnight = document.documentElement.getAttribute('data-theme') === 'midnight';
      
      return {
        text: textColor,
        accent: accentColor,
        accentLight: accentLight,
        boxBg: boxBg,
        isMatrix: isMatrix,
        isMidnight: isMidnight
      };
    }

    // Main Draw Function
    let pulseAngle = 0;
    function drawGlobe() {
      ctx.clearRect(0, 0, viewWidth, viewHeight);

      const R = baseRadius * zoom;
      const cx = viewWidth / 2;
      const cy = viewHeight / 2;
      const colors = getThemeColors();

      pulseAngle += 0.05;

      // 1. Outer Horizon Glow & Sphere Backing
      const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.15);
      if (colors.isMatrix) {
        glowGrad.addColorStop(0, 'rgba(0, 255, 65, 0.08)');
        glowGrad.addColorStop(0.8, 'rgba(0, 255, 65, 0.03)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
        glowGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.02)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Sphere Disc
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = colors.isMatrix ? 'rgba(2, 10, 2, 0.85)' : (colors.isMidnight ? 'rgba(5, 5, 5, 0.9)' : 'rgba(230, 235, 240, 0.25)');
      ctx.fill();

      // 2. Latitudinal & Longitudinal Grid (Meridians & Parallels)
      if (showGrid) {
        // Backface grid (subtle, dashed / low-alpha)
        if (showBackface) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = colors.isMatrix ? 'rgba(0, 255, 65, 0.15)' : (colors.isMidnight ? 'rgba(253, 224, 71, 0.1)' : 'rgba(0, 0, 0, 0.09)');
          ctx.setLineDash([2, 4]);

          // Meridians (Longitudes)
          for (let lon = -180; lon < 180; lon += 15) {
            ctx.beginPath();
            let started = false;
            for (let lat = -80; lat <= 80; lat += 5) {
              const pt = project(lat, lon, R);
              if (!pt.visible) {
                if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
                else { ctx.lineTo(pt.x, pt.y); }
              } else {
                started = false;
              }
            }
            ctx.stroke();
          }

          // Parallels (Latitudes)
          for (let lat = -75; lat <= 75; lat += 15) {
            ctx.beginPath();
            let started = false;
            for (let lon = -180; lon <= 180; lon += 5) {
              const pt = project(lat, lon, R);
              if (!pt.visible) {
                if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
                else { ctx.lineTo(pt.x, pt.y); }
              } else {
                started = false;
              }
            }
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }

        // Frontface Grid (solid, crisp)
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.isMatrix 
          ? 'rgba(0, 255, 65, 0.45)' 
          : (colors.isMidnight ? 'rgba(253, 224, 71, 0.35)' : 'rgba(23, 44, 69, 0.3)');

        // Meridians
        for (let lon = -180; lon < 180; lon += 15) {
          ctx.beginPath();
          let started = false;
          for (let lat = -85; lat <= 85; lat += 4) {
            const pt = project(lat, lon, R);
            if (pt.visible) {
              if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
              else { ctx.lineTo(pt.x, pt.y); }
            } else {
              started = false;
            }
          }
          ctx.stroke();
        }

        // Parallels
        for (let lat = -75; lat <= 75; lat += 15) {
          ctx.beginPath();
          let started = false;
          const isEquator = lat === 0;
          ctx.lineWidth = isEquator ? 1.8 : 1;
          ctx.strokeStyle = isEquator 
            ? (colors.isMatrix ? '#00ff41' : (colors.isMidnight ? '#fde047' : colors.accent)) 
            : (colors.isMatrix ? 'rgba(0, 255, 65, 0.45)' : (colors.isMidnight ? 'rgba(253, 224, 71, 0.35)' : 'rgba(23, 44, 69, 0.3)'));

          for (let lon = -180; lon <= 180; lon += 4) {
            const pt = project(lat, lon, R);
            if (pt.visible) {
              if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
              else { ctx.lineTo(pt.x, pt.y); }
            } else {
              started = false;
            }
          }
          ctx.stroke();
        }
      }

      // 3. Backface Continents (faint outline in x-ray mode)
      if (showBackface) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.isMatrix 
          ? 'rgba(0, 255, 65, 0.18)' 
          : (colors.isMidnight ? 'rgba(253, 224, 71, 0.15)' : 'rgba(0, 0, 0, 0.12)');
        ctx.setLineDash([2, 3]);
        landmasses.forEach((poly) => {
          ctx.beginPath();
          let started = false;
          poly.forEach(([lon, lat]) => {
            const pt = project(lat, lon, R);
            if (!pt.visible) {
              if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
              else { ctx.lineTo(pt.x, pt.y); }
            } else {
              started = false;
            }
          });
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }

      // 4. Frontface Continents
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = colors.isMatrix ? '#00ff41' : (colors.isMidnight ? '#fde047' : colors.text);
      ctx.fillStyle = colors.isMatrix 
        ? 'rgba(0, 255, 65, 0.15)' 
        : (colors.isMidnight ? 'rgba(253, 224, 71, 0.12)' : 'rgba(36, 87, 130, 0.14)');

      landmasses.forEach((poly) => {
        ctx.beginPath();
        let started = false;
        poly.forEach(([lon, lat]) => {
          const pt = project(lat, lon, R);
          if (pt.visible) {
            if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
            else { ctx.lineTo(pt.x, pt.y); }
          } else {
            started = false;
          }
        });
        ctx.stroke();
      });

      // 5. Outer Horizon Rim Border
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = colors.isMatrix ? '#00ff41' : (colors.isMidnight ? '#ece6d8' : colors.accent);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Cardinal Coordinate Ticks around the Horizon Rim
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = colors.isMatrix ? '#00ff41' : (colors.isMidnight ? '#ece6d8' : colors.text);
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
        const x1 = cx + Math.cos(angle) * (R - 3);
        const y1 = cy + Math.sin(angle) * (R - 3);
        const x2 = cx + Math.cos(angle) * (R + 4);
        const y2 = cy + Math.sin(angle) * (R + 4);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 6. City Location Pinpoints & Tactical HUD Labels
      if (showPins) {
        const placedBoxes = [];
        const pad = 6;
        function checkOverlap(b1, b2) {
          return !(b1.x + b1.w + pad < b2.x || b2.x + b2.w + pad < b1.x ||
                   b1.y + b1.h + pad < b2.y || b2.y + b2.h + pad < b1.y);
        }

        // 1. Gather all visible cities & calculate label sizes
        const visibleList = [];
        cities.forEach((city) => {
          const pt = project(city.lat, city.lon, R);
          city._screenX = pt.x;
          city._screenY = pt.y;
          city._visible = pt.visible;

          if (pt.visible) {
            const isSelected = !!(selectedCity && selectedCity.name === city.name);
            const photoCount = city.count || (city.photos ? city.photos.length : 0);
            const countText = `[${photoCount} ${photoCount === 1 ? 'PHOTO' : 'PHOTOS'}]`;
            const labelText = `${city.name.toUpperCase()} ${countText}`;
            const currentThemeFont = window.getComputedStyle(document.body).getPropertyValue("--theme-font").trim();
          const baseSizeStr = window.getComputedStyle(document.body).getPropertyValue("--ui-size-base").trim() || "12px";
          ctx.font = isSelected 
              ? `bold ${baseSizeStr} ${currentThemeFont}` 
              : `${baseSizeStr} ${currentThemeFont}`;
            const textWidth = ctx.measureText(labelText).width;
            const chipW = textWidth + 8;
            const chipH = 16;
            visibleList.push({
              city,
              pt,
              isSelected,
              photoCount,
              labelText,
              chipW,
              chipH
            });
          }
        });

        // 2. Compute non-colliding label placements (selected city gets priority placement first)
        const sortedForPlacement = [...visibleList].sort((a, b) => (a.isSelected ? -1 : (b.isSelected ? 1 : 0)));
        sortedForPlacement.forEach((item) => {
          const candidates = [
            { lx: item.pt.x + 16, ly: item.pt.y - 14, align: 'right' },
            { lx: item.pt.x - 16 - item.chipW, ly: item.pt.y - 14, align: 'left' },
            { lx: item.pt.x + 16, ly: item.pt.y + 18, align: 'right' },
            { lx: item.pt.x - 16 - item.chipW, ly: item.pt.y + 18, align: 'left' }
          ];

          let chosen = candidates[0];
          for (const c of candidates) {
            const box = { x: c.lx, y: c.ly - 13, w: item.chipW, h: item.chipH };
            if (!placedBoxes.some(existing => checkOverlap(existing, box))) {
              chosen = c;
              break;
            }
          }
          const chosenBox = { x: chosen.lx, y: chosen.ly - 13, w: item.chipW, h: item.chipH };
          placedBoxes.push(chosenBox);
          item.placement = chosen;
          item.box = chosenBox;
          item.city._labelBox = chosenBox;
        });

        // 3. Render pins (non-selected first, selected city rendered last so its reticle & label are on top)
        const sortedForDraw = [...visibleList].sort((a, b) => (a.isSelected ? 1 : (b.isSelected ? -1 : 0)));
        sortedForDraw.forEach((item) => {
          const { city, pt, isSelected, photoCount, labelText, chipW, chipH, placement } = item;
          const isHovered = !!(hoveredCity && hoveredCity.name === city.name);
          const pulse = Math.sin(pulseAngle * 2.5 + city.lat) * (isSelected ? 5 : (photoCount > 0 ? 3.5 : 2)) + (isSelected ? 9 : (photoCount > 0 ? 6 : 4));

          // Target Blip Dot
          ctx.fillStyle = colors.isMatrix 
            ? (isSelected ? '#ffffff' : '#00ff41') 
            : (colors.isMidnight
                ? (isSelected ? '#ffffff' : '#ece6d8')
                : (isSelected ? '#f59e0b' : '#dc2626'));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isSelected ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Pulse Radar Ring
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.strokeStyle = colors.isMatrix 
            ? (isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 255, 65, 0.6)') 
            : (colors.isMidnight
                ? (isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(236, 230, 216, 0.6)')
                : (isSelected ? 'rgba(245, 158, 11, 0.9)' : 'rgba(220, 38, 38, 0.6)'));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pulse, 0, Math.PI * 2);
          ctx.stroke();

          // Tactical Corner Reticle if selected
          if (isSelected) {
            const reticle = 14;
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = colors.isMatrix ? '#00ff41' : (colors.isMidnight ? '#ece6d8' : colors.accent);
            ctx.beginPath();
            // Top-left
            ctx.moveTo(pt.x - reticle, pt.y - reticle + 5);
            ctx.lineTo(pt.x - reticle, pt.y - reticle);
            ctx.lineTo(pt.x - reticle + 5, pt.y - reticle);
            // Top-right
            ctx.moveTo(pt.x + reticle - 5, pt.y - reticle);
            ctx.lineTo(pt.x + reticle, pt.y - reticle);
            ctx.lineTo(pt.x + reticle, pt.y - reticle + 5);
            // Bottom-left
            ctx.moveTo(pt.x - reticle, pt.y + reticle - 5);
            ctx.lineTo(pt.x - reticle, pt.y + reticle);
            ctx.lineTo(pt.x - reticle + 5, pt.y + reticle);
            // Bottom-right
            ctx.moveTo(pt.x + reticle - 5, pt.y + reticle);
            ctx.lineTo(pt.x + reticle, pt.y + reticle);
            ctx.lineTo(pt.x + reticle, pt.y + reticle - 5);
            ctx.stroke();
          }

          // Leader Line
          ctx.lineWidth = 1;
          ctx.strokeStyle = colors.isMatrix 
            ? '#00ff41' 
            : (colors.isMidnight 
                ? (isSelected ? '#ece6d8' : 'rgba(236, 230, 216, 0.7)') 
                : (isSelected ? colors.accent : colors.text));
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          if (placement.align === 'right') {
            ctx.lineTo(pt.x + 16, placement.ly);
            ctx.lineTo(placement.lx + chipW, placement.ly);
          } else {
            ctx.lineTo(pt.x - 16, placement.ly);
            ctx.lineTo(placement.lx, placement.ly);
          }
          ctx.stroke();

          // Tactical chip background, border & text
          let chipBg;
          let chipFg;
          let chipBorder;

          if (colors.isMatrix) {
            chipBg = isSelected 
              ? '#00ff41' 
              : (isHovered ? 'rgba(0, 50, 0, 0.95)' : 'rgba(0, 20, 0, 0.85)');
            chipFg = isSelected ? '#000000' : '#00ff41';
            chipBorder = '#00ff41';
          } else if (colors.isMidnight) {
            // Match the beige rounded label aesthetic for the Midnight theme
            chipBg = isSelected ? '#fef3c7' : '#e6dfbc';
            chipFg = '#000000';
            chipBorder = isSelected ? '#ffffff' : 'rgba(0,0,0,0.1)';
          } else {
            chipBg = isSelected
              ? colors.accent
              : (isHovered ? 'rgba(23, 44, 69, 0.95)' : 'rgba(255, 255, 255, 0.92)');
            chipFg = isSelected
              ? '#ffffff'
              : (isHovered ? '#ffffff' : colors.text);
            chipBorder = isSelected ? colors.accent : colors.boxBg;
          }

          ctx.fillStyle = chipBg;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(placement.lx, placement.ly - 13, chipW, chipH, 4);
          } else {
            ctx.rect(placement.lx, placement.ly - 13, chipW, chipH);
          }
          ctx.fill();
          ctx.strokeStyle = chipBorder;
          ctx.stroke();

          const currentThemeFont = window.getComputedStyle(document.body).getPropertyValue("--theme-font").trim();
          const baseSizeStr = window.getComputedStyle(document.body).getPropertyValue("--ui-size-base").trim() || "12px";
          ctx.font = isSelected 
            ? `bold ${baseSizeStr} ${currentThemeFont}` 
            : `${baseSizeStr} ${currentThemeFont}`;
          ctx.fillStyle = chipFg;
          ctx.fillText(labelText, placement.lx + 4, placement.ly - 1);
        });
      }



      // Active Sector Detection
      let sector = 'GLOBAL';
      const cLonNum = parseFloat(currentLon);
      const cLatNum = parseFloat(currentLat);
      if (cLonNum >= -30 && cLonNum <= 60 && cLatNum >= 35) sector = 'EUROPE / MEDITERRANEAN';
      else if (cLonNum >= 60 && cLonNum <= 150 && cLatNum >= 0) sector = 'ASIA PACIFIC';
      else if (cLonNum >= -130 && cLonNum <= -60 && cLatNum >= 15) sector = 'NORTH AMERICA';
      else if (cLonNum >= -85 && cLonNum <= -35 && cLatNum < 15) sector = 'SOUTH AMERICA';
      else if (cLonNum >= -20 && cLonNum <= 55 && cLatNum < 35 && cLatNum > -40) sector = 'AFRICA';
      else if (cLonNum >= 110 && cLonNum <= 180 && cLatNum < 0) sector = 'OCEANIA';
      else if (cLonNum >= -70 && cLonNum <= -10) sector = 'ATLANTIC BASIN';
      else sector = 'PACIFIC BASIN';
      hudTarget.textContent = `SECTOR: ${sector}`;
    }

    // Animation Loop
    let lastFrame = performance.now();

    function animate(time) {
      requestAnimationFrame(animate);

      // Smooth zoom interpolation
      zoom += (targetZoom - zoom) * 0.12;

      // Inertia & Autospin
      if (!isDragging) {
        if (autoSpin) {
          yaw += spinSpeed;
        }
        // Momentum damping
        yaw += yawVelocity;
        pitch += pitchVelocity;
        yawVelocity *= 0.94;
        pitchVelocity *= 0.94;

        // Pitch limits (prevent flipover)
        pitch = Math.max(-1.45, Math.min(1.45, pitch));
      }

      drawGlobe();

      if (selectedCity && popupEl && !popupEl.hidden) {
        updatePopupPosition(selectedCity);
      }
    }
    requestAnimationFrame(animate);


    // =========================================================================
    // 3. INTERACTIVE MOUSE, TOUCH & PINCH CONTROLS
    // =========================================================================
    const activePointers = new Map();
    let pinchStartDist = 0;
    let pinchStartZoom = 1.0;

    function getPinchDist() {
      const pts = Array.from(activePointers.values());
      if (pts.length < 2) return 0;
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      return Math.hypot(dx, dy);
    }

    // Photographic Reconnaissance Popup Logic
    const POPUP_PAGE_SIZE = 8;
    let popupCurrentPage = 1;

    function showPopup(city) {
      if (!city || !popupEl) return;
      selectedCity = city;
      popupEl.hidden = false;
      
      const allPhotos = city.photos || [];
      const totalPhotos = allPhotos.length;
      const count = city.count || totalPhotos;
      const countryStr = city.country ? `, ${city.country.toUpperCase()}` : '';
      const totalPages = Math.max(1, Math.ceil(totalPhotos / POPUP_PAGE_SIZE));

      if (popupCurrentPage < 1) popupCurrentPage = 1;
      if (popupCurrentPage > totalPages) popupCurrentPage = totalPages;

      popupCity.textContent = `${city.name.toUpperCase()}${countryStr}`;
      popupCount.textContent = `[${count} ${count === 1 ? 'PHOTO' : 'PHOTOS'}]`;

      const pageStart = (popupCurrentPage - 1) * POPUP_PAGE_SIZE;
      const pagePhotos = allPhotos.slice(pageStart, pageStart + POPUP_PAGE_SIZE);

      if (pagePhotos.length > 0) {
        popupBody.innerHTML = `
          <div class="popup-grid">
            ${pagePhotos.map((p) => `
              <div class="popup-thumb-wrap">
                <a href="${p.galleryLink || '#'}" class="popup-thumb-link" title="${p.alt || city.name}">
                  <img src="${p.src}" alt="${p.alt || city.name}" class="popup-thumb" loading="lazy">
                </a>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        popupBody.innerHTML = `<div class="popup-empty">[NO PHOTOGRAPHS ARCHIVED]</div>`;
      }

      if (totalPages > 1) {
        popupFooter.style.display = 'flex';
        popupFooter.innerHTML = `
          <span class="popup-page-info">PAGE ${popupCurrentPage} OF ${totalPages}</span>
          <div class="popup-page-btns">
            <button type="button" class="popup-page-btn" id="popup-prev" ${popupCurrentPage === 1 ? 'disabled' : ''}>PREV</button>
            <button type="button" class="popup-page-btn" id="popup-next" ${popupCurrentPage === totalPages ? 'disabled' : ''}>NEXT</button>
          </div>
        `;
        document.getElementById('popup-prev')?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (popupCurrentPage > 1) {
            popupCurrentPage--;
            showPopup(city);
          }
        });
        document.getElementById('popup-next')?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (popupCurrentPage < totalPages) {
            popupCurrentPage++;
            showPopup(city);
          }
        });
      } else {
        popupFooter.style.display = 'none';
        popupFooter.innerHTML = '';
      }

      updatePopupPosition(city);
    }

    function hidePopup() {
      if (popupEl) popupEl.hidden = true;
      selectedCity = null;
      popupCurrentPage = 1;
      hudTarget.textContent = 'SECTOR: GLOBAL';
    }

    function updatePopupPosition(city) {
      if (!popupEl || popupEl.hidden || !city) return;
      const stageRect = stage.getBoundingClientRect();
      const stageW = stageRect.width || viewWidth;
      const stageH = stageRect.height || viewHeight;

      // Use the projected screen coordinates of the pin
      const px = city._screenX != null ? city._screenX : (stageW / 2);
      const py = city._screenY != null ? city._screenY : (stageH / 2);

      const popW = popupEl.offsetWidth || 300;
      const popH = popupEl.offsetHeight || 220;

      // Position nicely beside the pin
      let left = px + 18;
      let top = py - popH / 2;

      // If overflowing right edge, flip to left of pin
      if (left + popW > stageW - 12) {
        left = px - popW - 18;
      }
      // Clamp inside stage boundaries
      if (left < 12) left = 12;
      if (top < 12) top = 12;
      if (top + popH > stageH - 12) top = stageH - popH - 12;

      popupEl.style.left = `${Math.round(left)}px`;
      popupEl.style.top = `${Math.round(top)}px`;

      // Hide popup completely when the pin rotates to the back of the globe
      if (city._visible === false) {
        popupEl.style.opacity = '0';
        popupEl.style.pointerEvents = 'none';
      } else {
        popupEl.style.opacity = '1';
        popupEl.style.pointerEvents = 'auto';
      }
    }

    // Don't drag the globe when interacting with the popup
    if (popupEl) {
      popupEl.addEventListener('pointerdown', (e) => e.stopPropagation());
      popupEl.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
      popupEl.addEventListener('click', (e) => e.stopPropagation());
      if (popupClose) {
        popupClose.addEventListener('click', (e) => {
          e.stopPropagation();
          hidePopup();
        });
      }
    }

    function flyToLocation(city) {
      selectedCity = city;
      popupCurrentPage = 1;
      showPopup(city);

      // We no longer turn off autoSpin here! User preference is respected.
      const count = city.count || (city.photos ? city.photos.length : 0);
      hudTarget.textContent = `TARGET: ${city.name.toUpperCase()} [${count} PHOTOS]`;

      const targetYawAngle = city.lon * Math.PI / 180;
      const targetPitchAngle = city.lat * Math.PI / 180;

      const startYaw = yaw;
      const startPitch = pitch;
      const startTime = performance.now();
      const duration = 750;

      function stepNav(t) {
        const progress = Math.min(1, (t - startTime) / duration);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

        let diffYaw = (targetYawAngle - startYaw) % (Math.PI * 2);
        if (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
        if (diffYaw < -Math.PI) diffYaw += Math.PI * 2;

        yaw = startYaw + diffYaw * ease;
        pitch = startPitch + (targetPitchAngle - startPitch) * ease;

        if (progress < 1) {
          requestAnimationFrame(stepNav);
        }
      }
      requestAnimationFrame(stepNav);
    }

    function getCityAt(mouseX, mouseY) {
      if (!showPins) return null;
      let bestCity = null;
      let bestDist = 20;
      for (const city of cities) {
        if (!city._visible) continue;
        const dist = Math.hypot(mouseX - city._screenX, mouseY - city._screenY);
        if (dist < bestDist) {
          bestDist = dist;
          bestCity = city;
        }
        if (city._labelBox) {
          const b = city._labelBox;
          if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
            return city;
          }
        }
      }
      return bestCity;
    }

    // Dynamic Target Jump Buttons
    const targetsRow = document.querySelector('.globe-targets-row');
    function initTargetsRow() {
      if (!targetsRow) return;
      targetsRow.innerHTML = '';
      cities.forEach((city) => {
        const count = city.count || (city.photos ? city.photos.length : 0);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'target-pill';
        btn.dataset.name = city.name;
        btn.dataset.lat = city.lat;
        btn.dataset.lon = city.lon;
        btn.textContent = `${city.name.toUpperCase()} [${count}]`;
        btn.title = `${city.name}: ${count} photographs`;
        btn.addEventListener('click', () => {
          flyToLocation(city);
        });
        targetsRow.appendChild(btn);
      });
    }
    initTargetsRow();

    stage.addEventListener('pointerdown', (e) => {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stage.setPointerCapture(e.pointerId);
      dragDist = 0;

      if (activePointers.size === 2) {
        isDragging = false;
        pinchStartDist = getPinchDist();
        pinchStartZoom = targetZoom;
      } else if (activePointers.size === 1) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartYaw = yaw;
        dragStartPitch = pitch;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        lastDragTime = performance.now();
        yawVelocity = 0;
        pitchVelocity = 0;
      }
      e.preventDefault();
    });

    stage.addEventListener('pointermove', (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size >= 2 && pinchStartDist > 0) {
        const currentDist = getPinchDist();
        const factor = currentDist / pinchStartDist;
        targetZoom = Math.max(0.65, Math.min(2.1, pinchStartZoom * factor));
        return;
      }

      if (!isDragging) {
        const rect = stage.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const hit = getCityAt(mx, my);
        if (hit) {
          hoveredCity = hit;
          stage.style.cursor = 'pointer';
          stage.title = `${hit.name}: ${hit.count || 0} photos (Click to open intel)`;
        } else {
          hoveredCity = null;
          stage.style.cursor = 'grab';
          stage.title = '';
        }
        return;
      }

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragDist += Math.hypot(e.clientX - lastDragX, e.clientY - lastDragY);

      const sensitivity = 0.0055 / zoom;
      yaw = dragStartYaw - dx * sensitivity;
      pitch = Math.max(-1.45, Math.min(1.45, dragStartPitch + dy * sensitivity));

      const now = performance.now();
      yawVelocity = -((e.clientX - lastDragX) * sensitivity) * 0.6;
      pitchVelocity = ((e.clientY - lastDragY) * sensitivity) * 0.6;

      lastDragX = e.clientX;
      lastDragY = e.clientY;
      lastDragTime = now;
    });

    function endDrag(e) {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        pinchStartDist = 0;
      }
      if (activePointers.size === 0) {
        isDragging = false;
        if (dragDist < 6) {
          const rect = stage.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          const hit = getCityAt(mx, my);
          if (hit) {
            flyToLocation(hit);
          } else {
            hidePopup();
          }
        }
      } else if (activePointers.size === 1) {
        const remaining = activePointers.values().next().value;
        dragStartX = remaining.x;
        dragStartY = remaining.y;
        dragStartYaw = yaw;
        dragStartPitch = pitch;
        lastDragX = remaining.x;
        lastDragY = remaining.y;
        lastDragTime = performance.now();
        isDragging = true;
      }
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // Scroll Wheel Zoom
        let wheelCycleThrottle = 0;
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const now = performance.now();
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
        if (now - wheelCycleThrottle > 600) {
          const direction = e.deltaX > 0 ? 1 : -1;
          cycleCity(direction);
          wheelCycleThrottle = now;
        }
      } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        targetZoom = Math.max(0.65, Math.min(2.1, targetZoom + delta));
      }
    }, { passive: false });

    // =========================================================================
    // 4. KEYBOARD SHORTCUTS & LEGEND ACTIONS
    // =========================================================================

    function updateSpinUI() {
      if (legendSpinText) {
        legendSpinText.textContent = autoSpin ? 'Spin: ON' : 'Spin: OFF';
      }
    }

    function toggleAutoSpin() {
      autoSpin = !autoSpin;
      localStorage.setItem('globe-autospin', String(autoSpin));
      updateSpinUI();
    }

    function reverseSpinDir() {
      spinSpeed = -spinSpeed;
      localStorage.setItem('globe-spindir', spinSpeed >= 0 ? '1' : '-1');
    }

    function cycleCity(direction) {
      if (!cities || cities.length === 0) return;
      let currentIndex = -1;
      if (selectedCity) {
        currentIndex = cities.indexOf(selectedCity);
      }
      
      let nextIndex = currentIndex + direction;
      if (nextIndex >= cities.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = cities.length - 1;
      
      flyToLocation(cities[nextIndex]);
    }

    if (legendSpin) {
      legendSpin.addEventListener('click', toggleAutoSpin);
    }
    if (legendReverse) {
      legendReverse.addEventListener('click', reverseSpinDir);
    }

    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input somewhere
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      
      if (e.key === 's' || e.key === 'S') {
        toggleAutoSpin();
      } else if (e.key === 'r' || e.key === 'R') {
        reverseSpinDir();
      } else if (e.key === 'ArrowRight') {
        cycleCity(1);
      } else if (e.key === 'ArrowLeft') {
        cycleCity(-1);
      } else if (e.key === 'Escape') {
        hidePopup();
      }
    });


    // Resize handler for high-DPI / Retina displays
    function resizeCanvas() {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      viewWidth = rect.width || stage.clientWidth || 860;
      viewHeight = rect.height || stage.clientHeight || 520;

      canvas.width = Math.round(viewWidth * dpr);
      canvas.height = Math.round(viewHeight * dpr);
      canvas.style.width = `${viewWidth}px`;
      canvas.style.height = `${viewHeight}px`;

      // Transform context so all drawing coordinates remain in CSS logical pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Radius sized to keep the entire globe and surrounding HUD/labels completely visible
      // Increased from 0.35 to 0.45 to fill more space in full screen mode
      baseRadius = Math.min(viewWidth, viewHeight) * 0.45;
    }

    window.addEventListener('resize', resizeCanvas);
    if (window.ResizeObserver) {
      new ResizeObserver(resizeCanvas).observe(stage);
    }
    resizeCanvas();
  
