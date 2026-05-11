const Expense = require('../models/Expense');
const User = require('../models/User');
const Report = require('../models/Report');
const isValidDate = require('../utils/is-valid-date');
const isValidUser = require('../utils/is-valid-user');
const getOrCreateReport = require('../utils/get-or-create-report');

// Valid categories for expenses
const validCategories = ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'];

// Helper function to send error responses
const sendErrorResponse = (res, statusCode, status, message) => {
  res.status(statusCode).json({ status, message });
};

// Add a new expense
const addExpense = async (req, res) => {
  // Destructure all required fields from the request body
  const { sum, category, day, month, year, description, userId } = req.body;

  // Validate required fields are present
  if (!sum || !category || !month || !year || !day || !description) {
    sendErrorResponse(res, 400, 'fail', 'Please provide all the required fields');
    return;
  }

  // Validate the date and user before proceeding
  if (!isValidDate(year, month, day)) {
    sendErrorResponse(res, 400, 'fail', 'Invalid date given, please provide a valid date');
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(userId, res))) return;

  // Check if the category is valid
  if (!validCategories.includes(category)) {
    sendErrorResponse(res, 400, 'fail', 'Invalid category provided');
    return;
  }

  try {
    // Create expense record in the database
    const expense = await Expense.create({ userId, year, month, day, description, category, sum });

    if (expense) {
      // Invalidate the cached report for this user/month/year
      await Report.deleteOne({ userId, year, month });
      // Send successful creation response
      res.status(201).json({
        id: expense.id,
        userId: expense.userId,
        // Date and amount fields
        year: expense.year,
        month: expense.month,
        day: expense.day,
        sum: expense.sum,
        // Description and categorization
        description: expense.description,
        category: expense.category
      });
    } else {
      sendErrorResponse(res, 400, 'fail', 'Could not create expense, please try again later');
    }
  // Handle unexpected database errors
  } catch (error) {
    console.log(error);
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Get all expenses for a given user grouped by category
const getAllExpenses = async (req, res) => {
  const { userId, year, month } = req.query;

  // Validate required query parameters
  if (!month || !year || !userId) {
    sendErrorResponse(res, 400, 'fail', 'Please provide all the required parameters');
    return;
  }

  // Validate month and year ranges
  if (month < 1 || month > 12 || year < 0) {
    sendErrorResponse(res, 400, 'fail', 'Invalid date given, please provide a valid date');
    return;
  }

  // Check if the user exists
  if (!(await isValidUser(userId, res))) return;

  // Generate or retrieve the cached report
  try {
    const report = await getOrCreateReport(userId, year, month, validCategories);
    // Return the grouped expense data
    res.status(200).json(report.data);
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Remove a single expense by ID
const removeExpense = async (req, res) => {
  const { id } = req.body;
  // Validate ID is present
  if (!id) {
    sendErrorResponse(res, 400, 'fail', 'Please provide all the required parameters');
    return;
  }

  // Check if the expense exists before deleting
  try {
    const expense = await Expense.findOne({ id });
    // Return 404 if not found
    if (!expense) {
      sendErrorResponse(res, 404, 'fail', 'There is no expense with the specified id.');
      return;
    }
    // Found — delete the expense and confirm success
    await Expense.deleteOne({ id });
    res.status(200).json({ status: 'success', message: `Expense ${id} deleted successfully` });
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { id, firstName, lastName, birthday } = req.body;
  // Validate all required fields are present
  if (!id || !firstName || !lastName || !birthday) {
    sendErrorResponse(res, 400, 'fail', 'Please provide all the required fields');
    return;
  }

  // Persist the new user and return its data
  try {
    const user = await User.create({ id, firstName, lastName, birthday });
    user.save();
    // Return the created user document
    res.status(201).json({ id: user.id, firstName: user.firstName, lastName: user.lastName, birthday: user.birthday });
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Remove a report for a specific user/year/month
const removeReport = async (req, res) => {
  const { userId, year, month } = req.body;
  // Validate required fields are present
  if (!userId || !year || !month) {
    sendErrorResponse(res, 400, 'fail', 'Please provide all the required parameters');
    return;
  }

  // Find the report before attempting deletion
  try {
    const report = await Report.findOne({ userId, year, month });
    // Return 404 if not found
    if (!report) {
      sendErrorResponse(res, 404, 'fail', 'There is no report with the specified parameters.');
    } else {
      // Delete and confirm success
      await Report.deleteOne({ userId, year, month });
      res.status(200).json({ status: 'success', message: `Report for ${userId} at month ${month} and year ${year} deleted successfully` });
    }
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Remove a user by ID
const removeUser = async (req, res) => {
  const { id } = req.body;
  // Validate ID is present
  if (!id) {
    sendErrorResponse(res, 400, 'fail', 'Please provide all the required parameters');
    return;
  }

  // Check if the user exists before deleting
  try {
    const user = await User.findOne({ id });
    // Return 404 if not found
    if (!user) {
      sendErrorResponse(res, 404, 'fail', 'There is no user with the specified id.');
      return;
    }
    // Delete and confirm success
    await User.deleteOne({ id });
    res.status(200).json({ status: 'success', message: `User ${id} deleted successfully` });
  } catch (error) {
    sendErrorResponse(res, 500, 'error', 'Internal server error');
  }
};

// Export all route handlers
module.exports = {
  addExpense,
  getAllExpenses,
  removeExpense,
  createUser,
  removeUser,
  removeReport
};
