const fs = require('fs');
const assert = require('assert');
const puppeteer = require('puppeteer');
const uuidv4 = require('uuid/v4');

/* global fetch, FileReader */

// 解析 base64
const parseDataUrl = (dataUrl) => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error('Could not parse data URL');
  }
  return { mime: matches[1], buffer: Buffer.from(matches[2], 'base64') };
};

/**
 * querySelectorAll get all html attribute src to parse data
 * @returns {object} { fileName: fileName[0], dataUrl: reader.result }
 */
const getDataUrlThroughFetch = async (selector, options = {}) => {
  const images = document.querySelectorAll(selector);

  return Promise.all([].map.call(images, async (image) => {
    const url = image.src;

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Could not fetch image, (status ${response.status})`);
    }

    const fileName = url.match(/[.|\w|\s|-]*\.(?:jpg|jpeg|gif|png)/) || [uuidv4()];

    const data = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.addEventListener('loadend', () => resolve({
        fileName: fileName[0],
        dataUrl: reader.result,
      }));
      reader.readAsDataURL(data);
    });
  }));
};

/**
 * scroll waterfall website
 */
const scrapeInfiniteScrollDown = async (page, scrollDelay = 1000) => {
  async function recursiveScrollDown() {
    const previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitFor(scrollDelay);
    const currentHeight = await page.evaluate('document.body.scrollHeight');

    if (currentHeight > previousHeight) {
      await recursiveScrollDown();
    }

    return false;
  }

  await recursiveScrollDown();
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
  });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/timliaoig.beauty/');

  await scrapeInfiniteScrollDown(page, 1000);

  const options = { cache: 'no-cache' };
  const dataUrls = await page.evaluate(
    getDataUrlThroughFetch,
    '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div > div img',
    options,
  );

  dataUrls.forEach((data) => {
    const { mime, buffer } = parseDataUrl(data.dataUrl);
    assert.equal(mime, 'image/jpeg');
    fs.writeFileSync(`./images/${data.fileName}.jpeg`, buffer, 'base64');
  });

  await browser.close();
})();
