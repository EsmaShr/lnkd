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

const getProjects = () => {
  const rawProjects = fs.readFileSync('projects.json');
  const parsed = JSON.parse(rawProjects);
  return parsed.projects;
};

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const frenz = getProjects();
const helpFrenz = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1280, height: 800 });
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
    browser.close();
  } catch (err) {
    console.log(err);
  }
};
helpFrenz();
