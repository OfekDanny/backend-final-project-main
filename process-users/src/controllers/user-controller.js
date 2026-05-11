const User = require('../models/User');
const Cost = require('../models/Cost');
const { logger } = require('../utils/pino-logger');

// POST /api/add — create a new user
const addUser = async (req, res) => {
  logger.info({ endpoint: '/api/add' }, 'endpoint accessed');
  const { id, firstName, lastName, birthday } = req.body;

  // Validate that all required fields are present
  if (!id || !firstName || !lastName || !birthday) {
    return res.status(400).json({ id: 'missing_fields', message: 'Please provide all required fields: id, firstName, lastName, birthday' });
  }

  // Persist the new user and return the created document
  try {
    const user = await User.create({ id, firstName, lastName, birthday: new Date(birthday) });
    // Return the saved user fields
    res.status(201).json({ id: user.id, firstName: user.firstName, lastName: user.lastName, birthday: user.birthday });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

// GET /api/users — return all users
const getUsers = async (req, res) => {
  logger.info({ endpoint: '/api/users' }, 'endpoint accessed');
  try {
    // Exclude MongoDB internal _id from the response
    const users = await User.find({}, { _id: 0, id: 1, firstName: 1, lastName: 1, birthday: 1 });
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
      firstName: user.firstName,
      lastName: user.lastName,
      total
    });
  // Handle unexpected errors
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { addUser, getUsers, getUserById };
