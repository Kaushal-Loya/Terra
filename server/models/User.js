// /server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  ageGroup: {
    type: String,
    required: true,
    enum: ['8-12', '12-15', '15-20'],
  },
  school: {
    type: String,
  },
  ecoCoins: { type: Number, default: 0 },
  badges: [{ type: String }],
}, {
  timestamps: true, 
});

// Middleware to hash password before saving user to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;