const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  await page.goto('http://localhost:5173/globe-test.html');
  await page.waitForTimeout(1000);
  
  console.log("Pressing right arrow...");
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1000);
  
  const display = await page.$eval('#pin-popup', el => window.getComputedStyle(el).display);
  const opacity = await page.$eval('#pin-popup', el => window.getComputedStyle(el).opacity);
  const left = await page.$eval('#pin-popup', el => el.style.left);
  const top = await page.$eval('#pin-popup', el => el.style.top);
  const hidden = await page.$eval('#pin-popup', el => el.hidden);
  
  console.log("Popup state:", { display, opacity, left, top, hidden });
  
  await page.screenshot({ path: 'debug.png' });
  await browser.close();
})();
