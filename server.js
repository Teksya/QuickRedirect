const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour rediriger HTTP vers HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Charger les redirections depuis le fichier JSON
const redirects = JSON.parse(fs.readFileSync('redirects.json', 'utf8'));

// Route pour gérer les redirections
app.get('/:route', (req, res) => {
  const route = `/${req.params.route}`;
  const destination = redirects[route];

  if (destination) {
    fs.readFile(path.join(__dirname, 'countdown.html'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Server Error');
        return;
      }
      const updatedHtml = data.replace('{{destination}}', destination);
      res.send(updatedHtml);
    });
  } else {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
  }
});

// Middleware pour gérer les erreurs 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
