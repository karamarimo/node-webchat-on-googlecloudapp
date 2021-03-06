'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = module.exports = require('nconf');
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'DATA_BACKEND',
    'GCLOUD_PROJECT',
    'INSTANCE_CONNECTION_NAME',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'NODE_ENV',
    'PORT_HTTP',
    'PORT_WEBSOCKETS'
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config_sensitive.json') })
  // 4. Defaults
  .defaults({
    // dataBackend can be 'cloudsql', or 'mysql' (local). Be sure to
    // configure the appropriate settings for each storage engine below.
    // If you are unsure, use datastore as it requires no additional
    // configuration.
    DATA_BACKEND: 'cloudsql',

    // This is the id of your project in the Google Cloud Developers Console.
    GCLOUD_PROJECT: '',

    MYSQL_USER: '',
    MYSQL_PASSWORD: '',

    PORT_HTTP: 8080,
    PORT_WEBSOCKETS: 8090
  });

// Check for required settings

if (nconf.get('DATA_BACKEND') === 'cloudsql') {
  checkConfig('GCLOUD_PROJECT');
  checkConfig('MYSQL_USER');
  checkConfig('MYSQL_PASSWORD');
  if (nconf.get('NODE_ENV') === 'production') {
    checkConfig('INSTANCE_CONNECTION_NAME');
  }
}

if (nconf.get('DATA_BACKEND') === 'mysql') {
  checkConfig('MYSQL_USER');
  checkConfig('MYSQL_PASSWORD');
}

function checkConfig (setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config json file!`);
  }
}
