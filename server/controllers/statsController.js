// /server/controllers/statsController.js

const User = require('../models/User');
const Mission = require('../models/Mission');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');

// @desc    Get aggregate platform statistics
// @route   GET /api/stats
// @access  Private/Teacher/Admin
const getStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalMissions,
      totalSubmissions,
      approvedSubmissions,
      totalQuizzes,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Mission.countDocuments({}),
      Submission.countDocuments({}),
      Submission.countDocuments({ status: 'approved' }),
      Quiz.countDocuments({}),
    ]);

    res.json({
      totalStudents,
      totalMissions,
      totalSubmissions,
      approvedSubmissions,
      totalQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getStats };