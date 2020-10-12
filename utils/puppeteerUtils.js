const puppeteer = require('puppeteer');
const { getFromFile } = require('./fileUtils');

const isVisible = () => {
  return getFromFile('credentials.json').isVisible;
};

const preventStaticAssetLoading = async (page) => {
  // will only load assets if the page is going to be visible
  if (isVisible()) return page;
  await page.setRequestInterception(true);
  await page.on('request', (req) => {
    const type = req.resourceType();
    if (type === 'image' || type === 'stylesheet' || type === 'font') {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page;
};

const login = async (page, site) => {
  const { password, username } = getFromFile('credentials.json')[site];
  const focusTypes = {
    github: {
      login: '#login_field',
      password: '#password',
      submit: '[type="submit"]',
      wait: 4000,
    },
    linkedin: {
      login: '#username',
      password: '#password',
      submit: 'button.btn__primary--large.from__button--floating',
      wait: 3000,
    },
  };
  console.log('Logging into: ', site);
  await page.waitForSelector(focusTypes[site].login);
  await page.focus(focusTypes[site].login);
  await page.keyboard.type(username);

  await page.waitForSelector(focusTypes[site].password);
  await page.focus(focusTypes[site].password);
  await page.keyboard.type(password);

  await page.$(focusTypes[site].submit);
  await page.click(focusTypes[site].submit);

  await page.waitFor(focusTypes[site].wait);
  return page;
};

const launchPage = async () => {
  const visible = !isVisible();
  const browser = await puppeteer.launch({ headless: visible });
  const page = await browser.newPage();

  // sets a viewing window if the viewport will be visible
  if (!visible) await page.setViewport({ width: 1280, height: 800 });
  return { page, browser };
};

module.exports = {
  preventStaticAssetLoading,
  login,
  launchPage,
};
