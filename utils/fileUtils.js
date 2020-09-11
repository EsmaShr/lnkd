const fs = require('fs');
const path = require('path');

const makeFilePath = (filename) => path.join(__dirname, '../data/', filename);

const getFromFile = (filename) => {
  const filePath = makeFilePath(filename);
  const raw = fs.readFileSync(filePath);
  const parsed = JSON.parse(raw);
  return parsed;
};

const saveToFile = (filename) => (object) => {
  const JSONstring = JSON.stringify(object);
  const filePath = makeFilePath(filename);
  fs.writeFileSync(filePath, JSONstring);
};

const resetSeen = (all, site) => {
  if (Array.isArray(all)) {
    all = all.map((entry) => ({ ...entry, didVisit: false }));
  } else {
    const keys = Object.keys(all);
    for (let key of keys) all[key][site].didVisit = false;
  }
  return all;
};

const resetFlagSet = () => process.argv.includes('-r') || process.argv.includes('--reset');

module.exports = {
  getFromFile,
  saveToFile,
  resetSeen,
  resetFlagSet,
  makeFilePath,
};
