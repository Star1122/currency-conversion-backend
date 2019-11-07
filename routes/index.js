const express = require('express');

const rateRouter = require('../modules/rates/rates.route');
const convertRouter = require('../modules/converts/converts.route');

const router = express.Router();

/**
 * GET api/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/rates', rateRouter);
router.use('/convert', convertRouter);

module.exports = router;
