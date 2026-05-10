const Counter = require('../models/Counter');

/* Atomically increments and returns the next sequence value for a given model field */
const getNextSequenceValue = async function (modelName, fieldName) {
  // Find or create the counter document and increment by 1
  const counter = await Counter.findOneAndUpdate(
    { model: modelName, field: fieldName },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  // Return the updated count as the new ID
  return counter.count;
};

module.exports = getNextSequenceValue;
