
const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Waste Reduction', 'Energy Saving', 'Water Conservation', 'Community Cleanup'],
  },
  ecoCoins: { type: Number, required: true, default: 10 },
  // Link to the user who created the mission (e.g., a teacher or admin)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Mission = mongoose.model('Mission', missionSchema);
module.exports = Mission;