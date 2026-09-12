const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server monitoring vending machine aktif!');
});

app.get('/api/mesin', (req, res) => {
  const data = fs.readFileSync('data.json', 'utf-8');
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});