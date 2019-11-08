const express = require('express');

const controller = require('./rates.controller');

const router = express.Router();

// Get rates
router.get('/', controller.index);

// Get currencies
router.get('/currencies', controller.getCurrencies);

module.exports = router;
