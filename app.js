/**
 * Module dependencies.
 */
global.Promise = require('bluebird');
const chalk = require('chalk');

const app = require('./config/express');
const mongoose = require('./config/mongoose');
const socket = require('./sockets');

mongoose.connect();

const { fetch } = require('./modules/rates/rates.controller');

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');

  fetch();

  socket.start();
});

module.exports = app;
