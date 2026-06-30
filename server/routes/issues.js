const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { fallbackIssues } = require('./fallback');

// Middleware to route to fallback if MongoDB disconnected
const useFallback = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next();
  }
  return next('route');
};

const getBadgeForPoints = (points) => {
  if (points >= 600) return 'legend';
  if (points >= 400) return 'hero';
  if (points >= 200) return 'active';
  return 'newcomer';
};

// Create a new issue
router.post('/', useFallback, upload.array('photos', 4), (req, res) => {
  fallbackIssues.create(req, res);
});

router.post('/', auth, upload.array('photos', 4), async (req, res) => {
  try {
    const { title, description, category, severity, address, lat, lng } = req.body;

    const files = req.files || [];
    const images = files.map(file => `/uploads/${file.filename}`);

    const issue = new Issue({
      title,
      description,
      category,
      severity,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      images,
      reportedBy: req.user._id
    });

    await issue.save();

    req.user.points += 20;
    req.user.reportsCount += 1;
    req.user.badge = getBadgeForPoints(req.user.points);
    await req.user.save();

    res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while reporting issue' });
  }
});

// Get all issues
router.get('/', useFallback, (req, res) => {
  fallbackIssues.getAll(req, res);
});

router.get('/', async (req, res) => {
  try {
    const { category, severity, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name badge points')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving issues' });
  }
});

// Get single issue details
router.get('/:id', useFallback, (req, res) => {
  fallbackIssues.getOne(req, res);
});

router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name badge points')
      .populate('assignedTo', 'name');

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving issue details' });
  }
});

// Upvote an issue
router.post('/:id/upvote', useFallback, (req, res) => {
  fallbackIssues.upvote(req, res);
});

router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    const upvoteIndex = issue.upvotedBy.indexOf(req.user._id);

    if (upvoteIndex > -1) {
      issue.upvotedBy.splice(upvoteIndex, 1);
      issue.upvotes = Math.max(0, issue.upvotes - 1);
    } else {
      issue.upvotedBy.push(req.user._id);
      issue.upvotes += 1;
    }

    await issue.save();
    res.json({ upvotes: issue.upvotes, hasUpvoted: upvoteIndex === -1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during upvote' });
  }
});

// Update issue status
router.patch('/:id/status', useFallback, (req, res) => {
  fallbackIssues.updateStatus(req, res);
});

router.patch('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status, department, assignedTo } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    if (status) {
      issue.status = status;
      if (status === 'resolved') {
        issue.resolvedAt = Date.now();
        const reporter = await User.findById(issue.reportedBy);
        if (reporter) {
          reporter.points += 50;
          reporter.badge = getBadgeForPoints(reporter.points);
          await reporter.save();
        }
      }
    }
    if (department) issue.department = department;
    if (assignedTo) issue.assignedTo = assignedTo;

    await issue.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('issueStatusUpdate', {
        issueId: issue._id,
        status: issue.status,
        updatedAt: issue.updatedAt
      });
    }

    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating status' });
  }
});

module.exports = router;
