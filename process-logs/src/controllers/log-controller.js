const Log = require('../models/Log');
const { logger } = require('../utils/pino-logger');

// GET /api/logs — retrieve all stored log entries
const getLogs = async (req, res) => {
  logger.info({ endpoint: '/api/logs' }, 'endpoint accessed');
  try {
    // Return every log document from the database
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { getLogs };
