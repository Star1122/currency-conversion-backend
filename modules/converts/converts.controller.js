const { validationResult } = require('express-validator/check');

const Rates = require('../rates/rates.model');
const Converts = require('./converts.model');
const { handleError, responseWithResult, reducer } = require('../../utils');
const logger = require('../../logger');

// Get converts
exports.index = (req, res) => {
  Converts
    .find()
    .select('-__v')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Get stats
exports.getStats = async (req, res) => {
  Converts.aggregate([
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
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Convert
exports.convert = async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: errors.array()[0].msg });
    }

    const rateData = await Rates.findOne().exec();

    if (!rateData.rates[from]) {
      return res
        .status(422)
        .json({ message: 'The base currency is invalid.' });
    }

    if (!rateData.rates[to]) {
      return res
        .status(422)
        .json({ message: 'The target currency is invalid.' });
    }

    const converted = amount / rateData.rates[from] * rateData.rates[to];

    const newConvert = new Converts({
      from,
      to,
      amount,
      converted,
      convertedInUsd: amount / rateData.rates[from] * rateData.rates.USD,
    });

    await newConvert.save();

    res
      .status(200)
      .json({ result: converted });
  } catch (e) {
    logger.error('[Convert::convert]: %s', e.message);

    res
      .status(500)
      .json({ message: e.message });
  }
};
