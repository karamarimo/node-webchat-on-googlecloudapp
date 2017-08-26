'use strict';

const express = require('express')
const path = require('path')
const http = require('http')
const morgan = require('morgan')

const config = require('./config')

const app = express()
const server = http.Server(app)

// use morgan to log
app.use(morgan('combined'))

// WARNING: Routes order matters !!

// TODO: use https

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

app.use('/dist', express.static(path.join(__dirname, '../../dist')))
// app.use('/styles', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/css/')))
// app.use('/fonts', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/fonts/')))

app.use('/api', require('./api'))

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

if (module === require.main) {
  // Start the server
  server.listen(config.get('PORT_HTTP'), () => {
    const port = server.address().port
    console.log(`App listening on port ${port}`)
  })
}

module.exports = app
