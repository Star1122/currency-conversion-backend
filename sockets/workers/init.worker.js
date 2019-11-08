const { sockets } = require('./global.worker');
const { initRealTimeWorkers, sendInitialData } = require('./realtime.worker');
const logger = require('../../logger');

function onDisconnect() {
  const { id } = this;
  sockets.delete(id);
  logger.info('Socket %s disconnected', id);
}

function onConnect(socket) {
  const { id } = socket;

  const ip = socket.request.headers['x-real-ip'] || '127.0.0.1';
  logger.info('Socket %s connected from %s', id, ip);

  sockets.set(id, socket);

  sendInitialData(socket);

  socket.on('disconnect', onDisconnect);
}

initRealTimeWorkers();

module.exports = {
  onConnect,
};
