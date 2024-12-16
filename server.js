const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Charger les redirections depuis le fichier JSON
const redirects = JSON.parse(fs.readFileSync('redirects.json', 'utf8'));

// Route pour gérer les redirections
app.get('/:route', (req, res) => {
  const route = `/${req.params.route}`;
  const destination = redirects[route];

  if (destination) {
    res.sendFile(path.join(__dirname, 'countdown.html'), {
      headers: { 'Content-Type': 'text/html' },
      query: { url: destination }
    });
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
