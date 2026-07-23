const express = require('express');
const Database = require('better-sqlite3');
const {randomUUID} = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new Database('app.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
  const userId = randomUUID();
  try {
    const insert = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = insert.run(userId, name, email, password);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: "wrong data or email exists" });
  }
});

app.use(express.static(path.join(__dirname, 'src')));

app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/register', (req, res) => {
  res.json({ message: "Register" })
})

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
