const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
  });
  const page = await browser.newPage();
  await page.goto('https://littlehorseboy.github.io/react-scrivener/dist/');
  const inputAccount = await page.$('#app > div > div > div > div:nth-child(2) > div > div > input');
  await inputAccount.focus();
  await page.keyboard.down('ControlLeft');
  await page.keyboard.press('a');
  await page.keyboard.up('ControlLeft');
  await inputAccount.type('littlehorseboy');

  const inputPassword = await page.$('#app > div > div > div > div:nth-child(3) > div > div > input');
  await inputPassword.focus();
  await page.keyboard.down('ControlLeft');
  await page.keyboard.press('a');
  await page.keyboard.up('ControlLeft');
  await inputPassword.type('test');

  const submit = await page.$('#app > div > div > div > div.jss8 > button > span.jss163');
  submit.click();

  // await browser.close();
})();
