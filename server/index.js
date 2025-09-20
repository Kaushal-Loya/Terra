// /server/index.js

// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // We will create this file next

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow server to accept JSON data in request body

// A simple test route
app.get('/', (req, res) => {
  res.send('EcoQuest API is running...');
});

// A simple test route
app.get('/', (req, res) => {
  res.send('EcoQuest API is running...');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const missionRoutes = require('./routes/missionRoutes');
app.use('/api/missions', missionRoutes);

const submissionRoutes = require('./routes/submissionRoutes');
app.use('/api/submissions', submissionRoutes);

const leaderboardRoutes = require('./routes/leaderboardRoutes');
app.use('/api/leaderboard', leaderboardRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ... other routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/quizzes', quizRoutes);
// ...

// Define the port to run on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));