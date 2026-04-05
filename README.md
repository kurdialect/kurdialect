# Kurdialect — Local dev server + SQLite

Quick steps to run locally:

1. Install dependencies:

```bash
npm install
```

2. Import `data.json` into the local SQLite DB:

```bash
npm run migrate
```

3. Start the local server:

```bash
npm start
```

4. Open http://localhost:3000 in your browser.

Notes:
- The app uses a local SQLite database (`data.db`) and an Express server that exposes `/api/search?q=...`.
- There's a service worker to cache the app shell and API responses so basic search works offline.
# Kurdish Dialect Translator

A Kurdish translation app for different dialects (Sorani, Badini, and Hawrami).

## Features:
- Search for words or phrases in three Kurdish dialects (Sorani, Badini, Hawrami).
- For multiple words, each word is searched separately and results are displayed in sequence.
- View translations in other dialects with images for some entries.
- Press Enter in the search box to initiate search.
- PWA features: installable, works offline with service worker caching.
- Case-insensitive search with offline fallback.
- Precise matching: searches for whole words to avoid partial matches (e.g., "moon" won't match "honeymoon").

## Technologies:
- HTML
- CSS
- JavaScript
- Node.js
- SQLite

## Setup:
Clone this repository and run `npm install`, then `npm run migrate`, then `npm start` to run the server. Open http://localhost:3000 in a browser.

For offline use, open `index.html` directly after migration.
