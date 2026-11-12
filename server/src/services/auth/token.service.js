const jwt = require('jsonwebtoken');
const config = require('../../config/jwt');



const generateAccessToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  // Use a hardcoded fallback if the env variable is missing/invalid
  const expiresIn = (config.JWT_ACCESS_EXPIRATION && typeof config.JWT_ACCESS_EXPIRATION === 'string') 
    ? config.JWT_ACCESS_EXPIRATION 
    : '15m';
    console.log('🔐 Generating access token with secret:', config.JWT_SECRET);
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (user) => {
  const payload = { id: user.id, email: user.email };
  const expiresIn = (config.JWT_REFRESH_EXPIRATION && typeof config.JWT_REFRESH_EXPIRATION === 'string')
    ? config.JWT_REFRESH_EXPIRATION
    : '7d';
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn });
};

const verifyAccessToken = (token) => {
  console.log('🔍 Verifying access token with secret length:', config.JWT_SECRET.length);
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};