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
  saveToFile,
  resetSeen,
  resetFlagSet,
} = require("./utils/fileUtils");
const {
  preventStaticAssetLoading,
  login,
  launchPage,
} = require("./utils/puppeteerUtils");
// #susi-modal-google-button a

// Email input class
// whsOnd zHQkBf

const helpClapMedium = async () => {
  const frenz = getFromFile("people.json");
  const { username } = getFromFile("credentials.json");
  const saveSeen = saveToFile("people.json");
  try {
    await blah;
    browser.close();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  helpClapMedium,
};
