const mongoose = require('bluebird').promisifyAll(require('mongoose'));

const { Schema } = mongoose;

/**
 * Converts Schema
 */
const ConvertsSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  converted: {
    type: Number,
    required: true,
  },
  convertedInUsd: {
    type: Number,
    required: true,
  }
}, {
  toJSON: { virtuals: true },
  timestamps: true,
});

module.exports = mongoose.model('Converts', ConvertsSchema);
