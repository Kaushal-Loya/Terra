
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('EcoQuest API is running...');
});

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

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));