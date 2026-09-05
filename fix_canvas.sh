sed -i '' -e 's/ctx.font = isSelected/const currentThemeFont = window.getComputedStyle(document.body).getPropertyValue("--theme-font").trim();\
          const baseSizeStr = window.getComputedStyle(document.body).getPropertyValue("--ui-size-base").trim() || "12px";\
          ctx.font = isSelected/g' /Users/minhlocnguyen/repos/git_test/globe-test.html

sed -i '' -e 's/bold 12px "Share Tech Mono", "VT323", monospace/bold ${baseSizeStr} ${currentThemeFont}/g' /Users/minhlocnguyen/repos/git_test/globe-test.html
sed -i '' -e 's/12px "Share Tech Mono", "VT323", monospace/${baseSizeStr} ${currentThemeFont}/g' /Users/minhlocnguyen/repos/git_test/globe-test.html
