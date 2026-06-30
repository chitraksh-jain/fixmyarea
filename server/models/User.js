const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['citizen', 'admin', 'department'],
    default: 'citizen'
  },
  points: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    enum: ['newcomer', 'active', 'hero', 'legend', 'admin', 'dept'],
    default: 'newcomer'
  },
  reportsCount: {
    type: Number,
    default: 0
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
