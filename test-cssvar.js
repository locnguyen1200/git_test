const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/photography.html');
  
  const val = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim();
  });
  console.log('CSS VAR IS:', val);
  
  await browser.close();
})();
