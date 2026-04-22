const User = require('../models/User');
const sendEmail = require('../utils/email');
const { welcomeEmailTemplate } = require('../utils/emailTemplates');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');
const { userToDTO } = require('../dtos/user.dto');

exports.register = async (data) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error('Email already registered');

  data.password = await hashPassword(data.password);
  const user = await User.create(data);
  
  sendEmail({
    email: user.email,
    subject: 'Welcome to KataKara E-Commerce Store! 🛍️',
    html: welcomeEmailTemplate(user.name)
  }).catch(err => console.error('Welcome email failed:', err));

  return {
    token: signToken({ id: user._id.toString(), role: user.role }),
    user: userToDTO(user)
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

  return {
    token: signToken({ id: user._id.toString(), role: user.role }),
    user: userToDTO(user)
  };
};
