const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hash = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

const compare = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hash,
  compare,
};