const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  username: String,
  coins: Number,
  duration: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema);
