const mongoose = require('mongoose');
const getNextSequenceValue = require('../utils/auto-increment');

const costSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  userid: { type: Number, required: [true, 'Cost must have a userid'], index: true },
  year: { type: Number, required: [true, 'Cost must have a year'], index: true },
  month: { type: Number, required: [true, 'Cost must have a month'], index: true },
  day: { type: Number, required: [true, 'Cost must have a day'] },
  description: { type: String, required: [true, 'Cost must have a description'] },
  category: {
    type: String,
    enum: ['food', 'health', 'housing', 'sports', 'education']
  },
  sum: { type: Number, required: [true, 'Cost must have a sum'] }
});

costSchema.pre('save', async function (next) {
  if (!this.id) {
    this.id = await getNextSequenceValue('Cost', 'id');
  }
  next();
});

const Cost = mongoose.model('Cost', costSchema);
Cost.createIndexes();

module.exports = Cost;
