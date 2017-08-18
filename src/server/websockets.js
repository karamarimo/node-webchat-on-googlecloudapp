'use strict';

const socket = require('socket.io')
const config = require('./config')
const sql = require('./sql-model')

const io = socket()

// web socket handler
io.on('connection', (socket) => {
  console.log('a user connected')

  // when receiving a message, send it to everyone
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
  const port = config.get('PORT_WEBSOCKETS')
  io.listen(port)
  console.log(`socket.io listening on port ${port}`)
}

module.exports = io
