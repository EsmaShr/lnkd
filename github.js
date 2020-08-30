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
const frenz = [];
const helpFrenz = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
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

    for (let i = 0; i < frenz.length; i += 1) {
      const fren = frenz[i];
      await page.goto(fren);
      const name = await page.$eval('.p-name', (item) => item.innerText);
      await page.evaluate(() => document.querySelector('.js-form-toggle-target input[value="Follow"]').click())
      const repoPage = await page.evaluate(() => {
        const root = window.location.origin;
        const clickLink = document.querySelector('.UnderlineNav-body a:nth-child(2)').getAttribute('href');
        return root + clickLink;
      });
      console.log(repoPage);
      await nextPage(repoPage);

      async function nextPage(url) {
        await page.goto(url);
        await page.$('#user-repositories-list');
        console.log('repos loaded');
        const repos = await page.$$('button[value="Star"]');
        console.log(repos.length);
        if (repos.length !== 0) {
          for (const repo of repos) {
            repo.click();
            await page.waitFor(150);
            console.log(`repo clicked for ${name}`);
          }
        } else {
          console.log(`no more repos to click on this page for ${name}`);
        }
        try {
          const nextText = await page.evaluate(() => document.querySelector('.BtnGroup').childNodes[1].innerText);
          const moreRepos = await page.evaluate(() => document.querySelector('.BtnGroup').childNodes[1].getAttribute('href'));
          if (nextText === 'Next' && moreRepos !== null) {
            console.log('link to more repos ', moreRepos);
            await nextPage(moreRepos);
          } else {
            return;
          }
        } catch (err) {
          return;
        }
      }
    }
    browser.close()
  } catch (err) {
    console.log(err);
  }
};
helpFrenz();
