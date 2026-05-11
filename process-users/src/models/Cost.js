const mongoose = require('mongoose');

/* Read-only reference to the costs collection for computing user totals */
const costSchema = new mongoose.Schema({
  // User who owns the cost entry
  userid: { type: Number },
  // Monetary amount of the cost
  sum: { type: Number }
});

// Register the Cost model
const Cost = mongoose.model('Cost', costSchema);
module.exports = Cost;
