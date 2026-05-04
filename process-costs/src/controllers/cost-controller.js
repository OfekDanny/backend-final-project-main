const Cost = require('../models/cost-model');
const User = require('../models/user-model');
const getOrCreateReport = require('../utils/get-or-create-report');
const isValidDate = require('../utils/is-valid-date');
const { logger } = require('../utils/pino-logger');

const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

// POST /api/add
const addCost = async (req, res) => {
  logger.info({ endpoint: '/api/add' }, 'endpoint accessed');
  const { userid, description, category, sum } = req.body;

  const now = new Date();
  const day = req.body.day !== undefined ? Number(req.body.day) : now.getDate();
  const month = req.body.month !== undefined ? Number(req.body.month) : now.getMonth() + 1;
  const year = req.body.year !== undefined ? Number(req.body.year) : now.getFullYear();

  if (!userid || !description || !category || sum === undefined) {
    return res.status(400).json({ id: 'missing_fields', message: 'Please provide: userid, description, category, sum' });
  }

  if (!isValidDate(year, month, day)) {
    return res.status(400).json({ id: 'invalid_date', message: 'Invalid date provided' });
  }

  // Block past dates – costs can only be added for the current date
  const costDate = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (costDate < today) {
    return res.status(400).json({ id: 'past_date', message: 'Cannot add costs with a past date' });
  }

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ id: 'invalid_category', message: `Category must be one of: ${CATEGORIES.join(', ')}` });
  }

  try {
    const user = await User.findOne({ id: Number(userid) });
    if (!user) {
      return res.status(400).json({ id: 'user_not_found', message: 'User not found' });
    }

    const cost = await Cost.create({ userid: Number(userid), description, category, sum: Number(sum), day, month, year });

    res.status(201).json({
      id: cost.id,
      userid: cost.userid,
      year: cost.year,
      month: cost.month,
      day: cost.day,
      description: cost.description,
      category: cost.category,
      sum: cost.sum
    });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

// GET /api/report
const getReport = async (req, res) => {
  logger.info({ endpoint: '/api/report' }, 'endpoint accessed');
  const { id, year, month } = req.query;

  if (!id || !year || !month) {
    return res.status(400).json({ id: 'missing_params', message: 'Please provide: id, year, month' });
  }

  const m = Number(month);
  const y = Number(year);
  if (m < 1 || m > 12 || y < 0) {
    return res.status(400).json({ id: 'invalid_date', message: 'Invalid year or month' });
  }

  try {
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(400).json({ id: 'user_not_found', message: 'User not found' });
    }

    const costs = await getOrCreateReport(id, y, m);

    res.status(200).json({ userid: Number(id), year: y, month: m, costs });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { addCost, getReport };
