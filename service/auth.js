const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.registerUser = async (email, password) => {
  const [user] = await db('users')
    .insert({ email, password_hash: await bcrypt.hash(password, 10) })
    .returning('*');
  return user;
};
