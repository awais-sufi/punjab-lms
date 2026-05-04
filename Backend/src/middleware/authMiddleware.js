const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    const error = new Error('Authentication token is required');
    error.statusCode = 401;
    throw error;
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'replace-this-secret');
  const user = await User.findById(decoded.id).select('-password');

  if (!user || !user.isActive) {
    const error = new Error('User account is not available');
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error('You do not have permission to perform this action');
    error.statusCode = 403;
    next(error);
    return;
  }

  next();
};

module.exports = { authorize, protect };
