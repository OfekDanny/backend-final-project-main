const Log = require('../models/log-model');
const { logger } = require('../utils/pino-logger');

const getLogs = async (req, res) => {
  logger.info({ endpoint: '/api/logs' }, 'endpoint accessed');
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { getLogs };
