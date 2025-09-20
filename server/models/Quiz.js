// /server/models/Quiz.js

const mongoose = require('mongoose');

// This defines the structure for a single question within a quiz
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // An array of strings for the multiple-choice options
    required: true,
    validate: [arr => arr.length === 4, 'A question must have exactly 4 options.'],
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
});

// This is the main schema for the entire quiz
const quizSchema = new mongoose.Schema({
  ageGroup: {
  type: String,
  required: true,
  enum: ['8-12', '12-15', '15-20', 'All'],
  default: 'All',
},
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  
  // This field directly links the quiz to its official source
  source: {
    type: String,
    required: true,
    default: 'NCERT',
  },
  questions: [questionSchema], // An array of questions using the schema above
}, {
  timestamps: true,
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;