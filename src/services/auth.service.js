const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

exports.register = async (data) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error('Email already registered');

  data.password = await hashPassword(data.password);
  const user = await User.create(data);

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token: signToken({ id: user._id, role: user.role }),
    user: userObj
  };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token: signToken({ id: user._id, role: user.role }),
    user: userObj
  };
};
