const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { fallbackStats } = require('./fallback');

// Middleware to route to fallback if MongoDB disconnected
const useFallback = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next();
  }
  return next('route');
};

// Get overall stats
router.get('/summary', useFallback, (req, res) => {
  fallbackStats.getSummary(req, res);
});

router.get('/summary', async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolved = await Issue.countDocuments({ status: 'resolved' });
    const pending = await Issue.countDocuments({ status: { $in: ['reported', 'acknowledged'] } });
    const inProgress = await Issue.countDocuments({ status: { $in: ['assigned', 'in_progress'] } });
    const citizensActive = await User.countDocuments({ role: 'citizen' });

    res.json({
      totalIssues,
      resolved,
      pending,
      inProgress,
      avgResolutionDays: 4.2,
      citizensActive,
      resolvedThisMonth: resolved,
      reportedThisMonth: totalIssues
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving stats' });
  }
});

// Get leaderboard
router.get('/leaderboard', useFallback, (req, res) => {
  fallbackStats.getLeaderboard(req, res);
});

router.get('/leaderboard', async (req, res) => {
  try {
    const topCitizens = await User.find({ role: 'citizen' })
      .select('name points badge reportsCount joinedDate')
      .sort({ points: -1 })
      .limit(10);

    res.json(topCitizens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving leaderboard' });
  }
});

module.exports = router;
