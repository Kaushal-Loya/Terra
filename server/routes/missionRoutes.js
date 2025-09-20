const express = require('express');
const router = express.Router();
const { getMissions, createMission } = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   GET /api/missions
// @desc    Get all missions
// @access  Public
router.get('/', getMissions);

// @route   POST /api/missions
// @desc    Create a new mission
// @access  Private/Teacher/Admin
router.post('/', protect, authorize('teacher', 'admin'), createMission);

module.exports = router;