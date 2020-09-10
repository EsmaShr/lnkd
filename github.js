/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const { getFromFile, saveToFile, resetSeen, resetFlagSet } = require('./utils/fileUtils');
const { preventStaticAssetLoading, login, launchPage } = require('./utils/puppeteerUtils');

const GITHUB_LOGIN_URL = 'https://github.com/login';

let frenz = getFromFile('people.json');
const { username } = getFromFile('credentials.json');
const saveSeen = saveToFile('people.json');

if (resetFlagSet()) frenz = resetSeen(frenz, 'github');

const helpFrenz = async () => {
  try {
    let { page, browser } = await launchPage();

    // prevents loading of images / css assets / fonts
    page = await preventStaticAssetLoading(page);

    await page.goto(GITHUB_LOGIN_URL);

    // LOGIN
    page = await login(page, 'github');
    for (let fren of frenz) {
      if (fren.github.didVisit) {
        console.log(`${fren.name} --- already helped --- skipping....`);
        continue;
      }
      if (fren.name === username) {
        console.log(`${fren.name} --- is you --- skipping....`);
        continue;
      }
      if (!fren.github.url.length) {
        console.log(`${fren.name} --- no url found --- skipping....`);
        continue;
      }
      await page.goto(fren.github.url);
      const { name } = fren;
      await page.evaluate(() =>
        document.querySelector('.js-form-toggle-target input[value="Follow"]').click()
      );
      const repoPage = await page.evaluate(() => {
        const root = window.location.origin;
        const clickLink = document
          .querySelector('.UnderlineNav-body a:nth-child(2)')
          .getAttribute('href');
        return root + clickLink;
      });
      // console.log(repoPage);
      await nextPage(repoPage);

      async function nextPage(url) {
        await page.goto(url);
        await page.$('#user-repositories-list');
        // console.log('repos loaded');
        const repos = await page.$$('button[value="Star"]');
        console.log(repos.length, 'repos found for', name);
        if (repos.length !== 0) {
          for (const repo of repos) {
            repo.click();
            await page.waitFor(150);
            console.log(`repo clicked for ${name}`);
          }
          fren.github.didVisit = true;
          saveSeen(frenz);
        } else {
          fren.github.didVisit = true;
          saveSeen(frenz);
          console.log(`no more repos to click on this page for ${name}`);
        }
        try {
          const nextText = await page.evaluate(
            () => document.querySelector('.BtnGroup').childNodes[1].innerText
          );
          const moreRepos = await page.evaluate(() =>
            document.querySelector('.BtnGroup').childNodes[1].getAttribute('href')
          );
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
    browser.close();
  } catch (err) {
    console.log(err);
  }
};
helpFrenz();
