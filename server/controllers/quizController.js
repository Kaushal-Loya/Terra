// /server/controllers/quizController.js

const Quiz = require('../models/Quiz');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Teacher/Admin
const createQuiz = async (req, res) => {
  try {
    const { title, topic, source, questions } = req.body;

    const quiz = new Quiz({
      title,
      topic,
      source,
      questions,
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz', error: error.message });
  }
};

module.exports = { createQuiz };