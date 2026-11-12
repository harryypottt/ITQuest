const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

module.exports = {
  JWT_SECRET: secret || 'your_access_token_secret',
  JWT_REFRESH_SECRET: refreshSecret || 'your_refresh_token_secret',
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
};