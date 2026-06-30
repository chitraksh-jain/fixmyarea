const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const { auth } = require('../middleware/auth');
const { fallbackComments } = require('./fallback');

// Middleware to route to fallback if MongoDB disconnected
const useFallback = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next();
  }
  return next('route');
};

// Get comments for an issue
router.get('/:issueId', useFallback, (req, res) => {
  fallbackComments.get(req, res);
});

router.get('/:issueId', async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId })
      .populate('user', 'name badge')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving comments' });
  }
});

// Add a comment to an issue
router.post('/:issueId', useFallback, (req, res) => {
  fallbackComments.create(req, res);
});

router.post('/:issueId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const comment = new Comment({
      issue: req.params.issueId,
      user: req.user._id,
      text
    });

    await comment.save();

    issue.commentsCount += 1;
    await issue.save();

    const populatedComment = await comment.populate('user', 'name badge');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error adding comment' });
  }
});

module.exports = router;
