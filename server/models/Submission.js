
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Mission',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  proofImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;