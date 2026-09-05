import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/globe-test.html', { waitUntil: 'networkidle0' });
  
  // Switch to Midnight theme
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'midnight');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/Users/minhlocnguyen/.gemini/antigravity/brain/8e93ae49-916a-45be-ae49-371a079aa3d5/scratch/globe_resolution.png' });
  
  await browser.close();
})();

