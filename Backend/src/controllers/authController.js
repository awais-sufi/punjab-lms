const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const createToken = require('../utils/createToken');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = asyncHandler(async (req, res) => {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required');
        error.statusCode = 400;
        throw error;
    }

    // Prevent creating a second admin
    if (role === 'admin') {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            const error = new Error('Admin already exists');
            error.statusCode = 409;
            throw error;
        }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email is already registered');
        error.statusCode = 409;
        throw error;
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ user: sanitizeUser(user), token: createToken(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  res.json({ user: sanitizeUser(user), token: createToken(user) });
});

const profile = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = { login, profile, register };
