sed -i '' '/let wheelCycleThrottle = 0;/,/}, { passive: false });/c\
    let wheelCycleThrottle = 0;\
    stage.addEventListener('\''wheel'\'', (e) => {\
      e.preventDefault();\
      const now = performance.now();\
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) \&\& Math.abs(e.deltaX) > 15) {\
        if (now - wheelCycleThrottle > 600) {\
          const direction = e.deltaX > 0 ? 1 : -1;\
          cycleCity(direction);\
          wheelCycleThrottle = now;\
        }\
      } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {\
        const delta = e.deltaY > 0 ? -0.1 : 0.1;\
        targetZoom = Math.max(0.65, Math.min(2.1, targetZoom + delta));\
      }\
    }, { passive: false });' /Users/minhlocnguyen/repos/git_test/globe-test.html
