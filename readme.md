Good morning campers!

In the spirit of love and togetherness, I present to you a solution to your tedious pointing and clicking, after all, why do something when you can make a computer do it for you?

THINGS YOU WILL NEED:

1. First, make sure to change the kudos.sh file to an executable like so:

   - chmod +x kudos.sh

2. You need three files in your data folder, the first one should be passed around by the group:

   - people.json: these are all your buddies, it's a JSON list of objects with the following schema:

     - {name: string, linkedin: {url: string, didVisit: boolean}, github: {url: string, didVisit: boolean}}

   - projects.json: this I think you can actually seed with an empty object, since the script is just going to go through all the OSLabs repos and star them.

   - credentials.json: this is your login information for github and linkedin. this should have the following shape:

     - {username: string, linkedin: {username: string, password: string}, github: {username: string, password: string}}

     NOTE: your username here should match the username on the people.json, as it's used to skip you and prevent the crash that happens if you go to your own page (it's not the same setup as other people's sites and it will freak out)

3. Then you just have to run the kudos script:

   - ./kudos.sh

4. Due to the fragile nature of surfing the radical net with puppeteer, you might have to try more than once to get everyone. The JSON files will remember who you've already successfully helped.

5. There are a couple of flags you can set if you run a specific file directly:

   - reset (-r, --reset): resets the seen flags for whichever script you're running

   - view (-v, --view): by default this script runs puppeteer in headless mode, and doesn't load any images, css, or fonts in order to save time / bandwidth. if you set this flag, you can see all your friends' faces as you programmatically tell them that you believe in their abilities.

That should be it! If you have any questions / concerns / suggestions, you can probably direct them to Aryeh, but this is Steve B speaking, so that's an easy call for me to make. (You can come to me as well.)
