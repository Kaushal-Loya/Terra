// /server/controllers/leaderboardController.js

const User = require('../models/User');

// @desc    Get top users for the leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ ecoCoins: -1 }) // Sort by ecoCoins in descending order
      .limit(10) // Get the top 10 users
      .select('-password'); // Exclude the password field

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getLeaderboard };