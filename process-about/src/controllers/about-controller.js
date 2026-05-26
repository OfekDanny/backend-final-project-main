const { logger } = require('../utils/pino-logger');

/* Hardcoded list of project developers returned by the about endpoint */
const developers = [
  { first_name: 'Ofek', last_name: 'Danny' },
  { first_name: 'Dor', last_name: 'Alagem' },
  { first_name: 'Yuval', last_name: 'Oren' }
];

// GET /api/about — return the list of developers
const getAbout = (req, res) => {
  logger.info({ endpoint: '/api/about' }, 'endpoint accessed');
  try {
    // Send the hardcoded developer list as JSON
    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ id: 'internal_error', message: 'Internal server error' });
  }
};

module.exports = { getAbout };
