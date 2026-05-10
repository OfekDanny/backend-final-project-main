const mongoose = require('mongoose');

/* Schema for the logs collection - stores structured request logs */
const logSchema = new mongoose.Schema({
  level: { type: String, required: true },
  message: { type: String, required: true },
  // The API endpoint that was accessed
  endpoint: { type: String },
  method: { type: String },
  // Defaults to the time the log entry was created
  timestamp: { type: Date, default: Date.now }
});

// Register the Log model
const Log = mongoose.model('Log', logSchema);
module.exports = Log;
