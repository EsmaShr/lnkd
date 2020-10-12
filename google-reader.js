const fs = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { makeFilePath, getFromFile } = require('./utils/fileUtils');
const creds = require('./client_secret.json');

const cohortPath = makeFilePath('people.json');
const doc = new GoogleSpreadsheet(
  '17ewhQD6dM97PgegSn_M9LCFIloDw7VJevDe9Pc4_ZuI',
);

async function readSpreadsheet() {
  const { cohort } = getFromFile('credentials.json');
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const tabs = {};
  // need to loop through sheets to get labels of tabs... this is what we enter into the inquirer prompt
  for (let i = 0; i < doc.sheetCount; i += 1) {
    tabs[doc.sheetsByIndex[i].title] = i;
    // TABS[10]
  }

  const sheet = doc.sheetsByIndex[tabs[cohort]];
  const cohortObject = [];
  const rows = await sheet.getRows();
  //
  rows.forEach((row) => {
    const person = {};
    person.name = row.Name;
    person.phone = row.Phone;
    person.email = row.Email;
    person.medium = row.Medium;
    person.linkedin = {
      url: row.LinkedIn,
      didVisit: false,
    };
    person.github = { url: row.Github, didVisit: false };
    cohortObject.push(person);
  });
  fs.writeFileSync(cohortPath, JSON.stringify(cohortObject));
  console.log(cohortObject);
}

module.exports = {
  readSpreadsheet,
};
