const mongoose = require('mongoose');

// Read-only reference to the costs collection for computing user totals
const costSchema = new mongoose.Schema({
  userid: { type: Number },
  sum: { type: Number }
});

const Cost = mongoose.model('Cost', costSchema);
module.exports = Cost;
