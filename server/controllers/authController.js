// /server/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // When this user is created, mongoose automatically sets ecoCoins to 0 because of the 'default' value in the schema.
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Because user was created successfully, user.ecoCoins exists and has a value of 0.
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        ecoCoins: user.ecoCoins,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    // Check if user exists AND if the password matches
    if (user && (await user.matchPassword(password))) {
      // If everything is correct, send back user data and a new token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        ecoCoins: user.ecoCoins,
        token: generateToken(user._id),
      });
    } else {
      // If user not found or password doesn't match, send an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerUser, loginUser };