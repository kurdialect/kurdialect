const express = require('express');
const path = require('path');
const compression = require('compression');
const dbAdapter = require('./db/adapter');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data.db');

const db = dbAdapter.init(DB_PATH);

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  const words = q.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return res.json([]);
  try {
    const results = words.map(word => ({
      word,
      results: db.search(word)
    }));
    res.json(results);
  } catch (err) {
    console.error('Search error', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/words', (req, res) => {
  try {
    const rows = db.all();
    res.json(rows);
  } catch (err) {
    console.error('List error', err);
    res.status(500).json({ error: 'Failed to list words' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
