const SCWorker = require('socketcluster/scworker');

const { onConnect } = require('./workers/init.worker');
const mongoose = require('../config/mongoose');

class SocketWorker extends SCWorker {
  run() {
    mongoose.connect();
    const { scServer } = this;
    scServer.on('connection', onConnect);
  }
}

// eslint-disable-next-line
new SocketWorker();
