/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const puppeteer = require('puppeteer');

const fs = require('fs');
const {
  getFromFile,
  saveToFile,
  resetSeen,
  resetFlagSet,
} = require('./utils/fileUtils');
const {
  preventStaticAssetLoading,
  login,
  launchPage,
} = require('./utils/puppeteerUtils');

const LOGIN_PAGE_URL = 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin';

if (resetFlagSet()) frenz = resetSeen(frenz, 'linkedin');

const bulkAddOpenSource = async () => {
  const frenz = getFromFile('people.json');
  const { username } = getFromFile('credentials.json');
  try {
    let { page, browser } = await launchPage();

    // prevents loading of images / css assets / fonts
    page = await preventStaticAssetLoading(page);

    await page.goto(LOGIN_PAGE_URL);

    // LOGIN
    page = await login(page, 'linkedin');

    const bulkUrl = 'https://www.linkedin.com/company/open-source-reactvt/people/';

    await page.goto(bulkUrl);
    await page.waitForSelector('.org-people-profiles-module__profile-list');

    // first we need to delete the message area
    await page.evaluate(() => {
      const messages = document.querySelector(
        '.msg-overlay-list-bubble--expanded',
      );
      messages.parentNode.removeChild(messages);
    });

    // dom loads 12 people at a time... let's load a bunch by scrolling to the bottom of the page a bunch of times
    for (let i = 0; i < 13; i += 1) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitFor(2500);
    }

    const openSourceFriends = await page.$$(
      '.org-people-profile-card button[type="button"]',
    );
    for (friend of openSourceFriends) {
      await friend.click();
      console.log('open source friend added');
      await page.waitForSelector('[aria-label="Send now"]', {
        timeout: 1500,
      });
      await page.click('[aria-label="Send now"]', { timeout: 1500 });
      await page.waitFor(500);
    }
  } catch (err) {
    console.log(err);
  }
};

// helpLinkedInFriends();

module.exports = {
  bulkAddOpenSource,
};
