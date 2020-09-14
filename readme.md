# Welcome to lnkd!
In the spirit of love and togetherness, I present to you a solution to your tedious pointing and clicking, after all, why do something when you can make a computer do it for you?

Steps

1. Install dependencies and run the app:
   - Clone this repo 
   - Run `npm install`
   - Run `npm run kudos`
2. After you answer a few questions, you will be asked to connect the application with Google. 
   - Note that you will get a security warning. You will get to a page that says that the app isn't verified by Google. 
   - Click advanced and then click "go to lnkd unsafe"
   - After you allow the app to talk to Google, you will be given an a code to paste back in the terminal. Note that the copy button doesn't seem to work all the time. I suggest highligting and copying with cmd + c.
3. Three files will be generated for you after you verify with Google
   - data/credentials.json: this is the username and password
   - data/people.json: this is the cohort info generated from the Google spreadsheet, it is based on the cohort number you entered during setup. 
   - token.json: this is the access token that was generated from Google OAuth
4. Now you can start endorsing! 
   - `npm run kudos`
   - Select which script you would like to run
   - If you'd like to switch to previous cohort to support them, select option 5
5. Due to the fragile nature of surfing the radical net with puppeteer, you might have to try more than once to get everyone. The JSON files will remember who you've already successfully helped. Just run the script again. 
6. If you'd like to reset the didVisit flags, you can select option 6 in the menu. 

7. There are a couple of flags you can set if you run a specific file directly:

   - reset (-r, --reset): resets the seen flags for whichever script you're running

   - view (-v, --view): by default this script runs puppeteer in headless mode, and doesn't load any images, css, or fonts in order to save time / bandwidth. if you set this flag, you can see all your friends' faces as you programmatically tell them that you believe in their abilities.

That should be it! If you have any questions / concerns / suggestions, each out to me, Aryeh from cohort 20 or Steve B from cohort 19.
