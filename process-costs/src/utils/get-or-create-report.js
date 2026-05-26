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

/*
 * Computed Design Pattern implementation for monthly reports.
 *
 * The pattern: instead of recomputing a report from raw cost records on every
 * request, we persist the computed result for any month that has already ended
 * (and is therefore immutable, since the application blocks adding costs with
 * past dates). On subsequent requests for that same past month we return the
 * cached result directly, skipping the aggregation entirely.
 *
 * Algorithm:
 *   1. If the requested year/month is in the past, look up a cached report in
 *      the `reports` collection. If found, return its `data` field unchanged.
 *   2. Otherwise (or if no cache exists), query the `costs` collection for
 *      every cost belonging to this user in the requested month/year and run
 *      buildReportData() to group the costs by category.
 *   3. If the month is in the past, persist the freshly-built report to the
 *      `reports` collection so the next request hits the cache.
 *   4. Reports for the current (or a future) month are never cached, because
 *      new costs can still be added and the cache would become stale.
 */
const getOrCreateReport = async (userid, year, month) => {
  const past = isPastMonth(year, month);

  // Step 1: serve from cache when available (past months only)
  if (past) {
    const cached = await Report.findOne({ userid, year, month });
    if (cached) return cached.data;
  }

  // Step 2: build the report from raw cost documents
  const expenses = await Cost.find({ month: Number(month), year: Number(year), userid: Number(userid) });
  const costs = buildReportData(expenses);

  // Step 3: persist past-month reports so future requests skip the rebuild
  if (past) {
    await Report.create({ userid, year, month, data: costs });
  }

  // Step 4: current/future months are returned without caching
  return costs;
};

module.exports = getOrCreateReport;
