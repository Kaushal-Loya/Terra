// /server/routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const { createQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// This route is protected and restricted to teachers and admins
router.post('/', protect, authorize('teacher', 'admin'), createQuiz);

module.exports = router;