const { logger } = require('../utils/pino-logger');

const developers = [
  { first_name: 'Ofek', last_name: 'Danny' },
  { first_name: 'Dor', last_name: 'Alagem' },
  { first_name: 'Yuval', last_name: 'Oren' }
];

const getAbout = (req, res) => {
  logger.info({ endpoint: '/api/about' }, 'endpoint accessed');
  try {
    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { getAbout };
