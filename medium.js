/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const puppeteer = require("puppeteer");
const fs = require("fs");
const {
  getFromFile,
} = require("./utils/fileUtils");
const {
  preventStaticAssetLoading,
  launchPage,
} = require("./utils/puppeteerUtils");
// #susi-modal-google-button a

// Email input class
// whsOnd zHQkBf

const helpClapMedium = async () => {
  const { username, gmail } = getFromFile("credentials.json");
  const { gmail_user, password } = gmail;
  const URL = 'https://medium.com/m/signin';
  
  const friends = getFromFile('people.json');
  try {
    let { page, browser } = await launchPage();
    page = await preventStaticAssetLoading(page);

    await page.goto(URL);
    await page.waitForSelector('#susi-modal-google-button');
    await page.click('#susi-modal-google-button');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('#view_container');

    await page.waitForSelector('input[type="email"]');
    await page.focus('input[type="email"]');
    await page.keyboard.type(gmail_user);
    await page.keyboard.press('Enter');
    
    await page.waitFor(3000);
    await page.waitForSelector('#view_container');
    await page.waitForSelector('input[type="password"]');
    await page.focus('input[type="password"]');
    await page.keyboard.type(password);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    try {
      for (const friend of friends) {
        await page.goto(friend.medium);
        await page.waitForSelector('body');
        await page.waitForSelector('[data-test-id="post-sidebar"]')
        await page.waitFor(1500)
        await page.evaluate(() => {
          window.scrollTo({
            left: 0,
            top: 1200,
            behavior: "smooth",
          });
        });
        try {
          const clicker = await page.waitForSelector('button svg[aria-label="clap"]', {timeout: 2500});
          for (let i = 0; i <= 50 ; i += 1) {
            await page.click('svg[aria-label="clap"]');
            await page.waitFor(200);
          }
        } catch {
          console.log('moving on because you can\'t click... probably because it\'s your article')
        }
      }
    } catch (err) {
      console.log('all done????', err)
    }
    browser.close();
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  helpClapMedium,
};
