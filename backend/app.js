const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(cors());

app.get('/posts', (req, res) => {
  fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading posts.json');
      return;
    }
    res.send(JSON.parse(data));
  });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
