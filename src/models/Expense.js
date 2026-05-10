const mongoose = require('mongoose');
const getNextSequenceValue = require('../utils/auto-increment');

/* Schema for the costs/expenses collection */
const costSchema = new mongoose.Schema({
  // Auto-incremented unique ID for each expense
  id: {
    type: Number,
    unique: true
  },
  // Reference to the user who owns this expense
  userId: {
    type: Number,
    required: [true, 'Cost must have a user id'],
    index: true
  },
  // Date fields for when the expense occurred
  year: {
    type: Number,
    required: [true, 'Cost must have a year'],
    index: true
  },
  // Month is indexed for efficient report queries
  month: {
    type: Number,
    required: [true, 'Cost must have a month'],
    index: true
  },
  // Day and description of the expense
  day: { type: Number, required: [true, 'Cost must have a day'] },
  description: {
    type: String,
    required: [true, 'Cost must have a description']
  },
  // Allowed expense categories (enforced at schema level)
  category: {
    type: String,
    enum: ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other']
  },
  // Total monetary value of the expense
  sum: { type: Number, required: [true, 'Cost must have a sum'] }
});

// Auto-assign the next ID before saving a new expense
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
