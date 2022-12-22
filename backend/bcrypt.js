const bcrypt = require("bcryptjs");

const saltRounds = 10;

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
  return hashedPassword;
}

async function checkPassword(password, hash) {
  const correctPassword = await bcrypt.compare(password, hash);
  console.log(correctPassword);
  return correctPassword;
}

module.exports = { hashPassword, checkPassword };
