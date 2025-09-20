// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is available because of our 'protect' middleware
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      ecoCoins: req.user.ecoCoins,
      badges: req.user.badges,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUserProfile };