const path = require('path');
const SocketCluster = require('socketcluster');

const config = require('../config/vars');
const logger = require('../logger');

const socket = {};

socket.start = async () => {
  const socketCluster = new SocketCluster({
    workers: 1,
    brokers: 1,
    port: config.socket.port,
    appName: 'currency-conversion',
    wsEngine: 'ws',
    workerController: path.resolve(__dirname, './worker.js'),
    rebootWorkerOnCrash: true,
    logLevel: 0,
  });

  socketCluster.on('fail', err => logger.error(err));
  socketCluster.on('warning', err => logger.warn(err));

  function waitForConnect() {
    return new Promise((resolve) => {
      socketCluster.on('ready', () => {
        logger.info('SocketCluster is ready');
        resolve(true);
      });
    });
  }

  await waitForConnect();
};

module.exports = socket;
