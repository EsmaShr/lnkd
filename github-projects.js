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
const OS_LABS_URL = 'https://github.com/oslabs-beta?page=1';

let frenz = getFromFile('projects.json');
const saveSeen = saveToFile('projects.json');

// if (resetFlagSet()) frenz = resetSeen(frenz);

const helpGitHubFriends = async () => {
  try {
    let { page, browser } = await launchPage();

    // prevents loading of images / css assets / fonts
    page = await preventStaticAssetLoading(page);

    await page.goto(GITHUB_LOGIN_URL);

    // LOGIN
    page = await login(page, 'github');

    const repoClicker = async (projectList) => {
      for (let fren of projectList) {
        if (frenz[fren]) {
          if (frenz[fren].didVisit) {
            console.log(`${frenz[fren].name} --- already clicked --- skipping.`);
            continue;
          }
        }
        await page.goto(fren);
        await page.waitForSelector('strong[itemprop="name"]');
        const name = await page.$eval(
          'strong[itemprop="name"]',
          (foundname) => foundname.innerText
        );
        try {
          await page.$eval('.unstarred button[type="submit"]', (repo) => repo.click());
        } catch (err) {
          console.log(err);
          continue;
        }
        frenz[fren] = { name, url: fren, didVisit: true };
        saveSeen(frenz);
        console.log(`${name} project clicked`);
      }
      return;
    };

    const pageLoader = async (url) => {
      await page.goto(url);
      await page.waitForSelector('.pagination');

      const projectz = await page.evaluate(() => {
        let links = Array.from(document.querySelectorAll('.wb-break-all a'));
        links = links.map((link) => link.href);
        return links;
      });
      // console.log(projectz);

      await repoClicker(projectz);

      // go back to page to visit next group of projects
      await page.goto(url);
      await page.waitForSelector('.pagination');

      const nextPage = await page.evaluate(() => document.querySelector('.next_page').href);
      if (!nextPage) {
        console.log('No more pages found.  Exiting...');
        browser.close();
        return undefined;
      }
      console.log(nextPage);
      return pageLoader(nextPage);
    };
    await pageLoader(OS_LABS_URL);
    browser.close();
  } catch (err) {
    console.log(err);
  }
};
// helpGitHubFriends();

module.exports = {
  helpGitHubFriends,
}