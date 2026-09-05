const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/photography.html');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'matrix'));
  await page.waitForTimeout(500);

  // Take pre-hover screenshot
  const element = await page.$('.globe-dossier-banner');
  await element.screenshot({ path: 'pre-hover.png' });

  // Hover
  await page.hover('.globe-dossier-banner');
  await page.waitForTimeout(500);
  
  // Take post-hover screenshot
  await element.screenshot({ path: 'post-hover.png' });
  
  await browser.close();
})();
