const Report = require('../models/Report');
const Expense = require('../models/Expense');

/* Retrieves an existing monthly report or builds and saves a new one */
async function getOrCreateReport(userId, year, month, validCategories) {
  // Try to find a cached report for this user/year/month
  let report = await Report.findOne({ userId, year, month });

  if (!report) {
    // Get all expenses for the given month and year of the user
    const expenses = await Expense.find({ month, year, userId });

    // Initialize report data with empty lists for all categories
    const reportData = validCategories.reduce((acc, category) => {
      acc[category] = [];
      return acc;
    }, {});

    // Format the expenses into report data grouped by category
    expenses.forEach((expense) => {
      const { day, description, sum, category } = expense;
      const expenseData = { day, description, sum };
      reportData[category].push(expenseData);
    });

    // Persist the new report so subsequent requests hit the cache
    report = new Report({ userId, year, month, data: reportData });
    await report.save();
  }

  return report;
}

module.exports = getOrCreateReport;
