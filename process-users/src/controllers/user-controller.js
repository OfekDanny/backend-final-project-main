const User = require('../models/user-model');
const Cost = require('../models/cost-model');
const { logger } = require('../utils/pino-logger');

// POST /api/add
const addUser = async (req, res) => {
  logger.info({ endpoint: '/api/add' }, 'endpoint accessed');
  const { id, first_name, last_name, birthday } = req.body;

  if (!id || !first_name || !last_name || !birthday) {
    return res.status(400).json({ id: 'missing_fields', message: 'Please provide all required fields: id, first_name, last_name, birthday' });
  }

  try {
    const user = await User.create({ id, first_name, last_name, birthday: new Date(birthday) });
    res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday
    });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

// GET /api/users
const getUsers = async (req, res) => {
  logger.info({ endpoint: '/api/users' }, 'endpoint accessed');
  try {
    const users = await User.find({}, { _id: 0, id: 1, first_name: 1, last_name: 1, birthday: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  logger.info({ endpoint: '/api/users/:id' }, 'endpoint accessed');
  const userId = Number(req.params.id);

  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ id: 'not_found', message: 'User not found' });
    }

    const costs = await Cost.find({ userid: userId });
    const total = costs.reduce((acc, c) => acc + (c.sum || 0), 0);

    res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      total
    });
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { addUser, getUsers, getUserById };
