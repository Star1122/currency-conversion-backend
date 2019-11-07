const express = require('express');

const controller = require('./rates.controller');

const router = express.Router();

// Get rates
router.get('/', controller.index);

module.exports = router;
