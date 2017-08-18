'use strict';

const _ = require('lodash');
const mysql = require('mysql');
const config = require('./config');

const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: 'chat_history'
};

if (config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production') {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`;
}

const connection = mysql.createConnection(options);

function message_list (room_id, limit, token, cb) {
  token = token || 0;
  connection.query(
    "SELECT `messages`.`id` AS `id`, `sender_id`, `room_id`, `name` AS `sender_name`, `date`, `content` \
      FROM `messages` JOIN `accounts` \
      WHERE `room_id` = ? AND `messages`.`sender_id` = `accounts`.`id` \
      ORDER BY `date` DESC \
      LIMIT ? OFFSET ?",
    [room_id, limit, token],
    (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      const hasMore = results.length === limit ? token + results.length : false;
      cb(null, results, hasMore);
    }
  );
}

function message_create (data, cb) {
  data = _.pick(data, ['sender_id', 'room_id', 'date', 'content'])
  connection.query('INSERT INTO `messages` SET ?', data, (err, res) => {
    if (err) {
      cb(err);
      return;
    }
    message_read(res.insertId, cb);
  });
}

function message_read (id, cb) {
  connection.query(
    'SELECT `messages`.`id` AS `id`, `sender_id`, `room_id`, `name` AS `sender_name`, `date`, `content` \
      FROM `messages` JOIN `accounts` \
      WHERE `messages`.`id` = ? AND `messages`.`sender_id` = `accounts`.`id`',
    id, (err, results) => {
    if (err) {
      cb(err);
      return;
    }
    if (!results.length || results.length === 0) {
      cb({
        code: 404,
        message: `Message of id ${id} not found`
      });
      return;
    }
    cb(null, results[0]);
  });
}

function message_update (id, data, cb) {
  data = _.pick(data, ['sender_id', 'room_id', 'date', 'content'])
  connection.query(
    'UPDATE `messages` SET ? WHERE `id` = ?', [data, id], (err) => {
      if (err) {
        cb(err);
        return;
      }
      read(id, cb);
    });
}

function message_delete (id, cb) {
  connection.query('DELETE FROM `messages` WHERE `id` = ?', id, cb);
}

function room_list (limit, token, cb) {
  token = token || 0;
  connection.query(
    "SELECT * FROM `rooms` \
      LIMIT ? OFFSET ?",
    [limit, token],
    (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      const hasMore = results.length === limit ? token + results.length : false;
      cb(null, results, hasMore);
    }
  );
}

module.exports = {
  createSchema,
  message_list,
  message_create,
  message_read,
  message_update,
  message_delete,
  room_list
};

if (module === require.main) {
  const prompt = require('prompt');
  prompt.start();

  console.log(
    `Running this script directly will allow you to initialize your mysql database.
    This script will not modify any existing tables.`);

  prompt.get(['user', 'password'], (err, result) => {
    if (err) {
      return;
    }
    createSchema(result);
  });
}

function createSchema (config) {
  const connection = mysql.createConnection(_.assign({
    multipleStatements: true
  }, config));

  connection.query(`
    CREATE DATABASE IF NOT EXISTS \`chat_history\`
      DEFAULT CHARACTER SET = 'utf8'
      DEFAULT COLLATE 'utf8_general_ci';
    USE \`chat_history\`;
    CREATE TABLE IF NOT EXISTS \`chat_history\`.\`accounts\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`name\` VARCHAR(255) NOT NULL,
      \`date_created\` TIMESTAMP NOT NULL,
      \`birth\` DATE NULL,
      PRIMARY KEY (\`id\`));
    CREATE TABLE IF NOT EXISTS \`chat_history\`.\`rooms\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`name\` VARCHAR(255) NOT NULL,
      \`date_created\` TIMESTAMP NOT NULL,
      \`description\` TEXT NULL,
      PRIMARY KEY (\`id\`));
    CREATE TABLE IF NOT EXISTS \`chat_history\`.\`messages\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`sender_id\` INT UNSIGNED NULL,
      \`room_id\` INT UNSIGNED NOT NULL,
      \`date\` TIMESTAMP NOT NULL,
      \`content\` TEXT NOT NULL,
      FOREIGN KEY (\`sender_id\`) REFERENCES \`accounts\`(\`id\`),
      FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`),
      PRIMARY KEY (\`id\`));
    `,
    (err) => {
      if (err) {
        throw err;
      }
      console.log('Successfully created db and tabels for chat app');
      connection.end();
    }
  );
}
