const express = require('express');
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  removeExpense,
  createUser,
  removeUser,
  removeReport
} = require('../controllers/expense-controller');

const {
  removeUsers,
  removeExpenses,
  removeReports
} = require('../controllers/purge-controller');

// Define the developers array
const developers = [
  {
    firstname: 'Ofek',
    lastname: 'Danny',
    id: '211539937',
    email: 'ofekdanny@gmail.com'
  },
  {
    firstname: 'Dor',
    lastname: 'Alagem',
    id: '212088306',
    email: 'dor3382@gmail.com'
  },
  {
    firstname: 'Yuval',
    lastname: 'Oren',
    id: '315140798',
    email: 'yuvaloren25@hotmail.com'
  }
];

// setup the routes for the app
router.get('/report', getAllExpenses);
router.post('/addcost', addExpense);
router.post('/adduser', createUser);
router.get('/about', (req, res) => {
  res.json(developers);
});
router.delete('/removeuser', removeUser);
router.delete('/removereport', removeReport);
router.delete('/removecost', removeExpense);
router.delete('/purge-user', removeUsers);
router.delete('/purge-expenses', removeExpenses);
router.delete('/purge-reports', removeReports);
module.exports = router;
