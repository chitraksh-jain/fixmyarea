const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { fallbackAuth } = require('./fallback');

// Middleware to route to fallback if MongoDB disconnected
const useFallback = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next();
  }
  return next('route'); // skip to regular mongoose route handlers
};

// Signup User (with fallback)
router.post('/signup', useFallback, (req, res) => {
  fallbackAuth.signup(req, res);
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen',
      badge: role === 'admin' ? 'admin' : role === 'department' ? 'dept' : 'newcomer'
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345', { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badge: user.badge,
        reportsCount: user.reportsCount,
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login User (with fallback)
router.post('/login', useFallback, (req, res) => {
  fallbackAuth.login(req, res);
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345', { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badge: user.badge,
        reportsCount: user.reportsCount,
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get User Profile (with fallback)
router.get('/profile', auth, async (req, res) => {
  res.json({
    id: req.user._id || req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    points: req.user.points,
    badge: req.user.badge,
    reportsCount: req.user.reportsCount,
    joinedDate: req.user.joinedDate
  });
});

module.exports = router;
