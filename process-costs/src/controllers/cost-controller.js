const Cost = require('../models/Cost');
const User = require('../models/User');
const getOrCreateReport = require('../utils/get-or-create-report');
const isValidDate = require('../utils/is-valid-date');
const { logger } = require('../utils/pino-logger');

// Valid expense categories
const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

// POST /api/add — create a new cost entry
const addCost = async (req, res) => {
  logger.info({ endpoint: '/api/add' }, 'endpoint accessed');
  const { userid, description, category, sum } = req.body;

  // Default date fields to today if not provided
  const now = new Date();
  const day = req.body.day !== undefined ? Number(req.body.day) : now.getDate();
  const month = req.body.month !== undefined ? Number(req.body.month) : now.getMonth() + 1;
  const year = req.body.year !== undefined ? Number(req.body.year) : now.getFullYear();

  // Validate required fields are present
  if (!userid || !description || !category || sum === undefined) {
    return res.status(400).json({ id: 'missing_fields', message: 'Please provide: userid, description, category, sum' });
  }

  // Validate the date is a real calendar date
  if (!isValidDate(year, month, day)) {
    return res.status(400).json({ id: 'invalid_date', message: 'Invalid date provided' });
  }

  // Block past dates – costs can only be added for the current date or future
  const costDate = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (costDate < today) {
    return res.status(400).json({ id: 'past_date', message: 'Cannot add costs with a past date' });
  }

  // Validate the category is in the allowed list
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ id: 'invalid_category', message: `Category must be one of: ${CATEGORIES.join(', ')}` });
  }

  try {
    // Verify the user exists before saving the cost
    const user = await User.findOne({ id: Number(userid) });
    if (!user) {
      return res.status(400).json({ id: 'user_not_found', message: 'User not found' });
    }

    // Persist the cost entry
    const cost = await Cost.create({ userid: Number(userid), description, category, sum: Number(sum), day, month, year });

    // Return the created cost document
    res.status(201).json({
      id: cost.id,
      userid: cost.userid,
      // Date and amount fields
      year: cost.year, month: cost.month, day: cost.day, sum: cost.sum,
      // Description and categorization
      description: cost.description,
      category: cost.category
    });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

// GET /api/report — retrieve monthly cost report for a user
const getReport = async (req, res) => {
  logger.info({ endpoint: '/api/report' }, 'endpoint accessed');
  const { id, year, month } = req.query;

  // Validate required query parameters
  if (!id || !year || !month) {
    return res.status(400).json({ id: 'missing_params', message: 'Please provide: id, year, month' });
  }

  const m = Number(month);
  const y = Number(year);
  // Validate numeric ranges for month and year
  if (m < 1 || m > 12 || y < 0) {
    return res.status(400).json({ id: 'invalid_date', message: 'Invalid year or month' });
  }

  try {
    // Verify the user exists before building the report
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(400).json({ id: 'user_not_found', message: 'User not found' });
    }

    // Retrieve or build the monthly report
    const costs = await getOrCreateReport(id, y, m);
    res.status(200).json({ userid: Number(id), year: y, month: m, costs });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { addCost, getReport };
