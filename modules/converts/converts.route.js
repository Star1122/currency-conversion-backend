const express = require('express');
const { check } = require('express-validator/check');

const controller = require('./converts.controller');

const router = express.Router();

// Get list of converts
router.get('/', controller.index);

// Get stats
router.get('/stats', controller.getStats);

// Post convert
router.post('/', [
  check('from').not().isEmpty({ ignore_whitespace: true }).withMessage('The base currency is required.'),
  check('to').not().isEmpty({ ignore_whitespace: true }).withMessage('The target currency is required.'),
  check('amount').not().isEmpty().withMessage('The convert amount is required.'),
  check('amount').isNumeric().withMessage('The convert amount is invalid.'),
], controller.convert);

module.exports = router;
