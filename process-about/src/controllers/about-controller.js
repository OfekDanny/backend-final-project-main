const { logger } = require('../utils/pino-logger');

// Developer names — stored in .env or hardcoded as fallback
const developers = [
  {
    first_name: process.env.DEV1_FIRST_NAME || 'Elad',
    last_name: process.env.DEV1_LAST_NAME || 'Asaf'
  },
  {
    first_name: process.env.DEV2_FIRST_NAME || 'Lidar',
    last_name: process.env.DEV2_LAST_NAME || 'Baruch'
  }
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
