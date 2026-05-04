const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, isActive } = req.body;

    // If role is being set to admin, check if another admin exists
    if (role === 'admin') {
        const user = await User.findById(id);
        // If the user is not already an admin, then check for existing admin
        if (user && user.role !== 'admin') {
            const adminExists = await User.exists({ role: 'admin' });
            if (adminExists) {
                const error = new Error('Admin already exists');
                error.statusCode = 409;
                throw error;
            }
        }
    }

     const user = await User.findByIdAndUpdate(
         id,
         { role, isActive },
         { returnDocument: 'after', runValidators: true },
     ).select('-password');

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    const error = new Error('Admin cannot delete their own account');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: 'User deleted successfully' });
});

module.exports = { deleteUser, listUsers, updateUserRole };
