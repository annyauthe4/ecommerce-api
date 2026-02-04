const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

exports.register = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error('Email already registered');

  data.password = await hashPassword(data.password);
  const user = await User.create(data);

  return {
    token: signToken({ id: user._id, role: user.role }),
    user
  };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  return {
    token: signToken({ id: user._id, role: user.role }),
    user
  };
};
