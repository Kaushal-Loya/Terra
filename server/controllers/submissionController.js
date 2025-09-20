// /server/controllers/submissionController.js

const Submission = require('../models/Submission');
const Mission = require('../models/Mission');
const User = require('../models/User');

// @desc    Create new submission for a mission
// @route   POST /api/submissions
// @access  Private
const createSubmission = async (req, res) => {
  const { missionId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Proof image is required' });
  }

  const submission = new Submission({
    mission: missionId,
    user: req.user._id,
    proofImage: req.file.path, // Save the path of the uploaded file
  });

  const createdSubmission = await submission.save();
  res.status(201).json(createdSubmission);
};


// @desc    Get logged in user's submissions
// @route   GET /api/submissions/my
// @access  Private
const getMySubmissions = async (req, res) => {
  try {
    // req.user._id is available from our 'protect' middleware
    const submissions = await Submission.find({ user: req.user._id })
      .populate('mission', 'title ecoCoins category'); // Also get mission details

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all submissions (for teachers/admins)
// @route   GET /api/submissions
// @access  Private (should be restricted to teachers/admins in future)
const getSubmissions = async (req, res) => {
  const submissions = await Submission.find({}).populate('user', 'name').populate('mission', 'title');
  res.json(submissions);
};

// @desc    Update submission status (approve/reject)
// @route   PUT /api/submissions/:id
// @access  Private (should be restricted to teachers/admins)
// /server/controllers/submissionController.js

// ... (keep the other require statements)

// ... (keep createSubmission, getSubmissions, getMySubmissions)

// @desc    Update submission status (approve/reject)
// @route   PUT /api/submissions/:id
// @access  Private (should be restricted to teachers/admins)
const updateSubmissionStatus = async (req, res) => {
  const { status } = req.body;
  const submission = await Submission.findById(req.params.id);

  if (submission) {
    // Prevent re-awarding points if already approved
    if (submission.status === 'approved' && status === 'approved') {
        return res.status(400).json({ message: 'Submission has already been approved' });
    }

    submission.status = status;
    
    // If approved, find the mission and award Eco-coins to the user
    if (status === 'approved') {
      const mission = await Mission.findById(submission.mission);
      if (mission) {
        await User.findByIdAndUpdate(submission.user, { $inc: { ecoCoins: mission.ecoCoins } });

        // --- BADGE AWARDING LOGIC STARTS HERE ---

        const user = await User.findById(submission.user);

        // 1. Award "First Step" badge for the first approved submission
        if (!user.badges.includes('First Step')) {
          const approvedCount = await Submission.countDocuments({ user: submission.user, status: 'approved' });
          if (approvedCount === 1) { // The one we just approved is the first
            user.badges.push('First Step');
          }
        }
        
        // 2. Award "Waste Reduction Wiz" badge for completing 3 'Waste Reduction' missions
        if (!user.badges.includes('Waste Reduction Wiz') && mission.category === 'Waste Reduction') {
          // Find all missions in this category
          const wasteReductionMissions = await Mission.find({ category: 'Waste Reduction' }).select('_id');
          const missionIds = wasteReductionMissions.map(m => m._id);

          // Count how many of those missions the user has completed
          const categoryApprovedCount = await Submission.countDocuments({ 
            user: submission.user, 
            status: 'approved',
            mission: { $in: missionIds }
          });

          if (categoryApprovedCount >= 3) {
            user.badges.push('Waste Reduction Wiz');
          }
        }

        await user.save(); // Save any new badges to the user

        // --- BADGE AWARDING LOGIC ENDS HERE ---
      }
    }
    
    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);

  } else {
    res.status(404).json({ message: 'Submission not found' });
  }
};


module.exports = { createSubmission, getSubmissions, updateSubmissionStatus, getMySubmissions };

module.exports = { createSubmission, getSubmissions, updateSubmissionStatus, getMySubmissions };