/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const puppeteer = require("puppeteer");

const fs = require("fs");
const {
  getFromFile,
  saveToFile,
  resetSeen,
  resetFlagSet,
} = require("./utils/fileUtils");
const {
  preventStaticAssetLoading,
  login,
  launchPage,
} = require("./utils/puppeteerUtils");

const LOGIN_PAGE_URL =
  "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin";

if (resetFlagSet()) frenz = resetSeen(frenz, "linkedin");

const bulkAddFriends = async () => {
  const frenz = getFromFile("people.json");
  const { username } = getFromFile("credentials.json");
  try {
    let { page, browser } = await launchPage();

    // prevents loading of images / css assets / fonts
    page = await preventStaticAssetLoading(page);

    await page.goto(LOGIN_PAGE_URL);

    // LOGIN
    page = await login(page, "linkedin");

    const bulkUrl = "";

    await page.goto(bulkUrl);
    await page.waitForSelector(".pv-top-card--list");
    await page.click('[data-control-name="topcard_view_all_connections"]');

    // wait for div with buttons to load
    async function pageLoader() {
      await page.waitForSelector('[data-control-name="srp_profile_actions"]');
      const buttons = await page.$$(
        '[data-control-name="srp_profile_actions"]'
      );
      for (button of buttons) {
        await button.click();
        console.log("someone clicked");
        try {
          await page.waitForSelector('[aria-label="Send now"]', {
            timeout: 1500,
          });
          await page.click('[aria-label="Send now"]', { timeout: 1500 });
          await page.waitFor(1200);
        } catch {
          console.log("moving on");
        }
      }
      try {
        await page.$eval('[aria-label="Next"]', (next) => next.click());
        await pageLoader();
      } catch {
        pageLoader();
      }
    }
    const pageFriends = await page.evaluate(() => {
      return document.querySelector(
        '[data-control-name="topcard_view_all_connections"]'
      ).href;
    });
    await page.goto(pageFriends);
    await pageLoader();
  } catch (err) {
    console.log(err);
  }
};

// helpLinkedInFriends();
bulkAddFriends();

module.exports = {
  bulkAddFriends,
};
