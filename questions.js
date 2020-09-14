const inquirer = require('inquirer');
const fs = require('fs');
const { makeFilePath, getFromFile } = require('./utils/fileUtils');
const { helpGitHubFriends } = require('./github-projects');
const { helpGitHubRepos } = require('./github');
const { helpLinkedInFriends } = require('./linked-in');
const { oauthAndCreate } = require('./createPeople');

const credentialsPath = makeFilePath('credentials.json');
const credentials = getFromFile('credentials.json');

inquirer
  .prompt([
    {
      name: 'script',
      type: 'rawlist',
      message: 'Which app would you like to run?',
      choices: ['Login, select cohort and build people object', 'Endorse all skills on LinkedIn', 'Star all OSLabs projects', 'Star all github repos', 'Switch to another cohort', new inquirer.Separator(), 'Start fresh'],
    },
    {
      name: 'cohort',
      message: 'Which cohort would you like to support?',
      type: 'number',
      when: (answer) => answer.script === 'Switch to another cohort',
      
    },
  ])
  .then((answer) => {
  // changing cohort so rebuild the people.json with new cohort
    if (answer.cohort && answer.script === 'Switch to another cohort') {
      credentials.cohort = answer.cohort;
      fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
      oauthAndCreate();
    }
    if (answer.script === 'Endorse all skills on LinkedIn') {
      helpLinkedInFriends();
    }
    if (answer.script === 'Star all OSLabs projects') {
      helpGitHubFriends();
    }
    if (answer.script === 'Star all github repos') {
      helpGitHubRepos();
    }
    if (answer.script === 'Start fresh' || answer.script === 'Login, select cohort and build people object') {
      createCohort();
    }
  });

  function startQuiz() {

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
    ])
    .then((answer) => {
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
      fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
      oauthAndCreate();
    });
}
