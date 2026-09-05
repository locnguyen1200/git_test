const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/photography.html');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'default'));
  await page.waitForTimeout(500);

  const element = await page.$('.globe-dossier-banner');
  await element.screenshot({ path: 'pre-hover-default.png' });

  await page.hover('.globe-dossier-banner');
  await page.waitForTimeout(500);
  
  await element.screenshot({ path: 'post-hover-default.png' });
  
  await browser.close();
})();
