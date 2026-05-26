const mongoose = require('mongoose');
const getNextSequenceValue = require('../utils/auto-increment');

/* Schema for the costs collection */
const costSchema = new mongoose.Schema({
  // Auto-incremented unique ID for each cost entry
  id: { type: Number, unique: true },
  userid: { type: Number, required: [true, 'Cost must have a userid'], index: true },
  year: { type: Number, required: [true, 'Cost must have a year'], index: true },
  month: { type: Number, required: [true, 'Cost must have a month'], index: true },
  day: { type: Number, required: [true, 'Cost must have a day'] },
  description: { type: String, required: [true, 'Cost must have a description'] },
  // Allowed spending categories
  category: {
    type: String,
    enum: ['food', 'health', 'housing', 'sports', 'education']
  },
  // Stored as BSON Double for accurate monetary precision
  sum: { type: mongoose.Schema.Types.Double, required: [true, 'Cost must have a sum'] }
});

// Auto-assign the next ID before saving a new cost
costSchema.pre('save', async function (next) {
  if (!this.id) {
    this.id = await getNextSequenceValue('Cost', 'id');
  }
  next();
});

// Register the Cost model and ensure indexes are created
const Cost = mongoose.model('Cost', costSchema);
Cost.createIndexes();

module.exports = Cost;
