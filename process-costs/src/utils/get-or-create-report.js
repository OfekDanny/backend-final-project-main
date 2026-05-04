const Report = require('../models/report-model');
const Cost = require('../models/cost-model');

const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

const isPastMonth = (year, month) => {
  const now = new Date();
  const y = Number(year);
  const m = Number(month);
  return y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1);
};

const buildReportData = (expenses) => {
  const map = CATEGORIES.reduce((acc, cat) => { acc[cat] = []; return acc; }, {});
  expenses.forEach(({ day, description, sum, category }) => {
    if (map[category]) map[category].push({ sum, description, day });
  });
  // Return as array-of-objects matching spec format
  return CATEGORIES.map(cat => ({ [cat]: map[cat] }));
};

const getOrCreateReport = async (userid, year, month) => {
  const past = isPastMonth(year, month);

  if (past) {
    const cached = await Report.findOne({ userid, year, month });
    if (cached) return cached.data;
  }

  const expenses = await Cost.find({ month: Number(month), year: Number(year), userid: Number(userid) });
  const costs = buildReportData(expenses);

  if (past) {
    await Report.create({ userid, year, month, data: costs });
  }

  return costs;
};

module.exports = getOrCreateReport;
