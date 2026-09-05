// =============================================================================
// Site Icon & Dynamic Favicon Engine: Globe Behind Rangefinder Camera
// Automatically updates the browser favicon and in-page site icons when theme changes.
// =============================================================================

(function () {
  const THEME_PALETTES = {
    default: {
      primary: "#245782",
      secondary: "#7d9ab3",
      bodyBg: "#e7e9ec",
      bodyStroke: "#172c45",
      globeBg: "#d4dbe2",
      globeLines: "#245782",
      lensGlass: "#172c45",
      accentDot: "#245782"
    },
    midnight: {
      primary: "#ece6d8",
      secondary: "#9c9484",
      bodyBg: "#111111",
      bodyStroke: "#ece6d8",
      globeBg: "#1c1c1c",
      globeLines: "#ece6d8",
      lensGlass: "#050505",
      accentDot: "#ece6d8"
    },
    sepia: {
      primary: "#a0522d",
      secondary: "#c9a36a",
      bodyBg: "#f2e8d5",
      bodyStroke: "#4a3418",
      globeBg: "#e8dcc4",
      globeLines: "#a0522d",
      lensGlass: "#3a240e",
      accentDot: "#a0522d"
    },
    matrix: {
      primary: "#00ff41",
      secondary: "#00b32d",
      bodyBg: "#020a02",
      bodyStroke: "#00ff41",
      globeBg: "#001a00",
      globeLines: "#00ff41",
      lensGlass: "#000800",
      accentDot: "#00ff41"
    },
    blackwhite: {
      primary: "#1a1a1a",
      secondary: "#666666",
      bodyBg: "#ffffff",
      bodyStroke: "#1a1a1a",
      globeBg: "#f0f0f0",
      globeLines: "#1a1a1a",
      lensGlass: "#1a1a1a",
      accentDot: "#1a1a1a"
    },
    twa: {
      primary: "#e0212a",
      secondary: "#eb2130",
      bodyBg: "#f8f5f0",
      bodyStroke: "#211f1d",
      globeBg: "#ece7de",
      globeLines: "#e0212a",
      lensGlass: "#211f1d",
      accentDot: "#eb2130"
    }
  };

  function getIconSvg(themeKey) {
    const c = THEME_PALETTES[themeKey] || THEME_PALETTES.default;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <!-- Globe behind the camera (arcs up behind shoulders and turret) -->
  <g class="site-icon-globe">
    <!-- Globe sphere base -->
    <circle cx="32" cy="25" r="23" fill="${c.globeBg}" stroke="${c.primary}" stroke-width="2.2" />
    <!-- Parallels (latitudes) -->
    <line x1="9" y1="25" x2="55" y2="25" stroke="${c.globeLines}" stroke-width="1.6" />
    <ellipse cx="32" cy="15.5" rx="19.5" ry="6.5" fill="none" stroke="${c.globeLines}" stroke-width="1.3" opacity="0.85" />
    <ellipse cx="32" cy="34.5" rx="19.5" ry="6.5" fill="none" stroke="${c.globeLines}" stroke-width="1.3" opacity="0.85" />
    <!-- Meridians (longitudes) -->
    <line x1="32" y1="2" x2="32" y2="48" stroke="${c.primary}" stroke-width="1.6" />
    <ellipse cx="32" cy="25" rx="11.5" ry="23" fill="none" stroke="${c.globeLines}" stroke-width="1.4" opacity="0.85" />
  </g>

  <!-- Rangefinder Camera in foreground -->
  <g class="site-icon-camera">
    <!-- Camera body (covers lower half of globe cleanly) -->
    <rect x="12" y="27" width="40" height="26" rx="3.5" fill="${c.bodyBg}" stroke="${c.bodyStroke}" stroke-width="2" />
    <!-- Turret / top plate step -->
    <path d="M18 27 L21 22.5 L43 22.5 L46 27 Z" fill="${c.bodyBg}" stroke="${c.bodyStroke}" stroke-width="1.8" stroke-linejoin="round" />
    <!-- Shutter release button -->
    <rect x="22" y="19" width="4.5" height="3.5" rx="0.8" fill="${c.primary}" stroke="${c.bodyStroke}" stroke-width="1" />
    <!-- Winding wheel dial -->
    <rect x="38" y="19.5" width="5.5" height="3" rx="0.6" fill="${c.secondary}" stroke="${c.bodyStroke}" stroke-width="0.8" />
    <!-- Viewfinder window -->
    <rect x="37" y="28.5" width="8" height="4.5" rx="1" fill="${c.lensGlass}" stroke="${c.bodyStroke}" stroke-width="1.2" />
    <rect x="38" y="29.5" width="3" height="2" fill="${c.secondary}" opacity="0.85" />
    <!-- Rangefinder frame window -->
    <rect x="28" y="29.5" width="4.2" height="3" rx="0.6" fill="${c.secondary}" stroke="${c.bodyStroke}" stroke-width="0.8" />
    <!-- Red Dot / Brand Logo Accent -->
    <circle cx="20" cy="35" r="2.2" fill="${c.accentDot}" stroke="${c.bodyStroke}" stroke-width="0.8" />
    <!-- Multi-stage Lens Barrel -->
    <circle cx="32" cy="40" r="10.5" fill="${c.bodyBg}" stroke="${c.bodyStroke}" stroke-width="2" />
    <circle cx="32" cy="40" r="8" fill="${c.primary}" stroke="${c.bodyStroke}" stroke-width="1.2" />
    <circle cx="32" cy="40" r="5.5" fill="${c.lensGlass}" stroke="${c.bodyStroke}" stroke-width="1" />
    <!-- Glass reflection arc -->
    <path d="M28.5 37.5 A 4 4 0 0 1 34.5 37.5" fill="none" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" opacity="0.85" />
  </g>
</svg>`;
  }

  function ensureStyles() {
    if (!document.getElementById("site-icon-styles")) {
      const style = document.createElement("style");
      style.id = "site-icon-styles";
      style.textContent = `
        .site-brand-icon { display: inline-flex; align-items: center; justify-content: center; line-height: 0; }
        .site-brand-icon svg { width: 100%; height: 100%; display: block; }
      `;
      const target = document.head || document.documentElement;
      if (target) target.appendChild(style);
    }
  }

  function applySiteIcon(themeKey) {
    const activeTheme = themeKey || document.documentElement.getAttribute("data-theme") || localStorage.getItem("site-theme") || "default";
    const svgContent = getIconSvg(activeTheme);
    const dataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);

    // 1. Update or create browser favicon link
    const links = document.querySelectorAll("link[rel*='icon']");
    if (links.length === 0) {
      const link = document.createElement("link");
      link.id = "site-favicon";
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = dataUri;
      if (document.head) {
        document.head.appendChild(link);
      }
    } else {
      links.forEach((link) => {
        link.type = "image/svg+xml";
        link.href = dataUri;
      });
    }

    // 2. Update any in-page site icon elements if present
    document.querySelectorAll(".site-brand-icon, [data-site-icon]").forEach((el) => {
      el.innerHTML = svgContent;
    });

    ensureStyles();
  }

  // Run immediately
  const initialTheme = (document.documentElement && document.documentElement.getAttribute("data-theme")) || localStorage.getItem("site-theme") || "default";
  applySiteIcon(initialTheme);

  // Watch for data-theme changes on <html>
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
        const newTheme = document.documentElement.getAttribute("data-theme");
        applySiteIcon(newTheme);
      }
    });
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
  }

  // Watch for cross-tab or cross-window theme changes
  window.addEventListener("storage", (e) => {
    if (e.key === "site-theme") {
      applySiteIcon(e.newValue);
    }
  });

  // Re-apply on DOMContentLoaded to populate any late-parsed .site-brand-icon elements
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applySiteIcon();
      ensureStyles();
    });
  }

  // Expose helper globally
  window.SiteIcon = {
    getIconSvg,
    applySiteIcon,
    THEME_PALETTES
  };
})();
