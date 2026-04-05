const fs = require('fs');
const path = require('path');
const dbAdapter = require('./db/adapter');

const dataPath = path.join(__dirname, 'data.json');
const dbPath = path.join(__dirname, 'data.db');

if (!fs.existsSync(dataPath)) {
  console.error('data.json not found');
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const rows = json.values.slice(1);

const db = dbAdapter.init(dbPath);
db.importData(rows);

console.log('Imported', rows.length, 'rows into', dbPath);
