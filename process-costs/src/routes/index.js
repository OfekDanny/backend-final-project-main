const express = require('express');
const router = express.Router();
const { addCost, getReport } = require('../controllers/cost-controller');

// Register cost management routes
router.post('/api/add', addCost);
router.get('/api/report', getReport);

module.exports = router;
