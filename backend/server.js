const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/posts', (req, res) => {
  fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading posts.json');
      return;
    }
    res.send(JSON.parse(data));
  });
});

app.post('/posts', (req, res) => {
    const newPost = req.body;
  
    fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading posts.json');
        return;
      }
  
      const posts = JSON.parse(data);
      posts.push(newPost);
  
      fs.writeFile(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error writing to posts.json');
          return;
        }
        res.status(201).send(newPost);
      });
    });
  });
  
  app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
  
    fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading posts.json');
        return;
      }
  
      let posts = JSON.parse(data);
      posts = posts.filter(post => post.id !== postId);
  
      fs.writeFile(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error writing to posts.json');
          return;
        }
        res.status(204).send();
      });
    });
  });
  

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
