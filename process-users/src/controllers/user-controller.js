const User = require('../models/User');
const Cost = require('../models/Cost');
const { logger } = require('../utils/pino-logger');

// POST /api/add — create a new user
const addUser = async (req, res) => {
  logger.info({ endpoint: '/api/add' }, 'endpoint accessed');
  const { id, first_name, last_name, birthday } = req.body;

  // Validate that all required fields are present
  if (!id || !first_name || !last_name || !birthday) {
    return res.status(400).json({ id: 'missing_fields', message: 'Please provide all required fields: id, first_name, last_name, birthday' });
  }

  try {
    // Check if user with this id already exists
    const existing = await User.findOne({ id });
    if (existing) {
      return res.status(400).json({ id: 'duplicate_user', message: 'A user with this id already exists' });
    }

    // Persist the new user and return the created document
    const user = await User.create({ id, first_name, last_name, birthday: new Date(birthday) });
    res.status(201).json({ id: user.id, first_name: user.first_name, last_name: user.last_name, birthday: user.birthday });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

// GET /api/users — return all users
const getUsers = async (req, res) => {
  logger.info({ endpoint: '/api/users' }, 'endpoint accessed');
  try {
    // Exclude MongoDB internal _id from the response
    const users = await User.find({}, { _id: 0, id: 1, first_name: 1, last_name: 1, birthday: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

// GET /api/users/:id — return a single user plus total spending
const getUserById = async (req, res) => {
  logger.info({ endpoint: '/api/users/:id' }, 'endpoint accessed');
  const userId = Number(req.params.id);

  try {
    // Look up the user by numeric ID
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ id: 'not_found', message: 'User not found' });
    }

    // Sum all costs associated with this user
    const costs = await Cost.find({ userid: userId });
    const total = costs.reduce((acc, c) => acc + (c.sum || 0), 0);

    // Return user info together with their total spending
    res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      total
    });
  // Handle unexpected errors
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { addUser, getUsers, getUserById };
