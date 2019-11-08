const _isEqual = require('lodash/isEqual');

const { sockets } = require('./global.worker');
const Converts = require('../../modules/converts/converts.model');
const logger = require('../../logger');
const { reducer } = require('../../utils');

let prevStats = {};
const socketIntervalTime = 15000;

function getStats() {
  return Converts.aggregate([
    {
      $group: {
        _id: '$to',
        amount: { $sum: '$convertedInUsd' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ])
    .then((res) => {
      if (res.length === 0) {
        return {
          popular: '',
          totalConverted: 0,
          totalCount: 0,
        };
      }

      return {
        popular: res[0]._id,
        totalConverted: res.reduce(reducer('amount'), 0),
        totalCount: res.reduce(reducer('count'), 0),
      };
    })
    .catch((error) => {
      throw error;
    });
}

async function sendStats() {
  if (sockets.size > 0) {
    getStats()
      .then((stats) => {
        if (!_isEqual(prevStats, stats)) {
          sockets.forEach((socket) => {
            socket.emit('Stats', stats);
          });

          prevStats = stats;
        }
      })
      .catch((error) => {
        logger.error('[Socket::Stats]: %s', error.message);
      });
  }

  setTimeout(sendStats, socketIntervalTime);
}

function initRealTimeWorkers() {
  sendStats();
}

async function sendInitialData(socket) {
  try {
    getStats()
      .then((stats) => {
        socket.emit('Stats', stats);
      })
      .catch((error) => {
        logger.error('[Socket::Stats]: %s', error.message);
      });
  } catch (error) {
    logger.error('[Socket::sendInitialData]: %s', error.message);
  }
}

module.exports = {
  initRealTimeWorkers,
  sendInitialData
};
