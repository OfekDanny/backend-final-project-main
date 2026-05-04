const express = require('express');
const router = express.Router();
const { addUser, getUsers, getUserById } = require('../controllers/user-controller');

router.post('/api/add', addUser);
router.get('/api/users', getUsers);
router.get('/api/users/:id', getUserById);

module.exports = router;
