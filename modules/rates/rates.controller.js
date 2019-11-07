const rp = require('request-promise');

const Rates = require('./rates.model');
const { api } = require('../../config/vars');
const { handleError, responseWithResult } = require('../../utils');

// Get rates
exports.index = (req, res) => {
  Rates
    .findOne()
    .select('base rates updatedAt')
    .execAsync()
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
    console.log('[rates:fetch]: ', e.message);
  }

  // Fetch again after 1 hour
  setTimeout(fetch, 3600000);
};

exports.fetch = fetch;
