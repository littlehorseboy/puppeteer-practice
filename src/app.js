const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://littlehorseboy.github.io/react-scrivener/dist/');
  await page.screenshot({ path: './__screenshots__/example.png' });

  await browser.close();
})();
