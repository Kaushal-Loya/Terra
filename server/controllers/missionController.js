// /server/controllers/missionController.js

const Mission = require('../models/Mission');

// @desc    Get all missions
// @route   GET /api/missions
// @access  Public
const getMissions = async (req, res) => {
  const missions = await Mission.find({});
  res.json(missions);
};

// @desc    Create a new mission
// @route   POST /api/missions
// @access  Private
const createMission = async (req, res) => {
  const { title, description, category, ecoCoins } = req.body;

  const mission = new Mission({
    title,
    description,
    category,
    ecoCoins,
    createdBy: req.user._id, // Get user ID from the middleware
  });

  const createdMission = await mission.save();
  res.status(201).json(createdMission);
};

module.exports = { getMissions, createMission };