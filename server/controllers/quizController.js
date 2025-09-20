// /server/controllers/quizController.js

const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Teacher/Admin
// /server/controllers/quizController.js

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Teacher/Admin
const createQuiz = async (req, res) => {
  try {
    // Get the new ageGroup field from the request body
    const { title, topic, source, questions, ageGroup } = req.body;

    const quiz = new Quiz({
      title,
      topic,
      source,
      questions,
      ageGroup, // Add the ageGroup
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz', error: error.message });
  }
};

// ... (make sure to export createQuiz) ...


// ... (keep the createQuiz function) ...

// @desc    Get all quizzes (without questions/answers)
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.aggregate([
      // Match documents where ageGroup is either the user's or 'All'
      { $match: { ageGroup: { $in: [req.user.ageGroup, 'All'] } } },
      {
        $project: {
          title: 1,
          topic: 1,
          source: 1,
          numberOfQuestions: { $size: "$questions" }
        }
      }
    ]);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single quiz by its ID (without answers)
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      // IMPORTANT: We must remove the correct answers before sending the quiz to the user.
      const quizForStudent = quiz.toObject(); // Convert Mongoose document to plain JS object
      quizForStudent.questions.forEach(q => {
        delete q.correctAnswerIndex;
      });

      res.json(quizForStudent);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Submit answers for a quiz and get results
// @route   POST /api/quizzes/submit/:id
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const userAnswers = req.body.answers; // Expecting an array of answer indices, e.g., [1, 2, 0]

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (userAnswers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Number of answers does not match number of questions.' });
    }

    let score = 0;
    const results = [];

    quiz.questions.forEach((question, index) => {
      const isCorrect = question.correctAnswerIndex === userAnswers[index];
      if (isCorrect) {
        score++;
      }
      results.push({
        questionText: question.questionText,
        yourAnswer: question.options[userAnswers[index]],
        correctAnswer: question.options[question.correctAnswerIndex],
        isCorrect: isCorrect,
      });
    });

    const ecoCoinsAwarded = score * 5; // Award 5 Eco-coins per correct answer

    if (ecoCoinsAwarded > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { ecoCoins: ecoCoinsAwarded } });
    }

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      ecoCoinsAwarded,
      results,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = { createQuiz, getQuizzes, getQuizById, submitQuiz };