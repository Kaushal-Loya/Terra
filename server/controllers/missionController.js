// /server/controllers/missionController.js

const Mission = require('../models/Mission');

// @desc    Get all missions
// @route   GET /api/missions
// @access  Public
const getMissions = async (req, res) => {
  // Find missions matching the user's age group OR marked for 'All' ages
  const missions = await Mission.find({ 
    ageGroup: { $in: [req.user.ageGroup, 'All'] } 
  });
  res.json(missions);
};

// @desc    Create a new mission
// @route   POST /api/missions
// @access  Private
// /server/controllers/missionController.js
// ... (keep the getMissions function) ...

// @desc    Create a new mission
// @route   POST /api/missions
// @access  Private/Teacher/Admin
const createMission = async (req, res) => {
  // Get the new ageGroup field from the request body
  const { title, description, category, ecoCoins, ageGroup } = req.body;

  const mission = new Mission({
    title,
    description,
    category,
    ecoCoins,
    ageGroup, // Add the ageGroup
    createdBy: req.user._id, 
  });

  const createdMission = await mission.save();
  res.status(201).json(createdMission);
};

// ... (make sure to export createMission) ...

module.exports = { getMissions, createMission };