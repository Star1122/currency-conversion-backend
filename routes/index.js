const express = require('express');

const rateRouter = require('../modules/rates/rates.route');

const router = express.Router();

/**
 * GET api/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/rates', rateRouter);

module.exports = router;
