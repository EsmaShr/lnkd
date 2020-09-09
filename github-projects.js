/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');

const username = '';
const password = '';
const helpFrenz = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://github.com/login');

    // ----- LOGIN ----- //'
    await page.waitForSelector('#login_field');
    await page.focus('#login_field');
    await page.keyboard.type(username);

    await page.waitForSelector('#password');
    await page.focus('#password');
    await page.keyboard.type(password);

    await page.$('[type="submit"]');
    await page.click('[type="submit"]');

    await page.waitFor(3000);

    const repoClicker = async (arr) => {
      for (let i = 0; i < arr.length; i += 1) {
        const fren = arr[i];
        await page.goto(fren);
        await page.waitForSelector('strong[itemprop="name"]');
        const name = await page.$eval('strong[itemprop="name"]', (foundname) => foundname.innerText);
        try {
          await page.$eval('.unstarred button[type="submit"]', (repo) => repo.click());
        } catch (err) {
          console.log(err);
          continue;
        }
        console.log(`${name} project clicked`);
      }
      return;
    };

    const pageLoader = async (url) => {
      await page.goto(url);
      await page.waitForSelector('.pagination');

      const projectz = await page.evaluate(() => {
        let links = Array.from(document.querySelectorAll('.wb-break-all a'));
        links = links.map(link => link.href);
        return links;
      });
      console.log(projectz)

      await repoClicker(projectz);
      await page.goto(url);
      await page.waitForSelector('.pagination');
      if (await page.$('next_page.disabled')) {
        console.log('undefined... should exit');
        browser.close();
        return undefined;
      }
      const nextPage = await page.evaluate(() => document.querySelector('.next_page').href);
      console.log(nextPage);
      return pageLoader(nextPage);
    };
    await pageLoader('https://github.com/oslabs-beta?page=1');
    browser.close();
  } catch (err) {
    console.log(err);
  }
};
helpFrenz();
