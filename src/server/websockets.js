'use strict';

const express = require('express')
const http = require('http')
const socket = require('socket.io')
const config = require('./config')
const sql = require('./sql-model')

const app = express()
const server = http.Server(app)
const io = socket(server)

// ??? DO I NEED THIS ???
// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found')
})

// Basic error handler
app.use((err, req, res, next) => {
  /* jshint unused:false */
  console.error(err)
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!')
})

// web socket handler
io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('message', (msg) => {
    console.log('message sent: ' + JSON.stringify(msg))
    msg.date = new Date()
    sql.message_create(msg, (err, new_msg) => {
      if (err) {
        console.error(err)
        return
      }
      io.emit('message', new_msg)
    })
  })

  socket.on('get old messages', (room_id, token) => {
    // try {
      sql.message_list(room_id, 20, token, (err, msgs, hasMore) => {
        if (err) {
          console.error(err)
          return
        }
        socket.emit("old messages", msgs, hasMore)
      })      
    // } catch (err) {
    //   console.error(err)
    // }
  })

  socket.on('get rooms', (token) => {
    // try {
      sql.room_list(10, token, (err, rooms, hasMore) => {
        if (err) {
          console.error(err)
          return
        }
        socket.emit("rooms", rooms, hasMore)
      })      
    // } catch (err) {
    //   console.error(err)
    // }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

if (module === require.main) {
  // Start the server
  server.listen(config.get('PORT_WEBSOCKETS'), () => {
    const port = server.address().port
    console.log(`App listening on port ${port}`)
  })
}

module.exports = app
