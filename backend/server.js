const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
const Session = require('./Session');

// Save detox session
app.post('/add-session', async (req, res) => {
  const { username, coins, duration } = req.body;
  try {
    const session = new Session({ username, coins, duration });
    await session.save();
    res.status(201).json({ message: 'Session saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Get all sessions (leaderboard)
app.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ coins: -1 }).limit(10);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});
