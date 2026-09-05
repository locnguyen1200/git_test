const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/globe-test.html');
  
  // Press Right Arrow
  await page.keyboard.press('ArrowRight');
  
  // Wait for animation
  await page.waitForTimeout(1000);
  
  // Check if popup is visible
  const isHidden = await page.$eval('#pin-popup', el => el.hidden);
  const opacity = await page.$eval('#pin-popup', el => window.getComputedStyle(el).opacity);
  const left = await page.$eval('#pin-popup', el => window.getComputedStyle(el).left);
  const html = await page.$eval('#popup-body', el => el.innerHTML);
  
  console.log({ isHidden, opacity, left, bodyLength: html.length });
  
  await browser.close();
})();
