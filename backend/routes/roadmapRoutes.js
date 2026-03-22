const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  createRoadmap,
  getUserRoadmap,
  markDayComplete,
  getUserDashboard,
  deleteRoadmap,
  resetRoadmap,
  getSingleRoadmap,
} = require('../controllers/roadmapController');

router.post('/create', authMiddleware, createRoadmap);
router.get('/dashboard/all', authMiddleware, getUserDashboard);
router.get('/single/:roadmapId', authMiddleware, getSingleRoadmap);
router.get('/:courseId', authMiddleware, getUserRoadmap);
router.put('/complete', authMiddleware, markDayComplete);
router.put('/reset/:roadmapId', authMiddleware, resetRoadmap);
router.delete('/:roadmapId', authMiddleware, deleteRoadmap);

module.exports = router;