const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'replace-this-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
};

module.exports = createToken;
