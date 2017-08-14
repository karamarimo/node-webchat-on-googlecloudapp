'use strict';

const express = require('express');
const http = require('http');
const socket = require('socket.io');
const config = require('./config');
const sql = require('./sql-model');

const app = express();
const server = http.Server(app);
const io = socket(server);

// ??? DO I NEED THIS ???
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

// web socket handler
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (msg) => {
    console.log('message sent: ' + JSON.stringify(msg));
    // sql.message_create(msg)
    io.emit('message', msg)
  });

  socket.on('get old messages', (roomId, token) => {
    // sql.message_list(roomId, 10, token, (err, msgs, hasMore) => {
    //   socket.emit("old messages", msgs, hasMore)
    // })
    socket.emit("old messages", [
      { id: 0, content: 'hi i am your father', senderName: 'Truth Teller', date: new Date() },
      { id: 1, content: 'u want me now?', senderName: 'Seducer', date: new Date() }
    ], false)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

if (module === require.main) {
  // Start the server
  server.listen(config.get('PORT_WEBSOCKETS'), () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
