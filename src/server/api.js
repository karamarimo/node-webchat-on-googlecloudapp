'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const messageListSize = 10;

function getModel () {
  return require('./sql-model');
}

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * GET /api/messages
 *
 * Retrieve a page of messages (up to ten at a time).
 */
router.get('/', (req, res, next) => {
  getModel().list(messageListSize, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * POST /api/messages
 *
 * Create a new message.
 */
router.post('/', (req, res, next) => {
  getModel().create(req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * GET /api/messages/:id
 *
 * Retrieve a message.
 */
router.get('/:message', (req, res, next) => {
  getModel().read(req.params.message, (err, entity) => {
    if (err) {
      console.error(err);
      // next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * PUT /api/messages/:id
 *
 * Update a message.
 */
router.put('/:message', (req, res, next) => {
  getModel().update(req.params.message, req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * DELETE /api/messages/:id
 *
 * Delete a message.
 */
router.delete('/:message', (req, res, next) => {
  getModel().delete(req.params.message, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).send('OK');
  });
});

/**
 * Errors on "/api/messages/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code
  };
  next(err);
});

module.exports = router;
