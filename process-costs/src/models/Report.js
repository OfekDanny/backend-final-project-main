const mongoose = require('mongoose');

/* Schema for the reports collection - stores monthly expense summaries per user */
const reportSchema = new mongoose.Schema({
  // ID of the user this report belongs to
  userid: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  // Expenses grouped by category for the given month and year
  data: { type: Object, required: true }
});

// Register the Report model
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
