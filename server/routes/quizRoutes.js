const express = require('express');
const router = express.Router();
// Import submitQuiz
const { createQuiz, getQuizzes, getQuizById, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('teacher', 'admin'), createQuiz);
router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);

// Route for a student to submit their answers
router.post('/submit/:id', protect, submitQuiz);

module.exports = router;