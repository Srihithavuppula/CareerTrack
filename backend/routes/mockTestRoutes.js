const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllMockTests,
  getMockTest,
  submitMockTest,
  getUserAttempts,
} = require('../controllers/mockTestController');

router.get('/', authMiddleware, getAllMockTests);
router.get('/attempts', authMiddleware, getUserAttempts);
router.get('/:id', authMiddleware, getMockTest);
router.post('/:id/submit', authMiddleware, submitMockTest);

module.exports = router;