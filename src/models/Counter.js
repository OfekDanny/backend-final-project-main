const mongoose = require('mongoose');

/* Schema for the counters collection used for auto-incrementing IDs */
const counterSchema = new mongoose.Schema({
  // Name of the model this counter belongs to
  model: {
    type: String,
    required: true
  },
  // Name of the field being auto-incremented
  field: {
    type: String,
    required: true
  },
  // Current counter value
  count: {
    type: Number,
    default: 0
  }
});

// Register the Counter model
const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
