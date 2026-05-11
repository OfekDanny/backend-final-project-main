const express = require('express');
const router = express.Router();

// Import expense and user handlers
const {
  addExpense,
  getAllExpenses,
  removeExpense,
  createUser,
  removeUser,
  removeReport
} = require('../controllers/expense-controller');

// Import purge/bulk-delete handlers
const {
  removeUsers,
  removeExpenses,
  removeReports
} = require('../controllers/purge-controller');

// Hardcoded developer list for the about endpoint
const developers = [
  // First team member
  {
    firstname: 'Ofek',
    lastname: 'Danny',
    id: '211539937',
    email: 'ofekdanny@gmail.com'
  },
  // Second team member
  {
    firstname: 'Dor',
    lastname: 'Alagem',
    id: '212088306',
    email: 'dor3382@gmail.com'
  },
  // Third team member
  {
    firstname: 'Yuval',
    lastname: 'Oren',
    id: '315140798',
    email: 'yuvaloren25@hotmail.com'
  }
];

// Read routes
router.get('/report', getAllExpenses);
router.get('/about', (req, res) => {
  res.json(developers);
});

// Write routes
router.post('/addcost', addExpense);
router.post('/adduser', createUser);

// Delete routes
router.delete('/removeuser', removeUser);
router.delete('/removereport', removeReport);
router.delete('/removecost', removeExpense);
router.delete('/purge-user', removeUsers);
router.delete('/purge-expenses', removeExpenses);
router.delete('/purge-reports', removeReports);

module.exports = router;
