const express = require('express');
const path = require('path');

const port = 8080;

const app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/styles', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css/')));
app.use('/fonts', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/fonts/')));

app.use('/api/books', require('./books/api'));

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res, next) => {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  const server = app.listen(port, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

