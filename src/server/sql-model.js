'use strict';

const _ = require('lodash')
const mysql = require('mysql')
const config = require('./config')

const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: 'chat_history'
}

if (config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production') {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`
}

const connection = mysql.createConnection(options)

const exp = module.exports = {
  message_list: function (room_id, limit, token, cb) {
    token = token || 0
    connection.query(
      "SELECT `messages`.`id` AS `id`, `sender_id`, `room_id`, `name` AS `sender_name`, `date`, `content` \
        FROM `messages` JOIN `accounts` \
        WHERE `room_id` = ? AND `messages`.`sender_id` = `accounts`.`id` \
        ORDER BY `date` DESC \
        LIMIT ? OFFSET ?",
      [room_id, limit, token],
      (err, results) => {
        if (err) {
          cb(err)
          return
        }
        const hasMore = results.length === limit ? token + results.length : false
        cb(null, results, hasMore)
      }
    )
  },

  // data = { username, room_id, content, date }
  message_create: function (data, cb) {
    exp.account_read_by_name(data.username, (err, acc) => {
      if (err) {
        cb(err)
        return
      }
      if (!acc) {
        cb(new Error("the username doesn't exist"))
      }
      
      data = _.pick(data, ['room_id', 'date', 'content'])
      data.sender_id = acc.id
      connection.query('INSERT INTO `messages` SET ?', data, (err, res) => {
        if (err) {
          cb(err)
          return
        }
        exp.message_read(res.insertId, cb)
      })
    })
  },

  message_read: function (id, cb) {
    connection.query(
      'SELECT `messages`.`id` AS `id`, `sender_id`, `room_id`, `name` AS `sender_name`, `date`, `content` \
        FROM `messages` JOIN `accounts` \
        WHERE `messages`.`id` = ? AND `messages`.`sender_id` = `accounts`.`id`',
      id, (err, results) => {
      if (err) {
        cb(err)
        return
      }
      if (!results.length) {
        // TODO: delete this line
        console.log(results)
        cb({
          message: `Message of id ${id} not found`
        })
        return
      }
      cb(null, results[0])
    })
  },

  // message_update: function (id, data, cb) {
  //   data = _.pick(data, ['sender_id', 'room_id', 'date', 'content'])
  //   connection.query(
  //     'UPDATE `messages` SET ? WHERE `id` = ?', [data, id], (err) => {
  //       if (err) {
  //         cb(err)
  //         return
  //       }
  //       read(id, cb)
  //     })
  // },

  // message_delete: function (id, cb) {
  //   connection.query('DELETE FROM `messages` WHERE `id` = ?', id, cb)
  // },

  room_list: function (limit, token, cb) {
    token = token || 0
    connection.query(
      "SELECT * FROM `rooms` \
        LIMIT ? OFFSET ?",
      [limit, token],
      (err, results) => {
        if (err) {
          cb(err)
          return
        }
        const hasMore = results.length === limit ? token + results.length : false
        cb(null, results, hasMore)
      }
    )
  },

  // check if the password is correct for the username
  account_password_read: function (username, cb) {
    connection.query(
      'SELECT `hash_algo`, `hash` \
        FROM `accounts` JOIN `passwords` \
        WHERE `accounts`.`id` = `passwords`.`id` AND `accounts`.`name` = ?',
      [username], (err, results) => {
      if (err) {
        cb(err)
        return
      }
      if (!results.length) {
        cb(null, null)
        return
      }
      cb(null, results[0])
    })
  },

  account_read_by_name: function (name, cb) {
    connection.query(
      'SELECT * FROM `accounts` \
        WHERE `name` = ?',
      [name], (err, results) => {
        if (err) {
          cb(err)
          return
        }
        if (!results.length) {
          cb(null, null)
          return
        }
        cb(null, results[0])
      }
    )
  },

  // create a account storing user data and hashed password
  account_create: function (data, cb) {
    const account_data = {
      name: data.username,
      date_created: data.date_created,
      birth: data.birth
    }
    const hash_data = _.pick(data, ['hash_algo', 'hash'])

    // start a transaction
    connection.beginTransaction((err1) => {
      if (err1) {
        cb(err1)
        return
      }

      // add to accounts table first
      connection.query('INSERT INTO `accounts` SET ?', account_data, (err2, results, fields) => {
        if (err2) {
          connection.rollback(() => {
            cb(err2)
          })
          return
        }
    
        const account_id = results.insertId
        hash_data.id = account_id
        
        // next add to passwords table
        connection.query('INSERT INTO `passwords` SET ?', hash_data, (err3, results, fields) => {
          if (err3) {
            connection.rollback(() => {
              cb(err3)
            })
            return
          }

          // finally commit the transaction
          connection.commit((err4) => {
            if (err4) {
              connection.rollback(() => {
                cb(err4)
              })
              return
            }
            console.log(`successfully added an account (id: ${account_id})`)
            cb(null, account_id)
          })
        })
      })
    })    
  },

  createSchema: function (config) {
    const connection = mysql.createConnection(_.assign({
      multipleStatements: true
    }, config))

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
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`name\` (\`name\`));
      CREATE TABLE IF NOT EXISTS \`chat_history\`.\`passwords\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`hash_algo\` VARCHAR(16) NOT NULL,
        \`hash\` VARCHAR(60) NOT NULL,
        PRIMARY KEY (\`id\`),
        FOREIGN KEY (\`id\`) REFERENCES \`accounts\` (\`id\`));
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
          throw err
        }
        console.log('Successfully created db and tabels for chat app')
        connection.end()
      }
    )
  },
}

if (module === require.main) {
  const prompt = require('prompt')
  prompt.start()

  console.log(
    `Running this script directly will allow you to initialize your mysql database.
    This script will not modify any existing tables.`)

  prompt.get(['user', 'password'], (err, result) => {
    if (err) {
      return
    }
    exp.createSchema(result)
  })
}
