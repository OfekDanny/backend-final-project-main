const express = require('express');
const router = express.Router();
const { getAbout } = require('../controllers/about-controller');

// Register about/developer information route
router.get('/api/about', getAbout);

module.exports = router;
