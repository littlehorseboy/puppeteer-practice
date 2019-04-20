const fs = require('fs');
const assert = require('assert');
const puppeteer = require('puppeteer');
const uuidv4 = require('uuid/v4');

/* global fetch, FileReader */

const parseDataUrl = (dataUrl) => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error('Could not parse data URL');
  }
  return { mime: matches[1], buffer: Buffer.from(matches[2], 'base64') };
};

const getDataUrlThroughFetch = async (selector, options = {}) => {
  const images = document.querySelectorAll(selector);

  return Promise.all([].map.call(images, async (image) => {
    const url = image.src;

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Could not fetch image, (status ${response.status})`);
    }

    const data = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.addEventListener('loadend', () => resolve(reader.result));
      reader.readAsDataURL(data);
    });
  }));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
  });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/timliaoig.beauty/');

  const options = { cache: 'no-cache' };
  const dataUrls = await page.evaluate(
    getDataUrlThroughFetch,
    '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div > div img',
    options,
  );

  dataUrls.forEach((dataUrl) => {
    const { mime, buffer } = parseDataUrl(dataUrl);
    assert.equal(mime, 'image/jpeg');
    fs.writeFileSync(`./images/${uuidv4()}.jpeg`, buffer, 'base64');
  });
})();
