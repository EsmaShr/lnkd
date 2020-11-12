const puppeteer = require("puppeteer");
const fs = require("fs");
const {
  getFromFile,
  saveToFile,
} = require("./utils/fileUtils");
const {
  preventStaticAssetLoading,
  launchPage,
} = require("./utils/puppeteerUtils");

const twitterFollower = async () => {
  const { username, twitter } = getFromFile('credentials.json')
  const { handle, password } = twitter;
  const LOGIN_URL = 'https://twitter.com/login?lang=en'

  const saveSeen = saveToFile("people.json");
  
  const friends = getFromFile('people.json')
  const twitterInputsSelector = 'label div div div input'
  try {
    // log in to Twitter
    let { page, browser } = await launchPage();
    page = await preventStaticAssetLoading(page)
    await page.goto(LOGIN_URL)
    
    await page.waitFor(300)
    await page.keyboard.type(handle);
    await page.keyboard.press('Tab');
    await page.waitFor(300)
    await page.keyboard.type(password);
    await page.waitFor(300);
    await page.keyboard.press('Enter');
    await page.waitFor(500)
    // now we should be at the homepage.
    // we need to isolate each user, go to their page, press the follow button
    try {
      for (const friend of friends) {
        
        if (!friend.twitter || !friend.twitter.handle ) {
          console.log(`${friend.name} hasn't included a Twitter handle! Skipping...`)
          continue;
        }
        if (friend.twitter.handle === handle) {
          console.log(` --- "${friend.twitter.handle}" is you! Skipping...`)
          continue;
        }
        if (friend.twitter.didVisit) {
          console.log(` --- You've already visited ${friend.twitter.handle}! Skipping...`)
          continue;
        }
        await page.waitFor(500)
        await page.goto(`https://www.twitter.com/${friend.twitter.handle}`)

        console.log(`checking twitter handle: "${friend.twitter.handle}"`)
        try {
          for (let i = 0; i < 50; i ++) {
            await page.keyboard.press("Tab")
            const focused = await page.evaluateHandle(() => document.activeElement);
            const focusedText = await page.evaluate(focused => focused.textContent, focused)
            if (focusedText === "Follow") {
              await page.waitFor(500)
              await page.keyboard.press("Enter")
              await page.waitFor(500)
              console.log(`You followed ${friend.twitter.handle}!`)
              break;
            } else if (focusedText === "Following") {
              console.log(`Looks like you're already following "${friend.twitter.handle}`)
              break;
            }
          }
        
          await page.waitFor(1000)
        // if you're already following, there will be a modal. Ignore it.
          friend.twitter.disVisit = true
          saveSeen(friends);
          
        } catch (err) {
          console.log('error in twitter - clicking follow button', err)
        }
      } 
    } catch (err) {
      console.log('error in loading twitter friends', err)
    }
    browser.close()
  } catch (err) {
    console.log('error in twitter follower:', err)
  }
};

module.exports = {
  twitterFollower,
};