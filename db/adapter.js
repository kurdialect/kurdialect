const sqlite = require('./database');

module.exports = {
  init: (dbPath) => sqlite.init(dbPath)
};