'use strict';

const socket = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('./config')
const sql = require('./sql-model')

const io = socket()

// web socket handler
io.on('connection', (socket) => {
  console.log('a user connected')

  // when receiving a message, send it to everyone
  // msg = { username, room_id, content }
  socket.on('message', (msg, token) => {
    verifyToken(token, msg.username, (err, result) => {
      if (err || result !== true) {
        
        return
      }
      console.log('message received: ' + JSON.stringify(msg))
      msg.date = new Date()
      sql.message_create(msg, (err, new_msg) => {
        if (err) {
          console.error(err)
          return
        }
        io.to('room' + new_msg.room_id).emit('message', new_msg)
      })
    })
  })
  
  // when a client wants to join a room
  socket.on('join room', (id) => {
    socket.leaveAll()
    socket.join('room' + id)
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

function verifyToken (token, username, cb) {  
  jwt.verify(token, config.get('JWT_SECRET_KEY'), (err, decoded) => {
    if (err) {
      cb(null, false)
      return
    }
    cb(null, decoded.username === username)
  })
}

if (module === require.main) {
  // Start the server
  const port = config.get('PORT_WEBSOCKETS')
  io.listen(port)
  console.log(`socket.io listening on port ${port}`)
}

module.exports = io
