const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/photography.html');
  
  const themes = ['default', 'sepia', 'blackwhite'];
  
  for (const theme of themes) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await page.waitForTimeout(500); // let canvas redraw

    // Idle
    let element = await page.$('.globe-dossier-banner');
    await element.screenshot({ path: `banner-${theme}-idle.png` });

    // Hover
    await page.hover('.globe-dossier-banner');
    await page.waitForTimeout(500); // let animation run
    await element.screenshot({ path: `banner-${theme}-hover.png` });
    
    // reset mouse
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);
  }
  
  await browser.close();
})();
