const fs = require('fs');
const path = require('path');

const makeFilePath = (filename) => path.join(__dirname, '../data/', filename);

const getFromFile = (filename) => {
  if (!filename) return undefined;
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
    for (const key of keys) all[key][site].didVisit = false;
  }
  return all;
};

const resetDidVisit = (arr, site) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (site === 'all') {
      arr[i].linkedin.didVisit = false;
      arr[i].github.didVisit = false;
    } else {
      arr[i][site].didVisit = false;
    }
  }
  return arr;
};

const resetFlagSet = () => process.argv.includes('-r') || process.argv.includes('--reset');

module.exports = {
  getFromFile,
  saveToFile,
  resetSeen,
  resetFlagSet,
  makeFilePath,
  resetDidVisit,
};
