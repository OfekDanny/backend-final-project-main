const Report = require('../models/Report');
const Cost = require('../models/Cost');

// Categories used to initialize empty buckets in report data
const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

// Returns true if the given year/month is before the current month
const isPastMonth = (year, month) => {
  const now = new Date();
  const y = Number(year);
  const m = Number(month);
  return y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1);
};

/* Transforms a list of cost documents into the report array format */
const buildReportData = (expenses) => {
  // Initialize a bucket for each category
  const map = CATEGORIES.reduce((acc, cat) => { acc[cat] = []; return acc; }, {});
  // Push each expense into its category bucket
  expenses.forEach(({ day, description, sum, category }) => {
    if (map[category]) map[category].push({ sum, description, day });
  });
  // Return as array-of-objects matching spec format
  return CATEGORIES.map(cat => ({ [cat]: map[cat] }));
};

/* Fetches a cached report for past months or builds a fresh one from cost records */
const getOrCreateReport = async (userid, year, month) => {
  const past = isPastMonth(year, month);

  // Return cached report for past months if one already exists
  if (past) {
    const cached = await Report.findOne({ userid, year, month });
    if (cached) return cached.data;
  }

  // Build report from the raw cost documents for this user/month
  const expenses = await Cost.find({ month: Number(month), year: Number(year), userid: Number(userid) });
  const costs = buildReportData(expenses);

  // Persist past-month reports so future requests skip the rebuild
  if (past) {
    await Report.create({ userid, year, month, data: costs });
  }

  return costs;
};

module.exports = getOrCreateReport;
