const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/log-controller');

// Register log retrieval route
router.get('/api/logs', getLogs);

module.exports = router;
