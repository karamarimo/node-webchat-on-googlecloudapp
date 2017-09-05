'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('./config')

const saltRounds = 10
const tokenLifeSpan = 60 * 5    // in seconds

function getModel () {
  return require('./sql-model')
}

const router = express.Router()

// Automatically parse request body as JSON
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// TODO: Check params or query or whatever are valid

// /api/authenticate : validate login parameters and return access token
router.post('/authenticate', (req, res, next) => {
  // TODO: check if the connection is secure
  // if (!req.secure) {

  // }
  
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    res.json({
      status: "error",
      message: "authentication: username or password not provided"
    })
    return
  }

  getModel().account_password_read(username, (err, entity) => {
    if (err) {
      next(err)
      return
    }
    // entity == null means no username
    if (!entity) {
      res.json({
        status: "error",
        message: "authentication: the username doesn\'t exist"
      })
      return
    }
    
    const algo = entity.hash_algo
    const hash = entity.hash

    if (algo === 'bcrypt') {
      bcrypt.compare(password, hash, function (err, matched) {
        if (err) {
          next(err)
          return
        }

        if (matched) {
          // generate access token
          const secret = config.get('JWT_SECRET_KEY')
          const token = jwt.sign({ username }, secret, {
            expiresIn: tokenLifeSpan
          })

          res.json({
            status: "ok",
            data: { token }
          })
        } else {
          res.json({
            status: "error",
            message: "authentication: wrong password"
          })
        }
      })
    } else {
      next({
        message: "unknown hashing algorithm"
      })
    }

  })
})

router.post('/signup', (req, res, next) => {
  // TODO: check if the connection is secure
  // if (!req.secure) {

  // }

  const data = req.body
  if (!data.username || !data.password) {
    // TODO: return error
    res.json({
      status: "error",
      message: "sign-up: username or password not provided"
    })
    return
  }

  bcrypt.hash(data.password, saltRounds, (err, hash) => {
    if (err) {
      next(err)
      return
    }

    data.hash_algo = 'bcrypt'
    data.hash = hash

    getModel().account_create(data, (err, entity) => {
      if (err) {
        next(err)
        return
      }
  
      res.json({
        status: "ok",
        message: "sign-up: success"
      })
    })
  })

})

router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code
  }
  next(err)
})

// /**
//  * GET /api/messages
//  *
//  * Retrieve a page of messages (up to ten at a time).
//  */
// router.get('/', (req, res, next) => {
//   getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
//     if (err) {
//       next(err)
//       return
//     }
//     res.json({
//       items: entities,
//       nextPageToken: cursor
//     })
//   })
// })

// /**
//  * POST /api/messages
//  *
//  * Create a new message.
//  */
// router.post('/', (req, res, next) => {
//   getModel().create(req.body, (err, entity) => {
//     if (err) {
//       next(err)
//       return
//     }
//     res.json(entity)
//   })
// })

// /**
//  * GET /api/messages/:id
//  *
//  * Retrieve a message.
//  */
// router.get('/:message', (req, res, next) => {
//   getModel().read(req.params.message, (err, entity) => {
//     if (err) {
//       console.error(err)
//       // next(err)
//       return
//     }
//     res.json(entity)
//   })
// })

// /**
//  * PUT /api/messages/:id
//  *
//  * Update a message.
//  */
// router.put('/:message', (req, res, next) => {
//   getModel().update(req.params.message, req.body, (err, entity) => {
//     if (err) {
//       next(err)
//       return
//     }
//     res.json(entity)
//   })
// })

// /**
//  * DELETE /api/messages/:id
//  *
//  * Delete a message.
//  */
// router.delete('/:message', (req, res, next) => {
//   getModel().delete(req.params.message, (err) => {
//     if (err) {
//       next(err)
//       return
//     }
//     res.status(200).send('OK')
//   })
// })

module.exports = router

function encrypt(password, method) {
  if (method === 'bcrypt') {

  } else {
    throw Error(`unknown method: ${method}`)
  }
}
