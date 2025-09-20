const express = require('express');
const router = express.Router();
const { 
  createSubmission, 
  getSubmissions, 
  updateSubmissionStatus,
  getMySubmissions // 1. Import the new function
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @route   POST /api/submissions
// @desc    Create a new submission with an image proof
// @access  Private
router.post('/', protect, upload.single('proofImage'), createSubmission);

// @route   GET /api/submissions/my
// @desc    Get the logged-in user's submissions
// @access  Private
// 2. Add the new route here, before routes with parameters like /:id
router.get('/my', protect, getMySubmissions);

// @route   GET /api/submissions
// @desc    Get all submissions
// @access  Private/Teacher/Admin
router.get('/', protect, authorize('teacher', 'admin'), getSubmissions);

// @route   PUT /api/submissions/:id
// @desc    Update a submission's status (approve/reject)
// @access  Private/Teacher/Admin
router.put('/:id', protect, authorize('teacher', 'admin'), updateSubmissionStatus);

module.exports = router;