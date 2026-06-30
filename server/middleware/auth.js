const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, authorization denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Token is invalid or user no longer exists.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid, authorization denied.' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'department')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Authority privileges required.' });
  }
};

module.exports = { auth, admin };
