const inquirer = require('inquirer');
const fs = require('fs');
const CFonts = require('cfonts');
const { makeFilePath, getFromFile, resetDidVisit } = require('./utils/fileUtils');
const { helpGitHubFriends } = require('./github-projects');
const { helpGitHubRepos } = require('./github');
const { helpClapMedium } = require('./medium');
const { bulkAddOpenSource } = require('./open-source');
const { helpLinkedInFriends } = require('./linked-in');
const { readSpreadsheet } = require('./google-reader');

const credentialsPath = makeFilePath('credentials.json');
const credentials = getFromFile('credentials.json');
function startQuiz() {
  inquirer
    .prompt([
      {
        name: 'script',
        type: 'rawlist',
        message: 'Which app would you like to run?',
        choices: ['Start here... enter credentials and build', 'Endorse all skills on LinkedIn', 'Star all OSLabs projects', 'Follow all on github and star all of their pinned repos', 'Switch to another cohort', new inquirer.Separator(), 'Run visible?', 'Make some friends... connect with all that work at Open Source', 'Clap for your friends', 'Start fresh', 'Reset didVisit'],
      },
      {
        name: 'cohort',
        message: 'Which cohort would you like to support?',
        type: 'number',
        when: (answer) => answer.script === 'Switch to another cohort',
      },
      {
        name: 'headless',
        message: 'Do you want the browser to be visible?',
        type: 'confirm',
        when: (answer) => answer.script === 'Run visible?',
      },
      {
        name: 'reset',
        type: 'rawlist',
        message: 'Which would you like to reset?',
        choices: ['linkedin', 'github', 'all'],
        when: (answer) => answer.script === 'Reset didVisit',
      },
    ])
    .then((answer) => {
    // changing cohort so rebuild the people.json with new cohort
      if (answer.cohort && answer.script === 'Switch to another cohort') {
        credentials.cohort = answer.cohort;
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
        readSpreadsheet();
      }
      if (answer.script === 'Run visible?') {
        credentials.isVisible = answer.headless;
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
        startQuiz();
      }
      if (answer.script === 'Make some friends... connect with all that work at Open Source') {
        bulkAddOpenSource();
      }
      if (answer.script === 'Endorse all skills on LinkedIn') {
        helpLinkedInFriends();
      }
      if (answer.script === 'Star all OSLabs projects') {
        helpGitHubFriends();
      }
      if (answer.reset) {
        const peoplePath = makeFilePath('people.json');
        let frenz = getFromFile('people.json');
        frenz = resetDidVisit(frenz, answer.reset);
        fs.writeFileSync(peoplePath, JSON.stringify(frenz));
      }
      if (answer.script === 'Follow all on github and star all of their pinned repos') {
        helpGitHubRepos();
      }
      if (answer.script === 'Clap for your friends') {
        mediumSetup();
      }
      if (answer.script === 'Start fresh' || answer.script === 'Start here... enter credentials and build') {
        createCohort();
      }
    });
}

function mediumSetup() {
  inquirer
    .prompt([
      {
        name: 'gmail_username',
        message: 'What is your gmail username?',
      },
      {
        name: 'gmail_password',
        type: 'password',
        mask: '*',
        message: 'What is your gmail password?',
      },
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Are you pretty sure you entered everything in correctly???',
      },
    ])
    .then((answer) => {
      if (answer.confirm) {
        credentials.gmail = {
          gmail_user: answer.gmail_username,
          password: answer.gmail_password,
        };
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
        helpClapMedium();
      } else {
        console.log('cool... let\'s try again');
        mediumSetup();
      }
    })
}

function createCohort() {
  inquirer
    .prompt([
      {
        name: 'firstname',
        message: 'What is your first name?',
      },
      {
        name: 'lastname',
        message: 'What is your last name?',
      },
      {
        name: 'github_username',
        message: 'What is your github username?',
      },
      {
        name: 'github_password',
        type: 'password',
        mask: '*',
        message: 'What is your github password?',
      },
      {
        name: 'linkedin_username',
        message: 'What is your linkedin username?',
      },
      {
        name: 'linkedin_password',
        mask: '*',
        type: 'password',
        message: 'What is your linkedin password?',
      },
      {
        name: 'cohort',
        type: 'number',
        message: 'What cohort are you supporting today?',
      },
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Are you pretty sure you entered everything in correctly???',
      },
    ])
    .then((answer) => {
      if (answer.confirm) {
        credentials.username = `${answer.firstname} ${answer.lastname}`;
        credentials.github = {
          username: answer.github_username,
          password: answer.github_password,
        };
        credentials.linkedin = {
          username: answer.linkedin_username,
          password: answer.linkedin_password,
        };
        credentials.cohort = answer.cohort;
        credentials.firstname = answer.firstname;
        // credentials.isVisible = true;
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
        readSpreadsheet();
      } else {
        console.log('K, cool.... let\'s try that again');
        createCohort();
      }
    });
}

CFonts.say(`Hi ${credentials.firstname || 'Friend'}!!!`, {
  font: 'pallet',
  space: false,
  gradient: ['#F61CB9', '#07D569', '#1C92F6'],
  transitionGradient: true,
});
startQuiz();
