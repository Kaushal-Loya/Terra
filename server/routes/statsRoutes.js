// /server/routes/statsRoutes.js

const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// This route is protected and restricted to teachers and admins
router.get('/', protect, authorize('teacher', 'admin'), getStats);

module.exports = router;