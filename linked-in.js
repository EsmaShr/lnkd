/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const puppeteer = require('puppeteer');

// ----------- FILL IN USERNAME AND PASS AND LINKEDIN URLS INTO FRENZ ARRAY ------------//
const username = '';
const password = '';
const frenz = [];

const helpFrenz = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // set to reasonable size to see what's going on... comment out if you set headless: true
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');
    await page.waitForSelector('#username');
    await page.focus('#username');
    await page.keyboard.type(username);

    await page.waitForSelector('#password');
    await page.focus('#password');
    await page.keyboard.type(password);

    await page.waitForSelector('button.btn__primary--large.from__button--floating');
    await page.click('button.btn__primary--large.from__button--floating');

    // wait for 4 seconds... helps block the linkedin authwall for some reason
    await page.waitFor(4000);

    for (let i = 0; i < frenz.length; i += 1) {
      const fren = frenz[i];
      await page.goto(fren);
      const name = await page.$eval('.pv-top-card--list li:first-child', (item) => item.innerText);
      // check for pending connection
      if (await page.$('.artdeco-button--disabled') !== null) {
        console.log(`pending connection with ${name}`);
        continue;
      }

      // if you can dm then you are connected and we can scroll down to skills... otherwise add connection and move on
      if (await page.$('.pv-s-profile-actions--message') !== null) {
        await page.evaluate(() => {
          window.scrollTo({
            left: 0,
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        });

        // if no click more skills button... they probably haven't added anything relevant... also skips over people who haven't added shit
        try {
          await page.waitForSelector('.pv-skills-section__chevron-icon', { timeout: 3000 });
          await page.click('.pv-skills-section__chevron-icon');
          const skillz = await page.$$('[type="plus-icon"]');
          if (skillz.length !== 0) {
            for (const skill of skillz) {
              await skill.click();
              console.log(`skill clicked for ${name}`);
              // press escape to clear the popup so other items are able to be clicked... sometimes the popup blocks the button
              await page.waitForSelector('.artdeco-hoverable-content');
              await page.keyboard.type(String.fromCharCode(13));
            }
          }
          console.log(`no skills to click for ${name}`);
        } catch (err) {
          continue;
        }
      } else {
        // add fren and move on
        await page.waitForSelector('.pv-s-profile-actions--connect');
        await page.click('.pv-s-profile-actions--connect');
        await page.waitForSelector('.artdeco-modal__actionbar .artdeco-button--primary');
        await page.click('.artdeco-modal__actionbar .artdeco-button--primary');
      }
    }
    browser.close();
  } catch (err) {
    console.log(err);
  }
};

helpFrenz();
