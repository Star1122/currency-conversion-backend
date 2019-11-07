const mongoose = require('bluebird').promisifyAll(require('mongoose'));

const { Schema } = mongoose;

/**
 * Rates Schema
 */
const RatesSchema = new Schema({
  base: {
    type: String,
    required: true,
    unique: true,
  },
  rates: {
    type: Object,
    required: true,
  },
}, {
  toJSON: { virtuals: true },
  timestamps: true,
});

module.exports = mongoose.model('Rates', RatesSchema);
