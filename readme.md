# Welcome to lnkd!
In the spirit of love and togetherness, I present to you a solution to your tedious pointing and clicking, after all, why do something when you can make a computer do it for you?

Steps

1. Install dependencies and run the app:
   - Clone this repo 
   - Run `npm install`
   - Run `npm run kudos`
   - Select Option 1
2. Two files will be generated
   - data/credentials.json: this is the username and password object
   - data/people.json: this is the cohort info generated from the Google spreadsheet, it is based on the cohort number you entered during setup
4. Now you can start endorsing! 
   - `npm run kudos`
   - Select which script you would like to run
   - If you'd like to switch to previous cohort to support them, select option 5
5. Due to the fragile nature of surfing the radical net with puppeteer, you might have to try more than once to get everyone. The JSON files will remember who you've already successfully helped. Just run the script again. 
   - Linkedin is the trickiest one... it sometimes times out. If it does, just run again, it will remember your place.
6. If you'd like to reset the didVisit flags, you can select option 6 in the menu
   - If you are not following folks on Linked in, the connections will need to approve you. You'll need to run again once approved. Wait a few days and run again! If there is a pending connection, you'll get a notice in the terminal.
7. There are a couple of flags you can set if you run a specific file directly:

   - reset (-r, --reset): resets the seen flags for whichever script you're running

   - view (-v, --view): by default this script runs puppeteer in headless mode, and doesn't load any images, css, or fonts in order to save time / bandwidth. if you set this flag, you can see all your friends' faces as you programmatically tell them that you believe in their abilities.

That should be it! If you have any questions / concerns / suggestions, each out to me, Aryeh from cohort 20 or Steve B from cohort 19.
