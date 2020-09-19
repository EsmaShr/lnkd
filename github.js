/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const fs = require('fs');
const {
  getFromFile, saveToFile, resetSeen, resetFlagSet,
} = require('./utils/fileUtils');
const { preventStaticAssetLoading, login, launchPage } = require('./utils/puppeteerUtils');

const GITHUB_LOGIN_URL = 'https://github.com/login';

if (resetFlagSet()) frenz = resetSeen(frenz, 'github');

const helpGitHubRepos = async () => {
  const frenz = getFromFile('people.json');
  const { username } = getFromFile('credentials.json');
  const saveSeen = saveToFile('people.json');
  try {
    const { page, browser } = await launchPage();

    // prevents loading of images / css assets / fonts
    page = await preventStaticAssetLoading(page);

    await page.goto(GITHUB_LOGIN_URL);

    // LOGIN
    page = await login(page, 'github');
    for (const fren of frenz) {
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
      await page.evaluate(() => document.querySelector('.js-form-toggle-target input[value="Follow"]').click());
      console.log(`now following ${name}`);

      // create array of urls from pinned repos
      const pinnedRepos = await page.evaluate(() => Array.from(document.querySelectorAll('.js-pinned-items-reorder-list li .text-bold')).map((item) => item.href));
      if (pinnedRepos.length) {
        for (let i = 0; i < pinnedRepos.length; i += 1) {
          await page.goto(pinnedRepos[i]);
          await page.waitForSelector('strong[itemprop="name"]');
          // grab name of repo
          const repoName = await page.evaluate(() => document.querySelector('strong[itemprop="name"]').innerText);
          try {
            await page.$eval('.unstarred button[type="submit"]', (repo) => repo.click());
            console.log(`repo ${repoName} clicked for ${name}`);
            fren.github.didVisit = true;
            saveSeen(frenz);
          } catch (err) {
            console.log(err);
            continue;
          }
        }
      } else {
        console.log(`${name} hasn't pinned any repos for you to star...`);
      }
    }
    browser.close();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  helpGitHubRepos,
};
