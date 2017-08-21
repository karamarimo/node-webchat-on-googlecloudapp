'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const saltRounds = 10

function getModel () {
  return require('./sql-model')
}

const router = express.Router()

// Automatically parse request body as JSON
router.use(bodyParser.json())

// TODO: Check params or query or whatever are valid

router.post('/checkpassword', (req, res, next) => {
  // TODO: check if the connection is secure
  // if (!req.secure) {

  // }

  getModel().account_password_read(req.body.username, (err, entity) => {
    if (err) {
      next(err)
      return
    }
    
    const algo = entity.hash_algo
    const hash = entity.hash
    const password = req.body.password

    if (algo === 'bcrypt') {
      bcrypt.compare(password, hash, function (err, matched) {
        if (err) {
          next(err)
          return
        }
        res.json({
          result: matched
        })
      })
    } else {
      next({
        code: '410',
        message: `Internal error while checking password`
      })
    }

  })
})

router.post('/signup', (req, res, next) => {
  // TODO: check if the connection is secure
  // if (!req.secure) {

  // }

  const data = req.body
  if (!data.name || !data.password) {
    // TODO: return error
    next({
      code: 500,
      message: 'signup: invalid values'
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
        result: true
      })
    })
  })

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

/**
 * Errors on "/api/messages/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code
  }
  next(err)
})

module.exports = router

function encrypt(password, method) {
  if (method === 'bcrypt') {

  } else {
    throw Error(`unknown method: ${method}`)
  }
}
