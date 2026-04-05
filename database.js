const Database = require('better-sqlite3');
let db;

module.exports = {
  init: (dbPath) => {
    db = new Database(dbPath);
    db.exec(`CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY,
      sorani TEXT,
      badini TEXT,
      hawrami TEXT,
      image TEXT
    );`);

    return {
      search: (q) => {
        const words = q.split(' ').filter(w => w.trim()).map(w => w.toLowerCase());
        if (words.length === 0) return [];
        const conditions = words.map(() => '(LOWER(sorani) LIKE ? OR LOWER(badini) LIKE ? OR LOWER(hawrami) LIKE ?)').join(' OR ');
        const params = words.flatMap(word => [`%${word}%`, `%${word}%`, `%${word}%`]);
        const stmt = db.prepare(`SELECT id, sorani, badini, hawrami, image FROM words WHERE ${conditions}`);
        return stmt.all(...params);
      },
      all: () => {
        return db.prepare('SELECT id, sorani, badini, hawrami, image FROM words').all();
      },
      importData: (rows) => {
        const insert = db.prepare('INSERT INTO words (sorani, badini, hawrami, image) VALUES (?, ?, ?, ?)');
        const insertMany = db.transaction((items) => {
          for (const r of items) {
            const sorani = r[0] || '';
            const badini = r[1] || '';
            const hawrami = r[2] || '';
            const image = r[3] || '';
            insert.run(sorani, badini, hawrami, image);
          }
        });
        insertMany(rows);
      }
    };
  }
};
