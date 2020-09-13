const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { makeFilePath, getFromFile } = require('./utils/fileUtils');

const { oauthAndCreate } = require('./createPeople');

const credentialsPath = makeFilePath('credentials.json');
const credentials = getFromFile('credentials.json');
if (credentials.cohort) {
  inquirer
    .prompt([
      {
        name: 'support_more',
        message: 'It looks like you already ran the script and created a people.json file, would you like to support another cohort?',
        type: 'confirm',
      },
      {
        name: 'cohort',
        message: 'Which cohort would you like to support?',
        type: 'number',
        when: (answer) => answer.support_more === true,
      },
    ])
    .then((answer) => {
      console.log(answer);
    });
} else {
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
