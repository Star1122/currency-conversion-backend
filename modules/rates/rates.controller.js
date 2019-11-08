const rp = require('request-promise');

const Rates = require('./rates.model');
const { api } = require('../../config/vars');
const { handleError, responseWithResult } = require('../../utils');
const logger = require('../../logger');

// Get rates
exports.index = (req, res) => {
  Rates
    .findOne()
    .select('base rates updatedAt')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Get currencies
exports.getCurrencies = (req, res) => {
  Rates
    .findOne()
    .select('rates')
    .execAsync()
    .then(res => Object.keys(res.rates))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Fetch rates from 3rd party
const fetch = async () => {
  try {
    const requestOptions = {
      method: 'GET',
      uri: `${api.url}/latest`,
      qs: {
        access_key: api.key,
      },
      json: true,
      gzip: true,
    };

    const response = await rp(requestOptions);

    // Save rates to database
    let rate = await Rates.findOne({ base: response.base }).exec();
    if (rate) {
      rate.rates = response.rates;
    } else {
      rate = new Rates({
        base: response.base,
        rates: response.rates,
      });
    }

    await rate.save();
  } catch (e) {
    logger.error('[Rates::fetch]: %s', e.message);
  }

  // Fetch again after 1 hour
  setTimeout(fetch, 3600000);
};

exports.fetch = fetch;
