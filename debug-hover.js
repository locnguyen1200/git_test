const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));

  await page.goto('http://localhost:5173/photography.html');
  
  // Set theme to matrix to be sure
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'matrix'));

  console.log('Hovering banner...');
  await page.hover('.globe-dossier-banner');
  
  // Wait a bit to let it draw
  await page.waitForTimeout(500);
  
  const canvasData = await page.evaluate(() => {
    const canvas = document.getElementById('globe-portal-canvas');
    return canvas ? true : false;
  });
  console.log('Canvas exists:', canvasData);
  
  await browser.close();
})();
